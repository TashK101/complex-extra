import functools
import locale
import re
import numpy
from enum import Enum

from .parserError import ParserError, ParserErrorType


def keyword_comparator(a, b):
    if len(a) > len(b):
        return -1
    if len(b) > len(a):
        return 1
    return locale.strcoll(a, b)


class TokenType(Enum):
    NONE = -1
    UNARY = 0  # unary operator, for example a minus
    BINARY = 1  # binary operator. Can be between parts of expression
    SEPAR = 2  # separator, a comma
    COMPAR = 3  # comparators. Must be between equations, no more that one per equation
    PARL = 4  # left parenthesis
    PARR = 5  # right parenthesis
    FUNC1 = 6  # function with one argument. Next comes an expression in parentheses
    FUNC2 = 7  # function with two arguments. Next comes two expressions in parentheses, with a comma between
    VAR = 8  # variable, one letter
    NUM = 9  # number
    CONST = 10  # constant


class ExpressionType(Enum):
    """
                    1 number
        value:      2 constant
                    3 variable

                    1 function1 left-parenthesis expression right-parenthesis
        function:   2 function2 left-parenthesis expression separator expression right-parenthesis

                    1 value
                    2 function
        expression: 3 unary_operator expression
                    4 left-parenthesis expression right-parenthesis
                    5 expression binary_operator expression

        equation:   1 expression comparator expression (not implemented)
    """
    NONE = -1
    VAL = 0
    FUNC = 1
    UNARY = 2
    PAR = 3
    BINARY = 4


class Token:
    def __init__(self, name: str, token_type: TokenType):
        self._name = name
        self._type = token_type

    @property
    def value(self):
        return self._name

    @property
    def type(self):
        return self._type


class Expression:
    def __init__(self, tokens, exp_type: ExpressionType):
        self._tokens = tokens
        self._type = exp_type

    @property
    def value(self):
        return self._tokens

    @property
    def type(self):
        return self._type


class Parser:
    constants = ['i', 'pi', 'e']
    unary_functions = ['real', 'im', 'sin', 'cos', 'tg', 'asin', 'acos', 'atg', 'ln', 'abs', 'phi', 'sh', 'ch', 'th', 'cth', 'sch', 'csch']
    binary_functions = ['log']
    keywords = {*constants, *unary_functions, *binary_functions}
    unary_operators = ['-']
    binary_operators = ['+', '-', '*', '/', '^']
    separators = [',']  # '.' excluded because it only exists within numbers, and we have a regexp for that
    comparators = []  # ['='] not supported
    parenthesis = ['(', ')']
    symbols = {*unary_operators, *binary_operators, *separators, *comparators, *parenthesis}
    value_token_types = [TokenType.VAR, TokenType.NUM, TokenType.CONST]
    par_pair = {'(': ')'}
    # sort from longest to shortest, so that longer ones are checked first. Wouldn't want to mistake 'im' for 'i'
    operators = sorted([*symbols, *keywords], key=functools.cmp_to_key(keyword_comparator))
    latin_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    number_r = r'^\d+(\.\d+)?'  # regexp for number, with digits and maybe a dot separator between them
    operator_priority = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}

    @staticmethod
    def try_get_expression(f: str, accept_error=False) -> tuple[bool, Expression]:
        try:
            tokens = Parser.tokenize(f)
        except ValueError as e:
            if accept_error:
                raise e
            return False, Expression([], ExpressionType.NONE)
        exp, rest = Parser._get_expression(tokens)
        if len(rest) > 0:
            if accept_error:
                raise ParserError(ParserErrorType.INVALID_EXPRESSION)
            return False, Expression([], ExpressionType.NONE)
        return True, exp

    @staticmethod
    def get_token_type(op: str, prev=TokenType.NONE):
        # minus can be both binary and unary
        if op in Parser.unary_operators:
            if not (op == '-' and (prev in Parser.value_token_types or prev == TokenType.PARR)):
                return TokenType.UNARY
        if op in Parser.binary_operators:
            return TokenType.BINARY
        if op in Parser.separators:
            return TokenType.SEPAR
        if op in Parser.comparators:
            return TokenType.COMPAR
        if op in Parser.parenthesis:
            if op in Parser.par_pair.keys():
                return TokenType.PARL
            if op in Parser.par_pair.values():
                return TokenType.PARR
            raise ValueError(f'Неизвестный оператор: {op}')
        if op in Parser.unary_functions:
            return TokenType.FUNC1
        if op in Parser.binary_functions:
            return TokenType.FUNC2
        if op in Parser.constants:
            return TokenType.CONST
        raise ValueError(f'Неизвестный оператор: {op}')

    @staticmethod
    def tokenize(f: str):
        f = f.replace(' ', '')
        result = []
        var_letter = ''
        while len(f) > 0:
            found_operator = False
            if not f[0].isdigit():
                for op in Parser.operators:  # check for known operators, functions, separators, etc.
                    if f.startswith(op):
                        f = f[len(op):]
                        result.append(
                            Token(op, Parser.get_token_type(op, prev='' if len(result) == 0 else result[-1].type)))
                        found_operator = True
                        break
                if found_operator:
                    continue
                # it's not an operator, so it's variable or number. Variable must have the same name across the equation
                if f[0] in Parser.latin_letters:
                    if var_letter == '':
                        var_letter = f[0]  # that's the variable name from now on
                        result.append(Token(f[0], TokenType.VAR))
                        f = f[1:]
                        continue
                    elif f[0] == var_letter:
                        result.append(Token(f[0], TokenType.VAR))
                        f = f[1:]
                        continue
                    else:  # not matching variable name
                        raise ParserError(ParserErrorType.TOO_MANY_VARIABLES, f'{var_letter}, {f[0]}')
                raise ParserError(ParserErrorType.UNKNOWN_TOKEN, f[0])  # it's not a digit, but nothing else matches
            else:  # that leaves digits
                num = re.search(Parser.number_r, f)[0]
                if num is None:
                    raise ParserError(ParserErrorType.UNKNOWN_TOKEN, f)
                result.append(Token(num, TokenType.NUM))
                f = f[len(num):]

        # value is next to different value, assume *. Not implemented for functions or parenthesis
        missing_mult = []
        for i in range(1, len(result)):
            if result[i - 1].type in Parser.value_token_types and result[i].type in Parser.value_token_types:
                missing_mult.append(i)
        for i in reversed(missing_mult):
            result = [*result[:i], Token('*', TokenType.BINARY), *result[i:]]
        return result

    @staticmethod
    def _is_expression(token: Token | Expression):
        return isinstance(token, Expression) and token.type != ExpressionType.NONE

    @staticmethod
    def _try_get_value(tokens: list[Token | Expression]):
        if len(tokens) == 1 and tokens[0].type in Parser.value_token_types:
            return True, Expression(tokens, ExpressionType.VAL)
        return False, None

    @staticmethod
    def _try_get_function(tokens: list[Token | Expression]):
        if len(tokens) < 4 or tokens[0].type not in [TokenType.FUNC1, TokenType.FUNC2]:
            # not a function
            return False, None
        if (tokens[1].type != TokenType.PARL
                or tokens[1].value not in Parser.par_pair.keys()
                or tokens[-1].type != TokenType.PARR
                or tokens[-1].value != Parser.par_pair[tokens[1].value]):
            return False, None  # wrong syntax

        # func1 ( exp )
        res, rest = Parser._get_expression(tokens[2:-1])
        if tokens[0].type == TokenType.FUNC1 and len(res.value) != 0 and len(rest) == 0:
            return True, Expression([*tokens[:2], res, tokens[-1]], ExpressionType.FUNC)

        if rest[0].type != TokenType.SEPAR or tokens[0].type != TokenType.FUNC2:
            return False, None  # wrong syntax

        tokens = [*tokens[:2], res, *rest]

        # func2 ( exp , exp )
        res2, rest2 = Parser._get_expression(rest[1:])
        if len(res2.value) != 0 and len(rest2) == 0:
            return True, Expression([*tokens[:2], res, rest[0], res2, tokens[-1]], ExpressionType.FUNC)
        return False, Expression(tokens, ExpressionType.NONE)

    @staticmethod
    def _try_get_unary(tokens: list[Token | Expression]):
        if tokens[0].type != TokenType.UNARY:
            return False, None
        res, rest = Parser._get_expression(tokens[1:])
        if len(res.value) != 0 and len(rest) == 0:
            return True, Expression([tokens[0], res], ExpressionType.UNARY)
        return False, None

    @staticmethod
    def _try_get_expression_in_parenthesis(tokens: list[Token | Expression]):
        if (tokens[0].type != TokenType.PARL
                or tokens[-1].type != TokenType.PARR
                or tokens[0].value not in Parser.par_pair.keys()
                or tokens[-1].value != Parser.par_pair[tokens[0].value]):
            return False, None
        res, rest = Parser._get_expression(tokens[1:-1])
        if len(res.value) != 0 and len(rest) == 0:
            return True, Expression([tokens[0], res, tokens[-1]], ExpressionType.PAR)
        return False, None

    @staticmethod
    def _try_get_binary(tokens: list[Token | Expression]):
        operators = []
        for i in range(len(tokens)):
            if tokens[i].type == TokenType.BINARY:
                operators.append((i, Parser.operator_priority[tokens[i].value]))
        if len(operators) == 0:
            return False, None
        operators = sorted(operators, key=functools.cmp_to_key(_priority_comparator))
        if len(tokens) < 3:
            return False, None
        for op in operators:
            res1, rest1 = Parser._get_expression(tokens[:op[0]])
            if len(res1.value) != 0 and len(rest1) == 0:
                tokens = [res1, *tokens[op[0]:]]
                res2, rest2 = Parser._get_expression(tokens[2:])
                if len(res2.value) != 0 and len(rest2) == 0:
                    return True, Expression([res1, tokens[1], res2], ExpressionType.BINARY)
                else:
                    return False, Expression(tokens, ExpressionType.NONE)
        return False, None

    @staticmethod
    def _get_expression(tokens: list[Token | Expression]) -> tuple[Expression, list[Token | Expression]]:
        if len(tokens) == 0:
            return Expression([], ExpressionType.NONE), tokens
        if len(tokens) == 1 and Parser._is_expression(tokens[0]):
            return tokens[0], []
        # case1 - value
        is_value, res = Parser._try_get_value(tokens)
        if is_value:
            return res, []
        # case2 - function
        is_function, res = Parser._try_get_function(tokens)
        if is_function:
            return res, []
        # case3 - unary
        is_unary, res = Parser._try_get_unary(tokens)
        if is_unary:
            return res, []
        # case4 - parenthesis
        is_par, res = Parser._try_get_expression_in_parenthesis(tokens)
        if is_par:
            return res, []
        # case5 - binary
        is_binary, res = Parser._try_get_binary(tokens)
        if is_binary:
            return res, []
        elif res is not None:
            tokens = res.value
        res, rest = Parser._get_expression(tokens[:-1])
        return res, [*rest, tokens[-1]]


def _priority_comparator(a, b):
    if a[1] < b[1]:
        return -1
    if a[1] > b[1]:
        return 1
    return 0

def P2R(radii, angles):
    return radii * numpy.exp(1j*angles)

def R2P(x):
    return abs(x), numpy.angle(x)
import cmath
import numpy as np
from typing import Callable

from .parser import Expression, Token, TokenType, ExpressionType, Parser, ParserError, ParserErrorType


class Solver:
    constants = Parser.constants

    @staticmethod
    def get_lambda_for_array(exp: Expression) -> Callable[[list[complex]], list[list[complex]]]:
        f = Solver.get_lambda_function(exp)

        def wrapper(z_list: list[complex]) -> list[list[complex]]:
            result = []
            for z in z_list:
                value = f(z)
                result.append(value if isinstance(value, list) else [value])
            return result

        return wrapper

    @staticmethod
    def get_lambda_function(exp: Expression) -> Callable[[complex], complex | list[complex]]:
        if exp.type == ExpressionType.VAL:
            return Solver._get_solution_for_val(exp.value)
        if exp.type == ExpressionType.FUNC:
            return Solver._get_solution_for_func(exp.value)
        if exp.type == ExpressionType.UNARY:
            return Solver._get_solution_for_unary(exp.value)
        if exp.type == ExpressionType.PAR:
            return Solver._get_solution_for_par(exp.value)
        if exp.type == ExpressionType.BINARY:
            return Solver._get_solution_for_binary(exp.value)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, exp.type)

    @staticmethod
    def _get_solution_for_val(exp: list[Expression | Token]) -> Callable[[complex], complex]:
        value = exp[0].value
        e_type = exp[0].type
        if e_type == TokenType.CONST:
            if value == 'i':
                return lambda z: 1j
            elif value == 'pi':
                return lambda z: np.pi
            elif value == 'e':
                return lambda z: np.e
            else:
                raise ParserError(ParserErrorType.NOT_SUPPORTED, value)
        elif e_type == TokenType.NUM:
            return lambda x: float(value)
        else:
            return lambda z: z

    @staticmethod
    def _get_func1(f_name) -> Callable[[complex], complex]:
        if f_name == 'real':
            return lambda z: z.real
        if f_name == 'im':
            return lambda z: z.imag
        if f_name == 'sin':
            return lambda z: np.sin(z)
        if f_name == 'cos':
            return lambda z: np.cos(z)
        if f_name == 'tg':
            return lambda z: np.tan(z)
        if f_name == 'asin':
            return lambda z: np.arcsin(z)
        if f_name == 'acos':
            return lambda z: np.arccos(z)
        if f_name == 'atg':
            return lambda z: np.arctan(z)
        if f_name == 'ln':
            def ln_wrapper(z):
                if not isinstance(z, list):
                    z = [z]
                results = []
                for val in z:
                    results.extend(Solver.multi_valued_log(val))
                return results
            return ln_wrapper
        if f_name == 'abs':
            return lambda z: np.abs(z)
        if f_name == 'phi':
            return lambda z: cmath.phase(z)
        if f_name == 'sh':
            return lambda z: np.sinh(z)
        if f_name == 'ch':
            return lambda z: np.cosh(z)
        if f_name == 'th':
            return lambda z: np.tanh(z)
        if f_name == 'cth':
            return lambda z: 1 / np.tanh(z)
        if f_name == 'sch':
            return lambda z: 1 / np.cosh(z)
        if f_name == 'csch':
            return lambda z: 1 / np.sinh(z)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, f_name)

    @staticmethod
    def _get_func2(f_name):
        def apply_func(f, x, y):
            if not isinstance(x, list):
                x = [x]
            if not isinstance(y, list):
                y = [y]
            results = []
            for a in x:
                for b in y:
                    results.extend(f(a, b))
            return results

        if f_name == 'log':
            return lambda x, y: apply_func(lambda a, b: Solver.multi_valued_log(a, b), x, y)

        if f_name == 'root':
            def multi_valued_root(x, n):
                x = complex(x)
                n = int(n.real)
                r = abs(x) ** (1 / n)
                theta = cmath.phase(x)
                return [r * cmath.exp(1j * (theta + 2 * np.pi * k) / n) for k in range(n)]
            return lambda x, y: apply_func(multi_valued_root, x, y)

        raise ParserError(ParserErrorType.NOT_SUPPORTED, f_name)

    @staticmethod
    def _apply_op(a, b, op):
        if not isinstance(a, list):
            a = [a]
        if not isinstance(b, list):
            b = [b]
        return [op(x, y) for x in a for y in b]

    @staticmethod
    def _get_solution_for_func(exp: list[Expression | Token]) -> Callable[[complex], complex | list[complex]]:
        if exp[0].type == TokenType.FUNC1:
            solve = Solver._get_func1(exp[0].value)
            return lambda z: solve((Solver.get_lambda_function(exp[2]))(z))
        elif exp[0].type == TokenType.FUNC2:
            func_name = exp[0].value
            solve1 = Solver.get_lambda_function(exp[2])
            solve2 = Solver.get_lambda_function(exp[4])
            return lambda z: Solver._get_func2(func_name)(solve1(z), solve2(z))
        raise ParserError(ParserErrorType.NOT_SUPPORTED, exp[0].value)

    @staticmethod
    def _get_solution_for_unary(exp: list[Expression | Token]) -> Callable[[complex], complex]:
        value = exp[0].value
        e_type = exp[0].type
        if e_type == TokenType.UNARY:
            if value == '-':
                return lambda z: -Solver.get_lambda_function(exp[1])(z)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, value)

    @staticmethod
    def _get_solution_for_par(exp: list[Expression | Token]) -> Callable[[complex], complex]:
        value = exp[0].value
        if exp[0].type == TokenType.PARL and exp[2].type == TokenType.PARR:
            return lambda z: Solver.get_lambda_function(exp[1])(z)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, value)
    
    @staticmethod
    def multi_valued_log(x: complex, base: complex = np.e, k_range=range(-6, 6)) -> list[complex]:
        x = complex(x)
        base = complex(base)
        r = abs(x)
        theta = cmath.phase(x)
        logs = []
        logb = np.log(abs(base)) + 1j * cmath.phase(base)
        for k in k_range:
            logx = np.log(r) + 1j * (theta + 2 * np.pi * k)
            logs.append(logx / logb)
        return logs


    @staticmethod
    def _get_solution_for_binary(exp: list[Expression | Token]) -> Callable[[complex], complex | list[complex]]:
        if exp[1].type == TokenType.BINARY:
            op = exp[1].value
            solve1 = Solver.get_lambda_function(exp[0])
            solve2 = Solver.get_lambda_function(exp[2])

            if op == '+':
                return lambda z: Solver._apply_op(solve1(z), solve2(z), lambda x, y: x + y)
            if op == '-':
                return lambda z: Solver._apply_op(solve1(z), solve2(z), lambda x, y: x - y)
            if op == '*':
                return lambda z: Solver._apply_op(solve1(z), solve2(z), lambda x, y: x * y)
            if op == '/':
                return lambda z: Solver._apply_op(solve1(z), solve2(z), lambda x, y: x / y)
            if op == '^':
                return lambda z: Solver._apply_op(solve1(z), solve2(z), lambda x, y: x ** y)

        raise ParserError(ParserErrorType.NOT_SUPPORTED, exp[1].value)

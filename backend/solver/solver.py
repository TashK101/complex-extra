import cmath
import numpy as np
from typing import Callable

from .parser import Expression, Token, TokenType, ExpressionType, Parser, ParserError, ParserErrorType


class Solver:
    constants = Parser.constants

    @staticmethod
    def get_lambda_for_array(exp: Expression) -> Callable[[list[complex]], list[list[complex]]]:
        f = Solver.get_lambda_function(exp)

        def wrapper(z_list: list[complex], **kwargs) -> list[list[complex]]:
            result = []
            for z in z_list:
                value = f(z, **kwargs)
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
                return lambda z, **kwargs: 1j
            elif value == 'pi':
                return lambda z, **kwargs: np.pi
            elif value == 'e':
                return lambda z, **kwargs: np.e
            else:
                raise ParserError(ParserErrorType.NOT_SUPPORTED, value)
        elif e_type == TokenType.NUM:
            return lambda x, **kwargs: float(value)
        else:
            return lambda z, **kwargs: z

    @staticmethod
    def _get_func1(f_name) -> Callable[[complex], complex]:
        if f_name == 'real':
            return lambda z, **kwargs: z.real
        if f_name == 'im':
            return lambda z, **kwargs: z.imag
        if f_name == 'sin':
            return lambda z, **kwargs: np.sin(z)
        if f_name == 'cos':
            return lambda z, **kwargs: np.cos(z)
        if f_name == 'tg':
            return lambda z, **kwargs: np.tan(z)
        if f_name == 'ctg':
            return lambda z, **kwargs: 1 / np.tan(z)
        if f_name == 'asin':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_asin(z, k_range=range(-num_branches, num_branches + 1))
        if f_name == 'acos':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_acos(z, range(-num_branches, num_branches + 1))
        if f_name == 'atg':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_atg(z, range(-num_branches, num_branches + 1))
        if f_name == 'actg':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_actg(z, range(-num_branches, num_branches + 1))
        if f_name == 'ln':
            def ln_wrapper(z, num_branches=6, **kwargs):
                if not isinstance(z, list):
                    z = [z]
                results = []
                for val in z:
                    results.extend(Solver.multi_valued_log(val, k_range=range(-num_branches, num_branches + 1)))
                return results
            return ln_wrapper
        if f_name == 'abs':
            return lambda z, **kwargs: np.abs(z)
        if f_name == 'phi':
            return lambda z, **kwargs: cmath.phase(z)
        if f_name == 'sh':
            return lambda z, **kwargs: np.sinh(z)
        if f_name == 'ch':
            return lambda z, **kwargs: np.cosh(z)
        if f_name == 'th':
            return lambda z, **kwargs: np.tanh(z)
        if f_name == 'cth':
            return lambda z, **kwargs: 1 / np.tanh(z)
        if f_name == 'sch':
            return lambda z, **kwargs: 1 / np.cosh(z)
        if f_name == 'csch':
            return lambda z, **kwargs: 1 / np.sinh(z)
        if f_name == 'arsh':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_arsh(z, range(-num_branches, num_branches + 1))
        if f_name == 'arch':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_arch(z, range(-num_branches, num_branches + 1))
        if f_name == 'arth':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_arth(z, range(-num_branches, num_branches + 1))
        if f_name == 'arcth':
            return lambda z, num_branches=6, **kwargs: Solver.multi_valued_arcth(z, range(-num_branches, num_branches + 1))
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
    def multi_valued_asin(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        root = cmath.sqrt(1 - z**2)
        log_inputs = 1j * z + root
        log_vals = Solver.multi_valued_log(log_inputs, k_range=k_range)
        return [-1j * val for val in log_vals]
    
    @staticmethod
    def multi_valued_acos(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        root = cmath.sqrt(1 - z**2)
        log_vals = Solver.multi_valued_log(z + root, k_range=k_range)
        return [cmath.pi/2 - (-1j * val) for val in log_vals]  # acos = π/2 - asin(z)

    @staticmethod
    def multi_valued_atg(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        log1 = Solver.multi_valued_log(1 + 1j * z, k_range=k_range)
        log2 = Solver.multi_valued_log(1 - 1j * z, k_range=k_range)
        return [0.5j * (a - b) for a in log1 for b in log2]

    @staticmethod
    def multi_valued_actg(z: complex, k_range=range(-6, 6)) -> list[complex]:
        results = Solver.multi_valued_atg(1 / z, k_range=k_range)
        return [cmath.pi/2 - w for w in results]

    @staticmethod
    def multi_valued_arsh(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        root = cmath.sqrt(z**2 + 1)
        log_vals = Solver.multi_valued_log(z + root, k_range=k_range)
        return [val for val in log_vals]

    @staticmethod
    def multi_valued_arch(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        root = cmath.sqrt(z**2 - 1)
        log_vals = Solver.multi_valued_log(z + root, k_range=k_range)
        return [val for val in log_vals]

    @staticmethod
    def multi_valued_arth(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        log1 = Solver.multi_valued_log(1 + z, k_range=k_range)
        log2 = Solver.multi_valued_log(1 - z, k_range=k_range)
        return [0.5 * (a - b) for a in log1 for b in log2]

    @staticmethod
    def multi_valued_arcth(z: complex, k_range=range(-6, 6)) -> list[complex]:
        z = complex(z)
        inner = Solver.multi_valued_arth(1 / z, k_range=k_range)
        return [1 / val for val in inner if val != 0]


    
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
            inner = Solver.get_lambda_function(exp[2])
            return lambda z, **kwargs: solve(inner(z, **kwargs), **kwargs)
        elif exp[0].type == TokenType.FUNC2:
            func_name = exp[0].value
            solve1 = Solver.get_lambda_function(exp[2])
            solve2 = Solver.get_lambda_function(exp[4])
            return lambda z, **kwargs: Solver._get_func2(func_name)(solve1(z, **kwargs), solve2(z, **kwargs))
        raise ParserError(ParserErrorType.NOT_SUPPORTED, exp[0].value)

    @staticmethod
    def _get_solution_for_unary(exp: list[Expression | Token]) -> Callable[[complex], complex]:
        value = exp[0].value
        e_type = exp[0].type
        if e_type == TokenType.UNARY:
            if value == '-':
                return lambda z, **kwargs: -Solver.get_lambda_function(exp[1])(z, **kwargs)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, value)

    @staticmethod
    def _get_solution_for_par(exp: list[Expression | Token]) -> Callable[[complex], complex]:
        value = exp[0].value
        if exp[0].type == TokenType.PARL and exp[2].type == TokenType.PARR:
            return lambda z, **kwargs: Solver.get_lambda_function(exp[1])(z, **kwargs)
        raise ParserError(ParserErrorType.NOT_SUPPORTED, value)

    @staticmethod
    def _get_solution_for_binary(exp: list[Expression | Token]) -> Callable[[complex], complex | list[complex]]:
        if exp[1].type == TokenType.BINARY:
            op = exp[1].value
            solve1 = Solver.get_lambda_function(exp[0])
            solve2 = Solver.get_lambda_function(exp[2])

            if op == '+':
                return lambda z, **kwargs: Solver._apply_op(solve1(z, **kwargs), solve2(z, **kwargs), lambda x, y: x + y)
            if op == '-':
                return lambda z, **kwargs: Solver._apply_op(solve1(z, **kwargs), solve2(z, **kwargs), lambda x, y: x - y)
            if op == '*':
                return lambda z, **kwargs: Solver._apply_op(solve1(z, **kwargs), solve2(z, **kwargs), lambda x, y: x * y)
            if op == '/':
                return lambda z, **kwargs: Solver._apply_op(solve1(z, **kwargs), solve2(z, **kwargs), lambda x, y: x / y)
            if op == '^':
                return lambda z, **kwargs: Solver._apply_op(solve1(z, **kwargs), solve2(z, **kwargs), lambda x, y: x ** y)

        raise ParserError(ParserErrorType.NOT_SUPPORTED, exp[1].value)
    

    
    


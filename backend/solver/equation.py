from .parser import Parser, Expression, ExpressionType
from .solver import Solver


class Equation:
    def __init__(self, function_string):
        self._func_str = function_string
        self._expression: Expression | None = None
        self._func = None

    @property
    def function_string(self):
        return self._func_str

    def is_parsed(self):
        return self._expression is not None and self._expression.type != ExpressionType.NONE

    @property
    def expression(self):
        if self._expression is None:
            _, self._expression = Parser.try_get_expression(self._func_str)
        return self._expression

    @property
    def function(self):
        if self._func is not None:
            return self._func
        if not self.is_parsed():
            return None
        self._func = Solver.get_solution_for_array(self.expression)
        return self._func

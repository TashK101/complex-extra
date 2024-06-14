from enum import Enum


class ParserErrorType(Enum):
    UNKNOWN_TOKEN = 1
    TOO_MANY_VARIABLES = 2
    NOT_SUPPORTED = 3
    INVALID_EXPRESSION = 4


class ParserError(ValueError):
    def __init__(self, error_type: ParserErrorType, text: str = ''):
        self.type = error_type
        self.text_value = text

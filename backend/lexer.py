import re
from backend.utils import Token, TokenType

def tokenize(expression: str) -> list[Token]:
    tokens = []
    position = 0
    length = len(expression)
    
    while position < length:
        char = expression[position]
        
        # Skip whitespaces
        if char.isspace():
            position += 1
            continue
            
        # Match identifier (variable)
        match = re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*', expression[position:])
        if match:
            value = match.group(0)
            tokens.append(Token(type=TokenType.IDENTIFIER, value=value, position=position))
            position += len(value)
            continue
            
        # Match number
        match = re.match(r'^\d+(\.\d+)?', expression[position:])
        if match:
            value = match.group(0)
            tokens.append(Token(type=TokenType.NUMBER, value=value, position=position))
            position += len(value)
            continue
            
        # Match multi-character relational / logical
        match = re.match(r'^(>=|<=|==|!=|&&|\|\|)', expression[position:])
        if match:
            value = match.group(0)
            token_type = TokenType.LOGICAL_OPERATOR if value in ('&&', '||') else TokenType.RELATIONAL_OPERATOR
            tokens.append(Token(type=token_type, value=value, position=position))
            position += len(value)
            continue
            
        # Match single-character relational and assignment
        if char in '><=':
            token_type = TokenType.ASSIGN if char == '=' else TokenType.RELATIONAL_OPERATOR
            tokens.append(Token(type=token_type, value=char, position=position))
            position += 1
            continue
            
        # Match operator
        if char in '+-*/':
            tokens.append(Token(type=TokenType.OPERATOR, value=char, position=position))
            position += 1
            continue
            
        # Match parenthesis
        if char in '()':
            tokens.append(Token(type=TokenType.PARENTHESIS, value=char, position=position))
            position += 1
            continue
            
        # Unrecognized character
        tokens.append(Token(type=TokenType.UNKNOWN, value=char, position=position))
        position += 1
        
    tokens.append(Token(type=TokenType.EOF, value="", position=position))
    return tokens

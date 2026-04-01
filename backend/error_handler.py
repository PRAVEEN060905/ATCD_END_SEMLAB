from backend.lexer import tokenize
from backend.utils import TokenType

def analyze_errors(expression: str):
    tokens = tokenize(expression)

    errors = []
    suggestions = []
    
    if not tokens or (len(tokens) == 1 and tokens[0].type == TokenType.EOF):
         return {"errors": ["Empty expression"], "suggestions": []}
         
    # Check unknown tokens
    for t in tokens:
        if t.type == TokenType.UNKNOWN:
            errors.append(f"Unrecognized character '{t.value}' at position {t.position}")
            suggestions.append(expression.replace(t.value, ""))

    # Check unbalanced parentheses
    open_parens = 0
    for t in tokens:
        if t.type == TokenType.PARENTHESIS:
            if t.value == '(':
                open_parens += 1
            elif t.value == ')':
                open_parens -= 1
                if open_parens < 0:
                    errors.append(f"Unmatched closing parenthesis at position {t.position}")
                    
    if open_parens > 0:
        errors.append(f"Missing {open_parens} closing parenthesis")
        suggestions.append(expression + ")" * open_parens)
        
    # Check invalid sequences (Operator immediately followed by Operator)
    for i in range(len(tokens) - 1):
        curr = tokens[i]
        nxt = tokens[i+1]
        
        if curr.type == TokenType.EOF:
            break
            
        op_types = [TokenType.OPERATOR, TokenType.ASSIGN, TokenType.RELATIONAL_OPERATOR, TokenType.LOGICAL_OPERATOR]
        
        if curr.type in op_types and nxt.type in op_types:
            errors.append(f"Consecutive operators '{curr.value}' and '{nxt.value}'")
            # Suggesting to insert a variable
            suggestions.append(expression[:nxt.position] + " x " + expression[nxt.position:])
            # Suggesting to remove one
            suggestions.append(expression[:curr.position] + curr.value + " " + expression[nxt.position+len(nxt.value):])
            
        if curr.type in [TokenType.IDENTIFIER, TokenType.NUMBER] and nxt.type in [TokenType.IDENTIFIER, TokenType.NUMBER]:
            errors.append(f"Missing operator between '{curr.value}' and '{nxt.value}'")
            suggestions.append(expression[:nxt.position] + " * " + expression[nxt.position:])
            suggestions.append(expression[:nxt.position] + " + " + expression[nxt.position:])
            
        if curr.type in op_types and nxt.type == TokenType.EOF:
            errors.append(f"Missing operand after operator '{curr.value}'")
            suggestions.append(expression + " x")
            
        if curr.value == '(' and nxt.type in op_types and nxt.value not in ['+', '-']:
            errors.append(f"Invalid operator '{nxt.value}' after '('")
            
        if curr.type in [TokenType.IDENTIFIER, TokenType.NUMBER] and nxt.value == '(':
            errors.append(f"Missing operator before '('")
            suggestions.append(expression[:nxt.position] + " * " + expression[nxt.position:])
            
        if curr.value == ')' and nxt.type in [TokenType.IDENTIFIER, TokenType.NUMBER]:
            errors.append(f"Missing operator after ')'")
            suggestions.append(expression[:nxt.position] + " * " + expression[nxt.position:])
            
        if curr.value == '(' and nxt.value == ')':
            errors.append("Empty parentheses are not allowed")
            suggestions.append(expression[:curr.position] + "0" + expression[nxt.position+1:])
            suggestions.append(expression[:curr.position] + expression[nxt.position+1:])
            
    # Deduplicate and clean up suggestions
    unique_suggestions = list(dict.fromkeys(suggestions)) # preserves order
    
    return {
        "errors": list(set(errors)), # Deduplicate errors
        "suggestions": unique_suggestions[:5] # Limit to top 5
    }

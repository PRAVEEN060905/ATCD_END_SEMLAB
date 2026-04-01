from backend.utils import Token, TokenType

def infix_to_postfix(tokens: list[Token]):
    precedence = {
        '=': 0,
        '||': 1,
        '&&': 2,
        '<': 3, '>': 3, '<=': 3, '>=': 3, '==': 3, '!=': 3,
        '+': 4, '-': 4, 
        '*': 5, '/': 5
    }
    stack = []
    queue = []
    steps = []
    
    for token in tokens:
        if token.type == TokenType.EOF:
            break
            
        step_entry = {
            "current_token": token.model_dump(),
            "action": ""
        }
            
        if token.type in (TokenType.IDENTIFIER, TokenType.NUMBER):
            queue.append(token.value)
            step_entry["action"] = f"Push operand {token.value} to queue"
        elif token.type in (TokenType.OPERATOR, TokenType.ASSIGN, TokenType.RELATIONAL_OPERATOR, TokenType.LOGICAL_OPERATOR):
            while (stack and stack[-1] != '(' and 
                   precedence.get(stack[-1], -1) >= precedence.get(token.value, -1)):
                popped = stack.pop()
                queue.append(popped)
            stack.append(token.value)
            step_entry["action"] = f"Push operator {token.value} to stack"
        elif token.type == TokenType.PARENTHESIS and token.value == '(':
            stack.append(token.value)
            step_entry["action"] = "Push '(' to stack"
        elif token.type == TokenType.PARENTHESIS and token.value == ')':
            while stack and stack[-1] != '(':
                queue.append(stack.pop())
            if stack and stack[-1] == '(':
                stack.pop() # pop '('
            step_entry["action"] = "Pop stack until '('"
            
        if token.type != TokenType.UNKNOWN:
            # Save state
            step_entry["stack"] = list(stack)
            step_entry["queue"] = list(queue)
            steps.append(step_entry)
            
    # Pop remaining stack
    while stack:
        op = stack.pop()
        queue.append(op)
        steps.append({
            "current_token": None,
            "action": f"Pop remaining {op} from stack",
            "stack": list(stack),
            "queue": list(queue)
        })
        
    postfix_expr = " ".join(queue)
    return {
        "postfix": postfix_expr,
        "steps": steps
    }

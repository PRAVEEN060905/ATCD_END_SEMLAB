from backend.utils import Token, TokenType, ParseNode

class Parser:
    def __init__(self, tokens):
        # Filter out UNKNOWN or whitespace if any
        self.tokens = [t for t in tokens if t.type != TokenType.UNKNOWN]
        self.current = 0

    def peek(self):
        return self.tokens[self.current] if self.current < len(self.tokens) else Token(type=TokenType.EOF, value="", position=-1)

    def consume(self, expected_type=None, expected_value=None):
        token = self.peek()
        if expected_type and token.type != expected_type:
            raise Exception(f"Expected type {expected_type}, got {token.type}")
        if expected_value and token.value != expected_value:
            raise Exception(f"Expected value {expected_value}, got {token.value}")
        self.current += 1
        return token

    def check(self, expected_type=None, expected_value=None):
        token = self.peek()
        if expected_type and token.type != expected_type:
             return False
        if expected_value and token.value != expected_value:
             return False
        return True

    def parse(self):
        try:
            node = self.parse_S()
            if self.peek().type != TokenType.EOF:
                raise Exception(f"Unexpected token {self.peek().value}")
            return node
        except Exception as e:
            return ParseNode("Error", value=str(e))

    def parse_S(self):
        # S -> id = E | E
        if self.check(TokenType.IDENTIFIER):
            if self.current + 1 < len(self.tokens) and self.tokens[self.current + 1].type == TokenType.ASSIGN:
                id_node = ParseNode("id", value=self.consume().value)
                assign_op = self.consume(TokenType.ASSIGN).value
                node = ParseNode("S")
                node.children.append(id_node)
                node.children.append(ParseNode("op", value=assign_op))
                node.children.append(self.parse_E())
                return node
        # Fall back to E
        node = ParseNode("S")
        node.children.append(self.parse_E())
        return node

    def parse_E(self):
        # E -> T E_prime (||)
        node = ParseNode("E")
        node.children.append(self.parse_T())
        node.children.extend(self.parse_E_prime())
        return node

    def parse_E_prime(self):
        children = []
        if self.check(TokenType.LOGICAL_OPERATOR, '||'):
            children.append(ParseNode("op", value=self.consume().value))
            children.append(self.parse_T())
            children.extend(self.parse_E_prime())
        return children

    def parse_T(self):
        # T -> R T_prime (&&)
        node = ParseNode("T")
        node.children.append(self.parse_R())
        node.children.extend(self.parse_T_prime())
        return node

    def parse_T_prime(self):
        children = []
        if self.check(TokenType.LOGICAL_OPERATOR, '&&'):
            children.append(ParseNode("op", value=self.consume().value))
            children.append(self.parse_R())
            children.extend(self.parse_T_prime())
        return children

    def parse_R(self):
        # R -> A R_prime (relational)
        node = ParseNode("R")
        node.children.append(self.parse_A())
        node.children.extend(self.parse_R_prime())
        return node

    def parse_R_prime(self):
        children = []
        if self.check(TokenType.RELATIONAL_OPERATOR):
            children.append(ParseNode("op", value=self.consume().value))
            children.append(self.parse_A())
            children.extend(self.parse_R_prime())
        return children

    def parse_A(self):
        # A -> B A_prime (+ -)
        node = ParseNode("A")
        node.children.append(self.parse_B())
        node.children.extend(self.parse_A_prime())
        return node

    def parse_A_prime(self):
        children = []
        if self.check(TokenType.OPERATOR, '+') or self.check(TokenType.OPERATOR, '-'):
            children.append(ParseNode("op", value=self.consume().value))
            children.append(self.parse_B())
            children.extend(self.parse_A_prime())
        return children

    def parse_B(self):
        # B -> C B_prime (* /)
        node = ParseNode("B")
        node.children.append(self.parse_C())
        node.children.extend(self.parse_B_prime())
        return node

    def parse_B_prime(self):
        children = []
        if self.check(TokenType.OPERATOR, '*') or self.check(TokenType.OPERATOR, '/'):
            children.append(ParseNode("op", value=self.consume().value))
            children.append(self.parse_C())
            children.extend(self.parse_B_prime())
        return children

    def parse_C(self):
        # C -> (E) | id | num
        node = ParseNode("C")
        if self.check(TokenType.PARENTHESIS, '('):
            node.children.append(ParseNode("paren", value=self.consume().value))
            node.children.append(self.parse_E())
            node.children.append(ParseNode("paren", value=self.consume(TokenType.PARENTHESIS, ')').value))
        elif self.check(TokenType.IDENTIFIER):
            node.children.append(ParseNode("id", value=self.consume().value))
        elif self.check(TokenType.NUMBER):
            node.children.append(ParseNode("num", value=self.consume().value))
        else:
             raise Exception(f"Unexpected token {self.peek().value} in C")
        return node

def generate_parse_tree(tokens):
    parser = Parser(tokens)
    tree = parser.parse()
    return tree

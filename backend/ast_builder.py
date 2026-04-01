from backend.utils import ParseNode, ASTNode

def build_ast(parse_node: ParseNode) -> ASTNode:
    if parse_node.name == "Error":
        return ASTNode("Error", value=parse_node.value)

    if parse_node.name in ["S", "E", "T", "R", "A", "B"]:
        if not parse_node.children:
             return None
             
        # Check specific S logic for ASSIGN
        if parse_node.name == "S" and len(parse_node.children) == 3 and parse_node.children[1].name == "op" and parse_node.children[1].value == "=":
            id_ast = ASTNode("id", value=parse_node.children[0].value)
            right_ast = build_ast(parse_node.children[2])
            return ASTNode(op="=", left=id_ast, right=right_ast)
             
        # Children are in the format: [child, op_node, child, op_node, child]
        # Build first child
        current_ast = build_ast(parse_node.children[0])
        
        # Iterate over pairs of (op, child)
        for i in range(1, len(parse_node.children), 2):
            op_node = parse_node.children[i]
            next_child = build_ast(parse_node.children[i + 1])
            current_ast = ASTNode(op=op_node.value, left=current_ast, right=next_child)
            
        return current_ast

    if parse_node.name == "C":
        # children could be [paren, E, paren] or [id] or [num]
        if len(parse_node.children) == 3: # (E)
            return build_ast(parse_node.children[1])
        elif len(parse_node.children) == 1:
            child = parse_node.children[0]
            # It's 'id' or 'num', store its value
            return ASTNode(child.name, value=child.value)
            
    return None

def generate_ast(parse_tree: ParseNode) -> ASTNode:
    try:
        return build_ast(parse_tree)
    except Exception as e:
        return ASTNode("Error", value=str(e))

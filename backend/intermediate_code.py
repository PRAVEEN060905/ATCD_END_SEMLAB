from backend.ast_builder import ASTNode

def generate_three_address_code(node: ASTNode):
    if not node:
        return []
        
    instructions = []
    temp_counter = 1
    
    def post_order_traverse(curr_node: ASTNode):
        nonlocal temp_counter
        
        if curr_node.op in ["id", "num"]:
            return curr_node.value
            
        left_val = post_order_traverse(curr_node.left) if curr_node.left else None
        right_val = post_order_traverse(curr_node.right) if curr_node.right else None
        
        if left_val and right_val:
            if curr_node.op == '=':
                instructions.append(f"{left_val} = {right_val}")
                return left_val
            else:
                temp_var = f"t{temp_counter}"
                temp_counter += 1
                instructions.append(f"{temp_var} = {left_val} {curr_node.op} {right_val}")
                return temp_var
            
        return ""

    post_order_traverse(node)
    
    return instructions

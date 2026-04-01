import os
import time
import graphviz
from typing import Optional

def _ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def generate_parse_tree_image(parse_node, output_dir: str = "backend/static", prefix: str = "parse_tree") -> Optional[str]:
    _ensure_dir(output_dir)
    
    dot = graphviz.Digraph(comment='Parse Tree')
    dot.attr('graph', rankdir='TB', nodesep='0.6', ranksep='0.8')
    dot.attr('node', shape='box', style='filled,rounded', fillcolor='#e0f2fe', color='#38bdf8', fontname='Helvetica', fontsize='12', fontcolor='#0f172a')
    dot.attr('edge', color='#64748b', penwidth='1.5')

    def traverse(node):
        if not node: return None
        node_id = str(id(node))
        
        label = str(node.name)
        if getattr(node, 'value', None) is not None:
            label += f"\\n{node.value}"
            
        # Optional: Different styling for leaf vs non-leaf can be done here.
        dot.node(node_id, label)
        
        if getattr(node, 'children', None):
            for child in node.children:
                child_id = traverse(child)
                if child_id:
                    dot.edge(node_id, child_id)
                    
        return node_id
        
    traverse(parse_node)
    
    filename = f"{prefix}_{int(time.time()*100)}"
    filepath = os.path.join(output_dir, filename)
    try:
        dot.render(filepath, format='png', cleanup=True)
        return f"/static/{filename}.png"
    except graphviz.backend.ExecutableNotFound as e:
        raise Exception("Graphviz binaries not found on path! Please install Graphviz on windows.") from e

def generate_ast_image(ast_node, output_dir: str = "backend/static", prefix: str = "ast") -> Optional[str]:
    _ensure_dir(output_dir)
    
    dot = graphviz.Digraph(comment='Abstract Syntax Tree')
    dot.attr('graph', rankdir='TB', nodesep='0.6', ranksep='0.8')
    dot.attr('node', shape='box', style='filled,rounded', fillcolor='#f3e8ff', color='#c084fc', fontname='Helvetica', fontsize='12', fontcolor='#0f172a')
    dot.attr('edge', color='#64748b', penwidth='1.5')

    def traverse(node):
        if not node: return None
        node_id = str(id(node))
        
        label = str(node.op) if getattr(node, 'op', None) else ""
        if getattr(node, 'value', None) is not None:
            label = str(node.value)
            dot.node(node_id, label, fillcolor='#dcfce3', color='#4ade80') # Green for operands
        else:
            dot.node(node_id, label) # Purple for operators
            
        if getattr(node, 'left', None):
            child_id = traverse(node.left)
            if child_id: dot.edge(node_id, child_id)
            
        if getattr(node, 'right', None):
            child_id = traverse(node.right)
            if child_id: dot.edge(node_id, child_id)
            
        return node_id
        
    traverse(ast_node)
    
    filename = f"{prefix}_{int(time.time()*100)}"
    filepath = os.path.join(output_dir, filename)
    try:
        dot.render(filepath, format='png', cleanup=True)
        return f"/static/{filename}.png"
    except graphviz.backend.ExecutableNotFound as e:
        raise Exception("Graphviz binaries not found on path! Please install Graphviz on windows.") from e

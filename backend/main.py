from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.lexer import tokenize
from backend.error_handler import analyze_errors
from backend.parser import generate_parse_tree
from backend.tree_visualizer import generate_parse_tree_image, generate_ast_image
from backend.ast_builder import generate_ast
from backend.postfix import infix_to_postfix
from backend.intermediate_code import generate_three_address_code

app = FastAPI(title="Visual Compiler API")

import os
if not os.path.exists("backend/static"):
    os.makedirs("backend/static")
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    expression: str

class AnalyzeResponse(BaseModel):
    tokens: List[Dict[str, Any]]
    errors: List[str]
    suggestions: List[str]
    parse_tree: Optional[Dict[str, Any]] = None
    parse_tree_image: Optional[str] = None
    ast: Optional[Dict[str, Any]] = None
    ast_image: Optional[str] = None
    postfix: str
    steps: List[Dict[str, Any]]
    intermediate_code: List[str]
    token_summary: Optional[Dict[str, Any]] = None

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    expression = req.expression
    
    # 1. Lexical Analysis
    token_summary = {}
    try:
        tokens = tokenize(expression)
        
        # Compute token summary
        for t in tokens:
            t_type = getattr(t, 'type', 'UNKNOWN')
            if t_type == "EOF":
                continue
            
            if t_type not in token_summary:
                token_summary[t_type] = {"count": 0, "values": set()}
            
            token_summary[t_type]["count"] += 1
            token_summary[t_type]["values"].add(t.value)
            
        # Convert sets to sorted lists for JSON serialization
        for t_type in token_summary:
            token_summary[t_type]["values"] = sorted(list(token_summary[t_type]["values"]))
            
    except Exception as e:
        tokens = []
        
    # 2. Error Handling
    error_analysis = analyze_errors(expression)
    
    # If no severe lexical errors, proceed
    parse_tree_dict = None
    parse_tree_img_url = None
    ast_dict = None
    ast_img_url = None
    postfix_res = {"postfix": "", "steps": []}
    tac_instructions = []
    
    if not error_analysis["errors"]:
        # 3. Syntax Analysis
        try:
            parse_tree = generate_parse_tree(tokens)
            if parse_tree:
                if parse_tree.name == "Error":
                    error_analysis["errors"].append(f"Syntax Error: {parse_tree.value}")
                else:
                    parse_tree_dict = parse_tree.to_dict()
                    parse_tree_img_url = generate_parse_tree_image(parse_tree)
                    
                    # 4. AST Construction
                    ast = generate_ast(parse_tree)
                    if ast and getattr(ast, 'op', '') != "Error":
                        ast_dict = ast.to_dict()
                        ast_img_url = generate_ast_image(ast)
                        
                        # 6. Intermediate Code
                        tac_instructions = generate_three_address_code(ast)
        except Exception as e:
            error_analysis["errors"].append(f"Parsing Failed: {str(e)}")
            
        # 5. Shunting Yard (Postfix)
        try:
            postfix_res = infix_to_postfix(tokens)
        except Exception as e:
            error_analysis["errors"].append(f"Postfix Conversion Failed: {str(e)}")
            
    return AnalyzeResponse(
        tokens=[t.model_dump() for t in tokens if getattr(t, 'type', None) != "EOF"],
        errors=error_analysis["errors"],
        suggestions=error_analysis["suggestions"],
        parse_tree=parse_tree_dict,
        parse_tree_image=parse_tree_img_url,
        ast=ast_dict,
        ast_image=ast_img_url,
        postfix=postfix_res["postfix"],
        steps=postfix_res["steps"],
        intermediate_code=tac_instructions,
        token_summary=token_summary
    )

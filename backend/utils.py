from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class TokenType(str, Enum):
    IDENTIFIER = "IDENTIFIER"
    NUMBER = "NUMBER"
    OPERATOR = "OPERATOR"
    PARENTHESIS = "PARENTHESIS"
    ASSIGN = "ASSIGN"
    RELATIONAL_OPERATOR = "RELATIONAL_OPERATOR"
    LOGICAL_OPERATOR = "LOGICAL_OPERATOR"
    EOF = "EOF"
    UNKNOWN = "UNKNOWN"

class Token(BaseModel):
    type: str
    value: str
    position: int

class ParseNode:
    def __init__(self, name: str, value: str = None, children: List['ParseNode'] = None):
        if children is None:
            children = []
        self.name = name
        self.value = value
        self.children = children

    def to_dict(self):
        res = {"name": self.name}
        if self.value is not None:
            res["value"] = self.value
        if self.children:
            res["children"] = [child.to_dict() for child in self.children]
        return res

class ASTNode:
    def __init__(self, op: str, left: 'ASTNode' = None, right: 'ASTNode' = None, value: str = None):
        self.op = op
        self.left = left
        self.right = right
        self.value = value

    def to_dict(self):
        res = {"op": self.op}
        if self.value is not None:
            res["value"] = self.value
        if self.left:
            res["left"] = self.left.to_dict()
        if self.right:
            res["right"] = self.right.to_dict()
        return res

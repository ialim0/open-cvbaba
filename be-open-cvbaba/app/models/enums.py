"""Enums for the application models"""
from enum import Enum

class AIModel(str, Enum):
    """AI model choices"""
    MISTRAL = "mistral"

class AccessLevel(str, Enum):
    """Access levels for shared chats"""
    VIEW = "view"      # Can only view the chat
    EDIT = "edit"      # Can view and edit (but not share or delete)
    FULL = "full"      # Full access (view, edit, share, delete)
    READ = "view"      # Alias for VIEW (for backwards compatibility)

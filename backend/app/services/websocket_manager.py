"""
WebSocket Connection Manager
Manages real-time connections for chat
"""

from typing import Dict, List, Set
from fastapi import WebSocket
import json


class WebSocketManager:
    """
    Manages WebSocket connections for real-time features
    """
    
    def __init__(self):
        # user_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        
        # conversation_id -> set of user_ids
        self.conversation_members: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """
        Accept WebSocket connection and store it
        """
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"🔌 User {user_id} connected via WebSocket")
    
    def disconnect(self, user_id: str):
        """
        Remove WebSocket connection
        """
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"🔌 User {user_id} disconnected from WebSocket")
    
    async def send_to_user(self, user_id: str, message: dict):
        """
        Send message to specific user
        """
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_json(message)
    
    async def broadcast_to_conversation(
        self, 
        conversation_id: str, 
        message: dict,
        exclude_user: str = None
    ):
        """
        Broadcast message to all members of a conversation
        """
        if conversation_id in self.conversation_members:
            for user_id in self.conversation_members[conversation_id]:
                if user_id != exclude_user and user_id in self.active_connections:
                    await self.send_to_user(user_id, message)
    
    def add_to_conversation(self, conversation_id: str, user_id: str):
        """
        Add user to conversation for broadcast
        """
        if conversation_id not in self.conversation_members:
            self.conversation_members[conversation_id] = set()
        self.conversation_members[conversation_id].add(user_id)
    
    def remove_from_conversation(self, conversation_id: str, user_id: str):
        """
        Remove user from conversation
        """
        if conversation_id in self.conversation_members:
            self.conversation_members[conversation_id].discard(user_id)
    
    def is_user_online(self, user_id: str) -> bool:
        """
        Check if user is connected
        """
        return user_id in self.active_connections
    
    def get_online_users(self, user_ids: List[str]) -> List[str]:
        """
        Get list of online users from given list
        """
        return [uid for uid in user_ids if uid in self.active_connections]


# Global WebSocket manager instance
ws_manager = WebSocketManager()

from typing import Coroutine
from random import randbytes
import socketio
from socketio.exceptions import ConnectionRefusedError

from university.socket.session import Session
from university.socket.participant import Participant

class SessionsServer:
    def __init__(self, sio: socketio.AsyncServer):
        self.sio = sio
        self.sessions = {}
        self.clients = {}

    def valid_token(self, token: str) -> bool:
        return True
        
    def event(self, event):
        return self.sio.event(event)
    
    def emit(self, event, data, to):
        return self.sio.emit(event, data, to=to)
    
    def emit_to_session(self, event, data, session_id, sid):
        return self.sio.emit(event, data, room=session_id, skip_sid=sid)
    
    def generate_session_id(self):
        while True:
            session_id = randbytes(4).hex().upper()
            if session_id not in self.sessions:
                return session_id
    
    def create_session(self, participant: Participant) -> Coroutine:        
        if self.get_client_session(participant.sid):
            raise ConnectionRefusedError('Client is already in a session')
        
        session_id = self.generate_session_id()
        result = self.sio.enter_room(participant.sid, session_id)
        
        self.sessions.setdefault(session_id, Session(session_id))
        self.sessions[session_id].add_client(participant)
        self.clients[participant.sid] = session_id
        
        return result
        
    
    def enter_session(self, participant: Participant, session_id: str) -> Coroutine:
        if self.get_client_session(participant):
            raise ConnectionRefusedError('Client is already in a session')
        
        if session_id not in self.sessions:
            print(self.sessions)
            raise ConnectionRefusedError('Session is empty')
        
        self.sessions[session_id].add_client(participant)
        result = self.sio.enter_room(participant.sid, session_id)
        
        self.clients[participant.sid] = session_id
        
        return result
    
    def leave_session(self, sid: str) -> Coroutine:
        session_id = self.clients.get(sid)
        if session_id is None:
            raise ConnectionRefusedError('Client is not in a session')
        
        result = self.sio.leave_room(sid, session_id)
        
        self.sessions[session_id].remove_client(sid)
        if self.sessions[session_id].no_participants() and self.sessions[session_id].expired():
            del self.sessions[session_id]

        del self.clients[sid]

        return result
    
    def get_client_session(self, sid) -> Session | None:
        return self.sessions.get(self.clients.get(sid))
    
    def get_session(self, session_id) -> Session | None:
        return self.sessions.get(session_id)

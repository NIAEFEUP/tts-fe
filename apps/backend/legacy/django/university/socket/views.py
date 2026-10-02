import os
from typing import cast
import socketio
from urllib.parse import parse_qs

from socketio.exceptions import ConnectionRefusedError
from university.socket.participant import Participant
from university.socket.session import Session
from university.socket.sessionsserver import SessionsServer

sessions_server = SessionsServer(
    socketio.AsyncServer(
        async_mode='asgi',
        cors_allowed_origins="*",
    )
)

async def emit_session_update(sid, session: Session):
    payload = {
        'session_id': session.session_id,
        'session_info': session.to_json(),
    }
    
    await sessions_server.emit_to_session('update_session_info', payload, session.session_id, sid)

@sessions_server.event
async def connect(sid, environ, auth):
    if auth is None or 'token' not in auth:
        raise ConnectionRefusedError('Authentication failed: No token provided')
    if not sessions_server.valid_token(auth['token']):
        raise ConnectionRefusedError('Authentication failed: Invalid token')
    
    print(f'Participant {sid} connected')
    
    query_params = parse_qs(environ.get("QUERY_STRING", ""))
    session_id = query_params.get('session_id', [None])[0]
    
    participant_name = query_params.get('participant_name', ["Anonymous"])[0]
    participant = Participant(sid, participant_name)
    
    if session_id is None:
        await sessions_server.create_session(participant)
    
        session = cast(Session, sessions_server.get_client_session(sid))
        session_id = session.session_id
        
        print(f"Participant {sid} created session {session_id}")
    else:     
        await sessions_server.enter_session(participant, session_id)

        session = cast(Session, sessions_server.get_session(session_id))
        
        print(f"Participant {sid} joined session {session_id}")
    
    payload = {
        'client_id': participant.client_id,
        'session_id': session_id,
        'session_info': session.to_json(),
    }
    
    await sessions_server.emit('connected', payload, to=sid)
    await emit_session_update(sid, session)

@sessions_server.event
async def disconnect(sid):
    session = cast(Session, sessions_server.get_client_session(sid))
    
    await sessions_server.leave_session(sid)
    print(f'Client {sid} disconnected')
    
    await emit_session_update(sid, session)

# TODO: Remove this
@sessions_server.event
async def ping(sid, data):
    user_session = cast(Session, sessions_server.get_client_session(sid))
    session_id = user_session.session_id
    
    await sessions_server.emit_to_session('ping', data, session_id=session_id, sid=sid)
    
@sessions_server.event
async def update_participant(sid, updated_participant):
    user_session = cast(Session, sessions_server.get_client_session(sid))
    participant = user_session.participants[sid]
    participant.update_from_json(updated_participant)
    
    await emit_session_update(sid, user_session)
from university.socket.participant import Participant
from datetime import datetime, timedelta, timezone
import time

class Session:
    def __init__(self, session_id: str, duration: timedelta = timedelta(days=30)):
        self.session_id = session_id
        self.participants = {}
        self.expiration_datetime = datetime.now(timezone.utc) + duration
        
    def add_client(self, participant: Participant):
        self.participants[participant.sid] = participant
        
    def remove_client(self, sid):
        del self.participants[sid]
        
    def update_client(self, participant: Participant):
        self.participants[participant.sid] = participant
        
    def no_participants(self):
        return self.participants == []
    
    def expired(self):
        return datetime.now() > self.expiration_datetime
    
    def to_json(self):
        return {
            'expiration_time': int(time.mktime(self.expiration_datetime.timetuple())) * 1000.0,
            'participants': list(map(Participant.to_json, self.participants.values()))
        }
    
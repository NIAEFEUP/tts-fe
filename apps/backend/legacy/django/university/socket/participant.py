import uuid

class Participant:
    def __init__(self, sid, name):
        self.sid = sid
        self.client_id = str(uuid.uuid4())
        self.name = name
        
    def to_json(self):
        return {
            'client_id': self.client_id,
            'name': self.name,
        }
        
    @staticmethod
    def from_json(sid, data):
        if 'name' not in data:
            raise ValueError('name is required')
        return Participant(sid, data['name'])
    
    def update_from_json(self, data):
        if 'name' in data:
            self.name = data['name']
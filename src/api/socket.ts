import { io, Socket } from "socket.io-client";
import backendApi from "./backend";

const SOCKET_URL = (import.meta.env.VITE_APP_PROD == 0 ? 'ws://' : 'wss://') + backendApi.BACKEND_URL.split('//')[1];

class OptionalSocket {
    private socket: Socket | null;

    constructor() {
        this.socket = null;
    }

    set(socket: Socket) {
        this.socket = socket;
    }

    unset() {
        this.socket = null;
    }

    is_set() {
        return this.socket !== null
    }

    use<T>(callback: (socket: Socket) => T): T {
        if (!this.socket) {
            throw new Error('Socket is not connected');
        }
        return callback(this.socket);
    }
}

class SessionsSocket {
    private url: string;
    private socket: OptionalSocket;
    private _sessionId: string;
    private _sessionInfo: any;

    constructor(url: string) {
        this.url = url;
        this.socket = new OptionalSocket();
        this._sessionId = null;
        this._sessionInfo = null;
    }

    get sessionId(): string | null {
        return this._sessionId;
    }

    set sessionId(sessionId: string | null) {
        this._sessionId = sessionId;
    }

    get sessionInfo() {
        return this._sessionInfo;
    }

    isConnected() {
        this.socket.is_set();
    }

    async connect(participantName: string): Promise<SessionsSocket> {
        return new Promise((resolve, reject) => {
            const query = { 
                ...(this.sessionId ? { session_id: this.sessionId } : {}),
                participant_name: participantName,
            };

            const newSocket = io(this.url, {
                query,
                auth: {
                    token: 'dummy',  // TODO: Replace with actual federated authentication token
                },
            });

            this.socket.set(newSocket);

            newSocket.on('connected', data => {
                this._sessionId = data['session_id'];
                this._sessionInfo = data['session_info'];
                console.log('Connected to session', this._sessionId);
                resolve(this);
            });

            newSocket.on('connect_error', (err) => {
                this.socket.unset();
                reject(err);
            });
        });
    }

    async disconnect(): Promise<void> {
        return new Promise(resolve => {
            this.socket.use(socket => socket.disconnect());
            this.socket.unset();
            resolve();
        });
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket.use(socket => socket.on(event, callback));
    }

    onAny(callback: (event: string, ...args: any[]) => void) {
        this.socket.use(socket => socket.onAny(callback));
    }

    off(event: string, callback?: (...args: any[]) => void) {
        this.socket.use(socket => socket.off(event, callback));
    }

    emit(event: string, ...args: any[]) {
        this.socket.use(socket => socket.emit(event, args));
    }

    emitToSession(event: string, session_id: string, ...args: any) {
        this.socket.use(socket => socket.emit(event, session_id=session_id, ...args));
    }
}

const sessionsSocket = new SessionsSocket(SOCKET_URL);

export {
    sessionsSocket,
    SOCKET_URL,
};

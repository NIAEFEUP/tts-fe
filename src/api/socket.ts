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
    private _sessionId: number | null;

    constructor(url: string) {
        this.url = url;
        this.socket = new OptionalSocket();
    }

    get sessionId() {
        return this._sessionId;
    }

    connect(sessionId?: string) {
        const newSocket = io(this.url, {
            ...sessionId ? { query: { session_id: sessionId } } : {},
            auth: {
                token: 'dummy',  // TODO: Replace with actual federated authentication token
            }
        });

        this.socket.set(newSocket);
        newSocket.on('connected', data => {
            console.log('Connected to sessions socket');
            this._sessionId = data['session_id'];
        });
    }

    disconnect() {
        this.socket.use(socket => socket.disconnect());
        this.socket.unset();
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
}

const sessionsSocket = new SessionsSocket(SOCKET_URL);

export {
    sessionsSocket,
    SOCKET_URL,
};

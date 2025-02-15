import { io, Socket } from "socket.io-client";
import backendApi from "./backend";

type SocketConfig = {
    url: string,
    path: string,
    secure: boolean,
};

const getSocketConfig = (backendUrl: string): SocketConfig => {
    const [schema, rest] = backendUrl.split('://', 2);
    const [host, path] = rest.split('/', 2);
    const secure = schema === 'https';
    const newSchema = secure ? 'wss' : 'ws';

    return {
        url: `${newSchema}://${host}`,
        path: `/${path}/socket.io`,
        secure,
    };
}

const SOCKET_CONFIG = getSocketConfig(backendApi.BACKEND_URL);

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
    private config: SocketConfig;
    private socket: OptionalSocket;
    private _clientId: string | null;
    private _sessionId: string | null;
    private _sessionInfo: any;

    constructor(config: SocketConfig) {
        this.config = config;
        this.socket = new OptionalSocket();
        this._clientId = null;
        this._sessionId = null;
        this._sessionInfo = null;
    }

    get sessionId(): string | null {
        return this._sessionId;
    }

    get clientId(): string | null {
        return this._clientId;
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

            const newSocket = io(this.config.url, {
                query,
                auth: {
                    token: 'dummy',  // TODO: Replace with actual federated authentication token
                },
                path: this.config.path,
                secure: this.config.secure,
            });

            this.socket.set(newSocket);

            newSocket.on('connected', data => {
                this._clientId = data['client_id'];
                this._sessionId = data['session_id'];
                this._sessionInfo = data['session_info'];
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
        this.socket.use(socket => socket.emit(event, ...args));
    }
}

const sessionsSocket = new SessionsSocket(SOCKET_CONFIG);

export { sessionsSocket };

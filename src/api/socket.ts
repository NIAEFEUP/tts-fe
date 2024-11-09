import { io, Socket } from "socket.io-client";
import backendApi from "./backend";

const SOCKET_URL = 'ws://' + backendApi.BACKEND_URL.split('//')[1];

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

    constructor(url: string) {
        this.url = url;
        this.socket = new OptionalSocket();
    }

    connect() {
        const newSocket = io(this.url, {
            auth: {
                token: 'dummy',  // TODO: Replace with actual federated authentication token
            }
        });
        this.socket.set(newSocket);
        console.log('Connected to socket');
    }

    disconnect() {
        this.socket.use(socket => socket.disconnect());
        this.socket.unset();

        console.log('Disconnected from socket');
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket.use(socket => socket.on(event, callback));
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

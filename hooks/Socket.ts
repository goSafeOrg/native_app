import { Idevice } from '@/components/TopBar/Topbar';
import io, { Socket } from 'socket.io-client';

interface MessagePayload {
    deviceId?: string | null;
    message: string;
}

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private isConnected: boolean = false;
    private deviceId: string | null = null;
    private readonly SOCKET_URL: string = 'ws://13.201.153.161:5005';

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(device: Idevice): void {
        if (this.socket && this.isConnected) {
            console.warn('Socket is already connected');
            return;
        }

        this.socket = io(this.SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('Connected to the server with socket ID:', this.socket?.id);
            this.isConnected = true;
            this.deviceId = device.id;

            try {
                this.socket?.emit('joinRoom', { roomId: device.id });
                console.log('Joined room:', device.id);
            } catch (error) {
                console.error('Error joining room:', error);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.isConnected = false;
        });

        this.socket.on('message', (data) => {
            console.log('Message from server:', data);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.isConnected = false;
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            console.log('Socket connection closed');
        }
    }

    public sendMessage(payload: MessagePayload): void {
        if (this.socket && this.isConnected) {
            if (!payload.deviceId) {
                payload.deviceId = this.deviceId;
            }
            console.log(payload);
            this.socket.emit('message', payload);
            console.log('Message sent:', payload);
        } else {
            console.warn('Socket is not connected');
        }
    }
    public getSocket(){
        return this.socket;
    }
    public getDevice(){
        return this.deviceId;
    }

    public emit(eventName: string, data: any): void {
        if (this.socket && this.isConnected) {
            this.socket.emit(eventName, data);
        } else {
            console.warn('Socket is not connected');
        }
    }

    public isSocketConnected(): boolean {
        return this.isConnected;
    }
}

export const socketManager = SocketService.getInstance();

import { Idevice } from '@/components/TopBar/Topbar';
import { useEffect, useState, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface MessagePayload {
    deviceId?: string | null;
    message: string;
}

export const useSocket = (device: Idevice) => {
    // Use http:// instead of ws:// for Socket.IO
    const SOCKET_URL = 'http://192.168.5.149:5005'; // Use 10.0.2.2 for Android emulator
    // const SOCKET_URL = 'http://localhost:5005'; // Use this for iOS simulator
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!device?.id) {
            console.log('No device ID provided, skipping socket connection');
            return;
        }

        console.log('Attempting to connect to:', SOCKET_URL);
        
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            forceNew: true,
            path: '/socket.io', // Make sure this matches your server configuration
            auth: {
                deviceId: device.id
            }
        });

        // Connection attempt
        socketInstance.on('connecting', () => {
            console.log('Attempting socket connection...');
        });

        // Successful connection
        socketInstance.on('connect', () => {
            console.log('Socket connected successfully. ID:', socketInstance.id);
            setIsConnected(true);
            setError(null);
            
            // Join room after successful connection
            socketInstance.emit('joinRoom', { 
                roomId: device.id,
                deviceName: device.name 
            });
            console.log('Joining room:', device.id);
        });

        // Connection error
        socketInstance.on('connect_error', (err) => {
            const errorMessage = `Connection error: ${err.message}`;
            console.error(errorMessage);
            setError(errorMessage);
            setIsConnected(false);
        });

        // Message handling
        socketInstance.on('message', (data) => {
            console.log('Received message:', data);
        });

        // Disconnect handling
        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected. Reason:', reason);
            setIsConnected(false);
        });

        // Error handling
        socketInstance.on('error', (err) => {
            const errorMessage = `Socket error: ${err.message}`;
            console.error(errorMessage);
            setError(errorMessage);
        });

        // Store socket instance
        socketRef.current = socketInstance;
        setSocket(socketInstance);

        // Cleanup
        return () => {
            console.log('Cleaning up socket connection...');
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
                setError(null);
            }
        };
    }, [device.id]); // Only recreate socket when device ID changes

    // Send message with error handling
    const sendMessage = useCallback(async (payload: MessagePayload) => {
        if (!socketRef.current) {
            console.error('No socket connection available');
            return;
        }

        if (!isConnected) {
            console.error('Socket is not connected');
            return;
        }

        try {
            const finalPayload = {
                ...payload,
                deviceId: device.id,
                timestamp: new Date().toISOString()
            };

            socketRef.current.emit('message', finalPayload);
            console.log('Message sent:', finalPayload);
            return true;
        } catch (err) {
            console.error('Error sending message:', err);
            return false;
        }
    }, [isConnected, device.id]);

    // Generic emit function with error handling
    const emit = useCallback((eventName: string, data: any) => {
        if (!socketRef.current || !isConnected) {
            console.error('Socket is not ready');
            return false;
        }

        try {
            socketRef.current.emit(eventName, data);
            return true;
        } catch (err) {
            console.error(`Error emitting ${eventName}:`, err);
            return false;
        }
    }, [isConnected]);

    return {
        socket: socketRef.current,
        isConnected,
        sendMessage,
        emit,
        error
    };
};
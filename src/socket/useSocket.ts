import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (token) => {
  const socket = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) return;
    socket.current = io(API_URL, { auth: { token } });
    return () => socket.current?.disconnect();
  }, [token]);

  return socket;
};

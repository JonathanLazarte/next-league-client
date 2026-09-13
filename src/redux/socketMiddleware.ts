import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client'
import type { RootState } from './store.ts'
import type { Middleware } from '@reduxjs/toolkit'

interface ReduxAction {
  type: string,
  payload?: any
}

export const socketMiddleware: () => Middleware = () => {
  let socket: Socket | null = null;

  return (store: { getState: () => RootState; dispatch: any }) => (next: any) => (action: any) => {
    const reduxAction = action as ReduxAction
    // 1. Conectar el socket cuando el usuario inicia sesión o carga la app
    if (reduxAction.type === 'auth/loginSuccess') {
      socket = io('https://tu-api.com', {
        auth: { token: reduxAction.payload.token }
      });

      // Escuchar eventos del servidor y despacharlos a Redux
      socket.on('receive_message', (message) => {
        store.dispatch({ type: 'chat/messageReceived', payload: message });
      });

      socket.on('user_status_changed', (status) => {
        store.dispatch({ type: 'chat/userStatusUpdated', payload: status });
      });

      socket.on("user_joined", ({ room, roomId }) => {
        //setRoomId(roomId);
        store.dispatch({ type: 'matchmaking/setLobbyMembers', payload: room})

        const indexRoom = room.findIndex((id: string) => id == socket?.id);
        const currentPlayer = indexRoom == 0 ? "One" : "Two";
        localStorage.setItem("currentPlayer", currentPlayer);
        localStorage.setItem("roomId", roomId);
        if (room.length == "2") {
          socket?.emit("start-match", { roomId });
        }
      });

      socket.on("user_out", ({ newRoom }) => {
        store.dispatch({ type: 'matchmaking/setPartyMembers', payload: newRoom})
      });

      socket.on("find_opponent", ({ roomId }) => {
        socket?.emit("join-room", { roomId: roomId });
      });

    }

    // 2. Interceptar acciones salientes para enviarlas al servidor
    if (reduxAction.type === 'chat/sendMessage') {
      if (socket?.connected) {
        socket.emit('send_message', reduxAction.payload);
      }
    }

    // 3. Desconectar el socket al cerrar sesión
    if (reduxAction.type === 'auth/logout') {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    return next(action);
  };
};

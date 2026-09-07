import { io } from 'socket.io-client';

export const socketMiddleware = () => {
  let socket = null;

  return (store) => (next) => (action) => {
    // 1. Conectar el socket cuando el usuario inicia sesión o carga la app
    if (action.type === 'auth/loginSuccess') {
      socket = io('https://tu-api.com', {
        auth: { token: action.payload.token }
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

        const indexRoom = room.findIndex((id) => id == socket?.current.id);
        const currentPlayer = indexRoom == 0 ? "One" : "Two";
        localStorage.setItem("currentPlayer", currentPlayer);
        localStorage.setItem("roomId", roomId);
        if (room.length == "2") {
          socket.emit("start-match", { roomId });
        }
      });

      socket?.current.on("user_out", ({ newRoom }) => {
        store.dispatch({ type: 'matchmaking/setPartyMembers', payload: newRoom})
      });

      socket?.current.on("find_opponent", ({ roomId }) => {
        socket.emit("join-room", { roomId: roomId });
      });

    }

    // 2. Interceptar acciones salientes para enviarlas al servidor
    if (action.type === 'chat/sendMessage') {
      if (socket?.connected) {
        socket.emit('send_message', action.payload);
      }
    }

    // 3. Desconectar el socket al cerrar sesión
    if (action.type === 'auth/logout') {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }



    return next(action);
  };
};

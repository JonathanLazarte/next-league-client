import { require } from "./utils.js";
import express from "express";
import { userRouter } from "./routes/user.js";
import { authRouter } from "./routes/auth.js";
import { storeRouter } from "./routes/store.js";
import { dataRouter } from "./routes/data.js";
import { corsMiddleware } from "./middlewares/cors.js";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
const { MongoClient, ServerApiVersion } = require("mongodb");
import { v4 as uuidv4 } from "uuid";

const app = express();
console.log(authRouter)
app.use(corsMiddleware());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://next-league-client.vercel.app", "http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
});
const uri =
  "mongodb+srv://theshakadevirgo:JohnShaka151515@leagueoflegendsclone.dwigeek.mongodb.net/?appName=LeagueOfLegendsClone"; //"mongodb+srv://JonathanLazarte:Jonii1543104@pokemonleague.4awnj.mongodb.net/?retryWrites=true&w=majority&appName=PokemonLeague";
const localurl = "mongodb://localhost:27017/";
const mocked = "mongodb+srv://LazarteJonathan:Jonii8843104@mycluster.orto15k.mongodb.net/?appName=MyCluster"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    throw new Error( error || "No se pudo conectar a la base de datos" );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.use(logger("dev"));
app.use(express.json());
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

const adminUser = {
  alias: "Jonathan Developer",
  tag: "LAS",
  title: "Dev",
  status: "online",
  messages: [],
  level: 1,
  rank: {
    name: "Gold",
    level: 2,
    points: 1000,
  },
  profile_icon: "6668",
  profile_background: "Shen_49",
  id: "mockedid",
};
const connectedUsers = [adminUser];
const usersChat = [];
const rooms = {};
var queque = [];

const isValidToken = (token) => {
  return true;
};

// Middleware de autenticación
/*io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (isValidToken(token)) {
    // Si es válido, permitimos la conexión
    next();
  } else {
    // Si no es válido, rechazamos la conexión con un error
    const err = new Error("No autorizado");
    err.data = { content: "Por favor, inicia sesión de nuevo" };
    next(err);
  }
});*/

io.on("connection", (socket) => {
  const dataBase = client.db("LeagueOfLegendsInterface");
  const usersCollection = dataBase.collection("users");
  const userToken = socket.handshake.auth.token;

  const authenticate = async () => {
    const isAlreadyLogged = connectedUsers.findIndex(
      (connectedUser) => connectedUser.id == userToken,
    );

    const userData = await usersCollection.findOne({
      id: userToken,
    });

    if (isAlreadyLogged == 1 || !userData) {
      return;
    }

    const {
      alias,
      tag,
      title,
      level,
      rank,
      profile_icon,
      profile_background,
      status,
      id,
    } = userData;
    const newConnectedUser = {
      socketId: socket.id,
      alias,
      tag,
      title,
      level,
      rank,
      profile_icon,
      profile_background,
      status,
      id,
    };
    connectedUsers.push(newConnectedUser);

    io.emit("user-list", connectedUsers);
  };
  userToken && authenticate();

  socket.on("chat-message", (msg) => {
    const foundUser = connectedUsers.find((cu) => cu.alias == msg.to);
    usersChat.push(msg);
    usersCollection.updateMany(
      { alias: { $in: [foundUser?.alias, msg.from] } }, // Filtro para seleccionar múltiples usuarios
      { $push: { messages: msg } }, // Operación para añadir el mensaje a cada usuario
    );
    io.to([foundUser?.socketId]).emit("chat-message", msg);
  });
  socket.on("battle-request", (msg) => {
    const foundUser = connectedUsers.find((cu) => cu.userName == msg.to);
    foundUser && io.to(foundUser.socketID).emit("battle-mailbox", msg);
  });
  socket.on("attack", (msg) => {
    io.to(msg.roomId).emit("attack", msg);
  });
  socket.on("selectpokemon", (msg) => {
    io.to(msg.roomId).emit("selectpokemon", msg);
  });
  socket.on("setpokemon", (msg) => {
    io.to(msg.roomId).emit("setpokemon", msg);
  });
  socket.on("player-ready", (msg) => {
    io.to(msg.roomId).emit("player-ready", msg);
  });
  socket.on("join-room", (msg) => {
    const existingRooms = Object.keys(rooms).filter((room) =>
      rooms[room].includes(socket.id),
    );
    if (existingRooms.length > 0) {
      console.log("error", "Ya estás en una sala");
      return;
    } else {
      socket.join(msg.roomId);
      rooms[msg.roomId] = rooms[msg.roomId] || [];
      rooms[msg.roomId].push(socket.id);
      const userJoined = connectedUsers.find((cu) => cu.socketID == socket.id);
      //console.log("Se ha entrado a una sala")
      io.to(msg.roomId).emit("USER JOINED", {
        room: rooms[msg.roomId],
        roomId: msg.roomId,
        userJoined,
      });
    }
    //console.log("ROOM: " + rooms[msg.roomId])
    /*if(rooms[msg.roomId].length == 2){
			io.to(msg.roomId).emit('USER JOINED', ({msg : rooms[msg.roomId], roomId : msg.roomId}))
		}*/
  });
  socket.on("leave-room", (msg) => {
    const existingRooms = Object.keys(rooms).filter((room) =>
      rooms[room].includes(socket.id),
    );
    const indexInRoom = rooms[existingRooms]?.findIndex(
      (stringindex) => stringindex == socket.id,
    );
    rooms[existingRooms]?.splice(indexInRoom, 1);
    const newRoom = rooms[existingRooms];
    /*console.log("room: " + rooms[msg.roomId])
		console.log("newroom: " + newRoom)*/
    io.to(existingRooms).emit("USER-OUT", { newRoom });

    const imAlreadyInQueque = queque.findIndex((q) => q.id == socket.id);
    queque.splice(imAlreadyInQueque, 1);
    imAlreadyInQueque != -1
      ? console.log("has sido desplazado del index: " + imAlreadyInQueque)
      : "No estabas en una cola";
  });

  socket.on("start-match", (msg) => {
    io.to(msg.roomId).emit("start-match");
  });

  socket.on("disconnect", () => {
    // Eliminamos al usuario cuando se desconecta
    const newConnectedUsers = connectedUsers.findIndex(
      (user) => user.socketId == socket.id,
    );
    newConnectedUsers != -1 && connectedUsers.splice(newConnectedUsers, 1);
    io.emit("user-list", connectedUsers);
    socket.leave();

    const existingRooms = Object.keys(rooms).filter((room) =>
      rooms[room].includes(socket.id),
    );
    //const roomIndexInRooms = rooms[existingRooms].findIndex(existingRooms)
    const indexInRoom = rooms[existingRooms]?.findIndex(
      (stringindex) => stringindex == socket.id,
    );
    rooms[existingRooms]?.splice(indexInRoom, 1);
    const newRoom = rooms[existingRooms];
    //console.log("room: " + rooms[existingRooms])
    //console.log("newroom: " + newRoom)
    io.to(existingRooms).emit("USER-OUT", { newRoom });

    const imAlreadyInQueque = queque.findIndex((q) => q.id == socket.id);
    queque.splice(imAlreadyInQueque, 1);
    imAlreadyInQueque != -1
      ? console.log("has sido desplazado del index: " + imAlreadyInQueque)
      : "No estabas en una cola";
  });

  socket.on("find-opponent", (msg) => {
    const imAlreadyInQueque = queque.find((q) => q.id == socket.id);
    imAlreadyInQueque
      ? console.log("Ya estas en una cola")
      : queque.push({ id: socket.id });
    if (queque.length >= 2) {
      const roomId = uuidv4();
      io.to([socket.id, queque[0].id]).emit("find-opponent", {
        roomId: roomId,
      });
      const playerIndex = queque.findIndex((player) => player.id == socket.id);
      queque.splice(playerIndex, 1);
      queque.splice(0, 1);
      //io.to(queque[0]).emit('find-opponent', {roomId})
    } else {
      console.log("Has entrado en la cola");
    }
  });
});

const PORT = process.env.PORT ?? 3050;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

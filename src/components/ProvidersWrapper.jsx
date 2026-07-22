"use client";

import "$/(dashboard)/collection/collection.css";
import "$/(dashboard)/store/store.css";
import "$/(dashboard)/room/room.css";
import ResponsiveHeader from "@/components/header";
import RightNav from "@/components/rightNav/rightNav.jsx";
/*import Chat from '@/components/chat/chat.jsx'*/
const Chat = dynamic(() => import("@/components/chat/chat.jsx"), {
  ssr: false,
});
const MusicPlayer = dynamic(() => import("@/components/Audio/MusicPlayer"), {
  ssr: false,
});
/*const ConfirmPurchaseModal = dynamic(
  () => import("@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx"),
  { ssr: false },
);*/
import ConfirmPurchaseModal from "./confirmPurchaseWindow/confirmPurchaseWindow";
/*import Loading from "@/components/Loading/Loading.jsx";*/
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import "$/(dashboard)/index.css";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "@/hooks/useRouter";
import Image from "next/image";

import { setUser /*, setUserMessages*/ } from "@/redux/slices/userSlice";
import {
  selectUserInterfaceData,
  setActualSection /*, setUserState*/,
} from "@/redux/slices/userInterfaceSlice.js";
import {
  getUserChampions /*, selectUserChampionsData*/,
} from "@/redux/slices/userChampionsSlice.js";
import {
  getUserSkins /*, selectUserSkinsData*/,
} from "@/redux/slices/userSkinsSlice.js";
import { setFriendsOnline } from "@/redux/slices/connectedUsersSlice.ts";
import { useSelector, useDispatch } from "react-redux";
/*import {Riple} from 'react-loading-indicators'*/
import { useAuth } from "@/hooks/useAuth";
import {
  /*logout,*/ verifyToken /*, clearError*/,
} from "@/redux/slices/authSlice";
import { setMute, setVolume } from "@/redux/slices/soundSlice.js";
import { selectPurchaseData } from "@/redux/slices/purchaseSlice";
import { addMessage, setMessages } from "@/redux/slices/chatSlice";

export default function ProvidersWrapper({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showSideNav, setShowSideNav] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [/*battleRequest,*/ setBattleRequest] = useState([]);
  const socket = useRef(null);
  /*const newRoom = uuidv4()*/
  const { token } = useAuth();
  /*const [roomId, setRoomId] = useState()*/
  /*const [globalRoom, setGlobalRoom] = useState()*/
  /*const [roomUsers, setRoomUsers] = useState([])*/
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { actualSection, isNavigating, userState } = useSelector(
    selectUserInterfaceData,
  );
  const { itemToBuy } = useSelector(selectPurchaseData);

  /*const indexElementStyle = {
      paddingRight: !showSideNav || userState === 'In explore match' ? `0px` : null,
      paddingTop: (userState === 'In explore match' || userState === 'In normal match') ? '0px' : null
    };*/
  const [localStoreToken, setLocalStoreToken] = useState("loading");
  const pathname = usePathname();

  useEffect(() => {
    setLocalStoreToken(localStorage.getItem("token"));
    /*if (typeof window !== 'undefined') {
        setShowSideNav(window.innerWidth > 1200)
      }*/
  }, []);

  useEffect(() => {
    /*const sectionToSet = () => {
      switch (pathname) {
        case "/collection": {
          return "Colección";
        }
        case "/store": {
          return "Tienda";
        }
        case "/room": {
          return "ModeSelection";
        }
        case "/league": {
          return "Home";
        }
        default:
          return null;
      }
    };*/
    const sectionName = pathname.split("/").pop();

    dispatch(setActualSection(sectionName));
  }, [pathname]);

  useEffect(() => {
    if (localStoreToken) {
      dispatch(getUserChampions(localStoreToken));
      dispatch(getUserSkins(localStoreToken));
      try {
        fetch(`${API_URL}pokemons/users/getUserData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: localStoreToken }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message !== "Usuario no encontrado") {
              dispatch(setUser(data));
              const { master, sfx, music } = data.settings.sound;
              dispatch(setVolume({ type: "master", val: master.volume }));
              dispatch(setVolume({ type: "sfx", val: sfx.volume }));
              dispatch(setVolume({ type: "music", val: music.volume }));
              dispatch(setMute({ type: "master", muted: master.muted }));
              dispatch(setMute({ type: "sfx", muted: sfx.muted }));
              dispatch(setMute({ type: "music", muted: music.muted }));
              dispatch(setMessages(data.messages));
            } else {
              // Token inválido, redirigir al login
            }
          });
      } catch (error) {
        throw new Error("error al autenticar" + error);
      }
    }
  }, [localStoreToken]);

  useEffect(() => {
    if (!token) return;
    socket.current = io(`${API_URL}`, { auth: { token } });
    return () => {
      socket.current?.disconnect();
    };
  }, [token]);
  console.log(localStoreToken);
  console.log(token);
  console.log(isAuthenticated);
  //--------------------------------------------------------------------------------
  useEffect(() => {
    if (localStoreToken != "loading" && !loading) {
      if (isAuthenticated) {
        console.log("nothing to do");
      } else if (localStoreToken) {
        // autentificar
        console.log("punto de verificacion correcto");
        dispatch(verifyToken);
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router, localStoreToken]);
  //----------------------------------------------------------------------------------

  /*useEffect(() => {
    user.id && socket.current.emit("authenticate", { id: user.id });
    return () => socket.current.off("authenticate");
  }, [user]);*/

  useEffect(() => {
    socket.current?.on("battle-mailbox", (msg) => {
      const request = [{ roomId: msg.roomId, from: msg.from, to: msg.from }];
      setBattleRequest(request);
      setTimeout(() => {
        setBattleRequest([]);
      }, 7000);
    });
    return () => socket.current?.off("battle-mailbox");
  }, []);

  useEffect(() => {
    socket.current?.on("chat-message", (msg) => {
      /*const message = {
        id: Date.now().toString(),
        from: msg.from,
        to: msg.to,
        content: msg.message.trim(),
        timestamp: Date.now(),
        type: "text",
        isRead: false,
        isDelivered: false,
      };*/
      dispatch(addMessage(msg));
    });
    return () => socket.current?.off("chat-message");
  }, []);

  useEffect(() => {
    if (!socket.current) return;
    socket.current?.on("user-list", (msg) => {
      console.log(msg);
      //const actualUserIndex = msg.findIndex((u) => u.alias === user.alias);
      //msg.splice(actualUserIndex, 1);
      const friendFolders = [
        {
          name: "general",
          users: msg,
        },
      ];
      dispatch(setFriendsOnline(friendFolders));
    });
    return () => socket.current?.off("user-list");
  }, []);

  if (loading) {
    return (
      <div
        style={{ width: "100vw" }}
        className="flex items-center content-center justify-center w-screen min-h-screen"
      >
        <div className="text-center">
          <Image
            className="lol-logo-image"
            src="/LOL_Icon_Rendered.png"
            width={100}
            height={100}
          />
        </div>
      </div>
    );
  }

  /*<link rel="preload" href="/images/section1.jpg" as="image" />
  <link rel="preload" href="/images/section2.jpg" as="image" /> */

  if (!isAuthenticated) {
    return <img className="lol-logo-image" src="/LOL_Icon_Rendered.png" />; // No renderizar nada mientras redirige
  }

  const layoutBackgroundImage = (actualSection) => {
    /*if(actualSection === 'Home'){
      return '/Jayce_34.jpg'
    } else {
      return '/magic_background.png'
    }*/
    switch (actualSection) {
      case "league": {
        return "/Jayce_34.webp";
      }
      case "store": {
        return "/store_background.png";
      }
      case "collection": {
        return "/collection_background.png";
      }
      default:
        return null;
    }
  };
  const isQueueSelected =
    userState === "Ranked Solo/Duo" ||
    userState === "Intermedio" ||
    userState === "Ranked Flex" ||
    userState === "Swiftplay";
  return user.profile_icon ? (
    <div className="dashboard-layout w-screen min-h-screen">
      <div
        className={`background-engine ${isQueueSelected && actualSection === "room" ? "in-room" : null}`}
        style={{
          backgroundImage: isNavigating
            ? "var(--blue-five)"
            : `url(${layoutBackgroundImage(actualSection)})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          style={{ display: actualSection === "room" ? "flex" : "none" }}
          className="bg-layer bg-lobby"
        ></div>
        <div
          style={{ display: actualSection === "room" ? "flex" : "none" }}
          className={`bg-layer bg-room`}
        ></div>
      </div>
      <ResponsiveHeader
        setShowSideNav={setShowSideNav}
        showSideNav={showSideNav}
      />
      <RightNav setShowSideNav={setShowSideNav} showSideNav={showSideNav} />
      <Chat socket={socket.current} />
      <MusicPlayer
        url="/music/Xin Zhao, the Seneschal of Demacia.mp3" /*'/music/Xin Zhao, the Seneschal of Demacia.mp3'*/
      />
      {itemToBuy && <ConfirmPurchaseModal />}
      <section className="dashboard">
        {!isNavigating && children}
        {isNavigating && <LoadingOverlay />}
      </section>
    </div>
  ) : (
    <></>
  );
}

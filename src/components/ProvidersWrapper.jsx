"use client";

import "$/(dashboard)/collection/collection.css";
import "$/(dashboard)/store/store.css";
import "$/(dashboard)/play/play.css";
import "@/components/LoadingOverlay/LoadingOverlay.css"
import ResponsiveHeader from "@/components/header";
import RightNav from "@/components/rightNav/rightNav.jsx";

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
import ConfirmPurchaseModal from "./confirmPurchaseModal/confirmPurchaseModal";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import TooltipLayer from "./Tooltip/globalTooltip/TooltipLayer";
import "$/(dashboard)/index.css";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { setUser } from "@/redux/slices/userSlice";
import {
  selectUserInterfaceData,
  setActualSection,
} from "@/redux/slices/userInterfaceSlice.ts";
import {
  getUserChampions,
} from "@/redux/slices/userChampionsSlice.js";
import {
  getUserSkins,
} from "@/redux/slices/userSkinsSlice.js";
import { setFriendsOnline } from "@/redux/slices/connectedUsersSlice.ts";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { setMute, setVolume } from "@/redux/slices/soundSlice.js";
import { selectPurchaseData } from "@/redux/slices/purchaseSlice";
import { addMessage, setMessages } from "@/redux/slices/chatSlice";

export default function ProvidersWrapper({ children }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const socket = useRef(null);
  const { token } = useAuth();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const user = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.auth);
  const { actualSection, isNavigating, userState } = useSelector(
    selectUserInterfaceData,
  );
  const { itemToBuy } = useSelector(selectPurchaseData);
  const [showSideNav, setShowSideNav] = useState(true);
  const [setBattleRequest] = useState([])



  useEffect(() => {
    const sectionName = pathname.split("/").pop();
    dispatch(setActualSection(sectionName));
  }, [pathname]);

  useEffect(() => {
    if (token) {
      dispatch(getUserChampions(token));
      dispatch(getUserSkins(token));
      try {
        fetch(`${API_URL}api/v1/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token }),
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
  }, [token]);

  useEffect(() => {
    if (!token) return;

    socket.current = io(`${API_URL}`, { auth: { token } });

    return () => {
      socket.current?.disconnect();
    };
  }, [token]);


  useEffect(() => {
    socket.current?.on("battle-mailbox", (msg) => {
      const request = [{ roomId: msg.roomId, from: msg.from, to: msg.from }];
      setBattleRequest(request);
      setTimeout(() => {
        setBattleRequest([]);
      }, 7000);
    });
    return () => socket.current?.off("battle-mailbox");
  }, [token]);

  useEffect(() => {
    if(!socket.current) return
    socket.current?.on("chat-message", (msg) => {
      dispatch(addMessage(msg));
    });
    return () => socket.current?.off("chat-message");
  }, [token]);

  useEffect(() => {
    if (!socket.current) return;
    socket.current?.on("user-list", (msg) => {
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
  }, [token]);


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

  const layoutBackgroundImage = (actualSection) => {
    switch (actualSection) {
      case "league": {
        return "/Jayce_34.webp";
      }
      case "store": {
        return "/store_background.webp";
      }
      case "collection": {
        return "/collection_background.webp";
      }
      default:
        return null;
    }
  };

  const isInQueue =
    userState !== "online";

  return user.profile_icon ? (
    <div className="dashboard-layout w-screen min-h-screen">
      <div
        className={`background-engine ${isInQueue && actualSection === "play" ? "in-room" : null}`}
        style={{
          backgroundImage: isNavigating
            ? "var(--blue-five)"
            : `url(${layoutBackgroundImage(actualSection)})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          style={{ visibility: actualSection === "play" ? "visible" : "hidden" }}
          className="bg-layer bg-lobby"
        ></div>
        <div
          style={{ visibility: actualSection === "play" ? "visible" : "hidden" }}
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
        url="/music/Xin Zhao, the Seneschal of Demacia.mp3"
      />
      <TooltipLayer></TooltipLayer>
      {itemToBuy && <ConfirmPurchaseModal />}
      <section className="dashboard">
        {children}
        {isNavigating && <LoadingOverlay />}
      </section>
    </div>
  ) : (
    <></>
  );
}

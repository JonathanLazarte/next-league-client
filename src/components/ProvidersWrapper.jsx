"use client";

import "$/(dashboard)/dashboard.css";
import "$/(dashboard)/collection/collection.css";
import "$/(dashboard)/store/store.css";
import "$/(dashboard)/play/play.css";
import "@/components/LoadingOverlay/LoadingOverlay.css"
import ResponsiveHeader from "@/components/header";
import SideNav from "@/components/rightNav/rightNav.jsx";

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


import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useUserInterface } from "@/hooks/useUserInterface";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useSoundState } from "@/hooks/useSoundState";
import { usePurchase } from "@/hooks/usePurchase";
import { useChat } from "@/hooks/useChat";
import useLoadingDelay from "@/hooks/useLoadingDelay";

export default function ProvidersWrapper({ children }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const socket = useRef(null);
  const pathname = usePathname();

  const { token, loading, isAuthenticated } = useAuth();
  const { user, fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins();
  const { setFriendsOnline } = useConnectedUsers();
  const { setMute, setVolume } = useSoundState();
  const { itemToBuy } = usePurchase();
  const { addMessage, setMessages } = useChat();
  const { actualSection, isNavigating, queue, changeSection } = useUserInterface();
  const [ /*partyRequest,*/ setPartyRequest] = useState([])
  const showLoading = useLoadingDelay(isNavigating)

  useEffect(() => {
    const sectionName = pathname.split("/").pop();
    changeSection(sectionName);
  }, [pathname, changeSection]);

  useEffect(() => {
    if (token) {
      getUserChampions(token);
      getUserSkins(token);
      fetchUser(token)
    }
  }, [API_URL, getUserChampions, getUserSkins, setMessages, setMute, fetch, setVolume, token]);


  /*setUser(data);
  const { master, sfx, music } = data.settings.sound;
  setVolume({ type: "master", val: master.volume });
  setVolume({ type: "sfx", val: sfx.volume });
  setVolume({ type: "music", val: music.volume });
  setMute({ type: "master", muted: master.muted });
  setMute({ type: "sfx", muted: sfx.muted });
  setMute({ type: "music", muted: music.muted });
  setMessages(data.messages); */

  useEffect(() => {
    if (!token) return;

    socket.current = io(`${API_URL}`, { auth: { token } });

    return () => {
      socket.current?.disconnect();
    };
  }, [API_URL, token]);


  useEffect(() => {
    socket.current?.on("battle-mailbox", (msg) => {
      const request = [{ roomId: msg.roomId, from: msg.from, to: msg.from }];
      setPartyRequest(request);
      setTimeout(() => {
        setPartyRequest([]);
      }, 7000);
    });
    return () => socket.current?.off("battle-mailbox");
  }, [token]);

  useEffect(() => {
    if (!socket.current) return
    socket.current?.on("chat-message", (msg) => {
      console.log(msg)
      addMessage(msg);
    });
    return () => socket.current?.off("chat-message");
  }, [addMessage, token]);

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
      setFriendsOnline(friendFolders);
    });
    return () => socket.current?.off("user-list");
  }, [setFriendsOnline, token]);



  if (!user.profile_icon || loading || !isAuthenticated) {
    return (
      <div
        className="dashboard-loading-screen flex items-center content-center justify-center w-screen min-h-screen"
      >
        <img style={{width: "100%"}} src="/loading-golden.png"></img>
          <svg id="Capa_2" className="hextech-loading-svg" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 769.62 776.17">
            <g id="Lines">
              <ellipse className="cls-1" cx="384.81" cy="388.09" rx="377.81" ry="381.09"/>
            </g>
          </svg>
        <div className="text-center absolute">
          <Image
            className="lol-logo-image"
            src="/LOL_Icon_Rendered.png"
            width={240}
            height={240}
          />
          <div className="loading-underlogo"> LOADING </div>
        </div>
      </div>
    )
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
        return "/img.jpg";
    }
  };

  const isInQueue =
    queue !== null;

  return (
    <div className="dashboard-layout w-screen min-h-screen">
      <div
        className={`background-engine ${isInQueue && actualSection === "play" ? "in-room" : null}`}
        style={{
          backgroundImage: showLoading
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
      <ResponsiveHeader/>
      <SideNav />
      <Chat socket={socket} />
      <MusicPlayer
        url="/music/Xin Zhao, the Seneschal of Demacia.mp3"
      />
      <TooltipLayer></TooltipLayer>
      {itemToBuy && <ConfirmPurchaseModal />}
      <section className="dashboard">
        {children}
        {showLoading && <LoadingOverlay />}
      </section>
    </div>
  );
}

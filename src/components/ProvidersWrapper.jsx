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
import { usePurchase } from "@/hooks/usePurchase";
import { useChat } from "@/hooks/useChat";
import useLoadingDelay from "@/hooks/useLoadingDelay";
import BackgroundEngine from "@/components/BackgroundEngine/BackgroundEngine";




export default function ProvidersWrapper({ children }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const socket = useRef(null);
  const pathname = usePathname();

  const { token, loading, isAuthenticated } = useAuth();
  const { user, fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins();
  const { setFriendsOnline } = useConnectedUsers();
  const { itemToBuy } = usePurchase();
  const { addMessage } = useChat();
  const { actualSection, isNavigating, queue, changeSection } = useUserInterface();
  const [ ,setPartyRequest] = useState([])
  const showLoading = useLoadingDelay(isNavigating, { delay: 100 })
  const isInQueue = queue !== null;

  useEffect(() => {
    const section = pathname.split("/").pop();
    changeSection(section);
  }, [pathname, changeSection]);

  useEffect(() => {
    if (!token) return

    getUserChampions(token);
    getUserSkins(token);
    fetchUser(token)

  }, [API_URL, getUserChampions, getUserSkins, fetchUser, token]);


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
  }, [setPartyRequest]);

  useEffect(() => {
    if (!socket.current) return
    socket.current?.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => socket.current?.off("chat-message");
  }, [addMessage, token]);

  useEffect(() => {
    if (!socket.current) return;
    socket.current?.on("user-list", (msg) => {
      //const actualUserIndex = msg.findIndex((u) => u.alias === user.alias);
      //msg.splice(actualUserIndex, 1);
      const ownIndex = msg.findIndex(u => u.alias === user.alias);
      msg.splice(ownIndex, 1);
      const friendFolders = [
        {
          name: "general",
          users: msg,
        },
      ];

      setFriendsOnline(friendFolders);
    });
    return () => socket.current?.off("user-list");
  }, [setFriendsOnline, token, user.alias]);



  if (!user.profile_icon || loading || !isAuthenticated) {
    return (
      <div
        className="dashboard-loading-screen flex items-center content-center justify-center w-screen min-h-screen"
      >
        <img style={{ width: "100%" }} src="/loading-golden.png"/>
        <svg id="Capa_2" className="hextech-loading-svg" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 769.62 776.17">
          <g id="Lines">
            <ellipse className="cls-1" cx="384.81" cy="388.09" rx="377.81" ry="381.09" />
          </g>
        </svg>
        <div className="text-center absolute">
          <Image
            className="lol-logo-image"
            src="/LOL_Icon_Rendered.png"
            width={240}
            height={240}
            alt="League of Legends logo"
          />
          <div className="loading-underlogo"> LOADING </div>
        </div>
      </div>
    )
  }


  return (
    <div className="dashboard-layout w-screen min-h-screen">
      <section className="dashboard">
        {children} {showLoading && <LoadingOverlay />}
      </section>
      <BackgroundEngine isInQueue={isInQueue} actualSection={actualSection} showLoading={showLoading}></BackgroundEngine>
      <ResponsiveHeader />
      <SideNav />
      <Chat socket={socket} />
      <MusicPlayer url="/music/Xin Zhao, the Seneschal of Demacia.mp3" />
      <TooltipLayer></TooltipLayer>
      {itemToBuy && <ConfirmPurchaseModal />}
    </div>
  );
}

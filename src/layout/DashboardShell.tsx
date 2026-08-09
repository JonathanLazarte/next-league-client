"use client";

import "$/(dashboard)/dashboard.css";
import "$/(dashboard)/collection/collection.css";
import "$/(dashboard)/store/store.css";
import "$/(dashboard)/play/play.css";
import "@/components/LoadingOverlay/LoadingOverlay.css"
import ResponsiveHeader from "@/components/header";
import SideNav from "@/components/SideNav/SideNav";

import Chat from "@/components/chat/chat.jsx"
import MusicPlayer from "@/components/Audio/MusicPlayer"

import ConfirmPurchaseModal from "@/components/confirmPurchaseModal/confirmPurchaseModal";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import TooltipLayer from "@/components/Tooltip/globalTooltip/TooltipLayer";


import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useUserInterface } from "@/hooks/useUserInterface";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { usePurchase } from "@/hooks/usePurchase";
import { useSocket } from '@/socket/useSocket'
import { useUserListSocket } from '@/socket/useUserListSocket'
import { useChatSocket } from '@/socket/useChatSocket'

import useLoadingDelay from "@/hooks/useLoadingDelay";
import BackgroundEngine from "@/components/BackgroundEngine/BackgroundEngine";
import DashboardLoading from '@/components/Loading/DashboardLoading'


export default function ProvidersWrapper({ children }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const pathname = usePathname();

  const { token, loading, isAuthenticated } = useAuth();
  const { user, fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins();
  const { itemToBuy } = usePurchase();
  const { actualSection, isNavigating, queue, changeSection } = useUserInterface();
  const socket = useSocket(token);
  const userList = useUserListSocket(socket, user)
  const chatSocket = useChatSocket(socket)
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

  console.log(userList)
  console.log(chatSocket)

  if (!user.profile_icon || loading || !isAuthenticated) {
    return <DashboardLoading></DashboardLoading>
  }


  return (
    <div className="dashboard-layout w-screen min-h-screen">
      <section className="dashboard">
        {children} {showLoading && <LoadingOverlay />}
      </section>
      <BackgroundEngine isInQueue={isInQueue} actualSection={actualSection} showLoading={showLoading}></BackgroundEngine>
      <ResponsiveHeader />
      <SideNav />
      <Chat />
      <MusicPlayer url="/music/Xin Zhao, the Seneschal of Demacia.mp3" />
      <TooltipLayer></TooltipLayer>
      {itemToBuy && <ConfirmPurchaseModal />}
    </div>
  );
}

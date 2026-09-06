"use client";

import "$/(dashboard)/dashboard.css";
import "$/(dashboard)/collection/collection.css";
import "$/(dashboard)/collection/champions/champions.css";
import "$/(dashboard)/store/store.css";
import "$/(dashboard)/play/play.css";
import "@/components/LoadingOverlay/LoadingOverlay.css"

import ResponsiveHeader from "@/components/Header";
import SideNav from "@/components/SideNav/SideNav";
import Chat from "@/components/Chat/Chat"
import MusicPlayer from "@/components/Audio/MusicPlayer"
import ConfirmPurchaseModal from "@/components/ConfirmPurchaseModal/ConfirmPurchaseModal";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import TooltipLayer from "@/components/tooltips/GlobalTooltip/TooltipLayer";
import BackgroundEngine from "@/components/BackgroundEngine/BackgroundEngine";
import DashboardLoading from '@/components/Loading/DashboardLoading'


import { useUserInterface } from "@/hooks/useUserInterface";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { usePurchase } from "@/hooks/usePurchase";
import { useSocket } from '@/socket/useSocket'
import { useUserListSocket } from '@/socket/useUserListSocket'
import { useChatSocket } from '@/socket/useChatSocket'
import { useAppHydration } from "@/hooks/useAppHydration";
import useLoadingDelay from "@/hooks/useLoadingDelay";
import { useRouteSync } from '@/hooks/useRouteSync'



export default function ProvidersWrapper({ children }) {
  const { token, loading: authLoading, isAuthenticated } = useAuth();
  const { user } = useUser();
  const { itemToBuy } = usePurchase();
  const { isNavigating } = useUserInterface();
  const socket = useSocket(token);
  const showLoading = useLoadingDelay(isNavigating, { delay: 100 })
  const isReady = !user.alias || authLoading || !isAuthenticated

  useAppHydration(token)
  useUserListSocket(socket, user)
  useChatSocket(socket)
  useRouteSync()

  if (isReady) { return <DashboardLoading /> }


  return (
    <div className="dashboard-layout w-screen min-h-screen">
      <BackgroundEngine />
      <ResponsiveHeader />
      <SideNav />
      <Chat />
      <MusicPlayer />
      <TooltipLayer />
      {itemToBuy && <ConfirmPurchaseModal />}
      <main className="dashboard">
        {children} {showLoading && <LoadingOverlay />}
      </main>
    </div>
  );
}

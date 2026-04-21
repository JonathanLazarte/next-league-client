"use client";

import ResponsiveHeader from "@/components/header";
import RightNav from "@/components/rightNav/rightNav.jsx";
/*import Chat from '@/components/chat/chat.jsx'*/
const Chat = dynamic(() => import("@/components/chat/chat.jsx"), {
  ssr: false,
});
const MusicPlayer = dynamic(() => import("@/components/Audio/MusicPlayer"), {
  ssr: false,
});
const ConfirmPurchaseModal = dynamic(
  () => import("@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx"),
  { ssr: false },
);
import "../../app/(dashboard)/index.css";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "@/hooks/useRouter";
import Image from "next/image";

import { setUser /*, setUserMessages*/ } from "@/redux/slices/userSlice.js";
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
import { useQueryClient } from "@tanstack/react-query";
import { selectPurchaseData } from "@/redux/slices/purchaseSlice";

export default function ProvidersWrapper({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showSideNav, setShowSideNav] = useState(true);
  const queryClient = useQueryClient();
  /*useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])*/

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
  const { actualSection, isNavigating } = useSelector(selectUserInterfaceData);
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
    localStoreToken && dispatch(getUserChampions(localStoreToken));
    localStoreToken && dispatch(getUserSkins(localStoreToken));
    localStoreToken &&
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
          } else {
            // Token inválido, redirigir al login
          }
        });
  }, [localStoreToken]);

  useEffect(() => {
    socket.current = io(`${API_URL}`, { auth: { token } });
    return () => {
      socket.current.disconnect();
    };
  }, []);
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
  }, [isAuthenticated, loading, router, dispatch, localStoreToken]);
  //----------------------------------------------------------------------------------

  useEffect(() => {
    user.id && socket.current.emit("authenticate", { userName: user.userName });
    return () => socket.current.off("authenticate");
  }, [user]);

  useEffect(() => {
    socket.current.on("battle-mailbox", (msg) => {
      const request = [{ roomId: msg.roomId, from: msg.from, to: msg.from }];
      setBattleRequest(request);
      setTimeout(() => {
        setBattleRequest([]);
      }, 7000);
    });
    return () => socket.current.off(token);
  }, []);

  useEffect(() => {
    socket.current.on("user-list", (msg) => {
      const actualUserIndex = msg.findIndex((u) => u.userName == user.userName);
      msg.splice(actualUserIndex, 1);
      const friendFolders = [
        {
          name: "general",
          users: msg,
        },
      ];
      dispatch(setFriendsOnline(friendFolders));
    });
    return () => socket.current.off("user-list");
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
  return user.profileIcon ? (
    <div
      className="dashboard-layout w-screen min-h-screen"
      style={{
        /*paddingTop: 'var(--dashboard-header-height)',
      paddingRight: `${window.innerWidth < 1400 ? '0px' : 'var(--dashboard-sidebar-width)'}`,*/
        backgroundImage: isNavigating
          ? "var(--blue-five)"
          : `url(${layoutBackgroundImage(actualSection)})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ResponsiveHeader
        setShowSideNav={setShowSideNav}
        showSideNav={showSideNav}
      />
      <RightNav setShowSideNav={setShowSideNav} showSideNav={showSideNav} />
      <Chat />
      <MusicPlayer
        url="/music/Xin Zhao, the Seneschal of Demacia.mp3" /*'/music/Xin Zhao, the Seneschal of Demacia.mp3'*/
      />
      {itemToBuy && <ConfirmPurchaseModal />}
      <section className="dashboard">
        {!isNavigating && children}
        {isNavigating && (
          <div
            style={{
              height: "100vh",
              width: "100vw",
              backgroundColor: "var(--blue-five)",
              position: "fixed",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          ></div>
        )}
      </section>
    </div>
  ) : (
    <div></div>
  );
}

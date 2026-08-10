import { useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image'
/*import { v4 as uuidv4 } from 'uuid';*/
import "./pvp.css";
import FindMatchButton from "@/components/playButton/FindMatchButton/FindMatchButton.jsx";
import { setQueue, selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice.ts";
import { useSound } from "@/hooks/useSound"

export default memo(function PvpRoom({ socket, setRoomUsers, roomTitle }) {
  const RESOURCES_URL =
    "/" ||
    "https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/";
  const [, /*roomId*/ setRoomId] = useState();
  /*const newRoom = uuidv4()*/
  const user = useSelector((state) => state.user);
  const { queueStatus } = useSelector(selectUserInterfaceData)
  const dispatch = useDispatch();
  const lobbyName = {
    'ranked_solo_duo': 'SR · Ranked Solo/Duo · Draft',
    'ranked_flex': 'SR · Ranked Flex · Draft',
    'swiftplay': 'SR · Swiftplay · BLIND',
    'aram': 'RNG · ARAM · RANDOM',
    'aram_mayhem': 'RNG · ARAM: MAYHEM · RANDOM',
    'intro': 'SR · INTRO · BLIND',
    'beginner': 'SR · BEGINNER · BLIND',
    'intermediate': 'SR · Intermediate · Blind',
  }
  const { play: playTransToGameselect} = useSound('/sfx/sfx-lobby-trans-to-gameselect.ogg')

  useEffect(() => {
    socket?.current.on("USER JOINED", ({ room, roomId }) => {
      setRoomId(roomId);
      setRoomUsers(room);

      const indexRoom = room.findIndex((id) => id == socket?.current.id);
      const currentPlayer = indexRoom == 0 ? "One" : "Two";
      localStorage.setItem("currentPlayer", currentPlayer);
      localStorage.setItem("roomId", roomId);
      if (room.length == "2") {
        socket?.current.emit("start-match", { roomId });
      }
    });
    return () => socket?.current?.off("USER JOINED");
  }, []);

  useEffect(() => {
    socket?.current.on("USER-OUT", ({ newRoom }) => {
      setRoomUsers(newRoom);
    });
    return () => socket?.current.off("USER-OUT");
  }, []);

  useEffect(() => {
    socket?.current.on("find-opponent", ({ roomId }) => {
      console.log(roomId);
      socket?.current.emit("join-room", { roomId: roomId });
    });
    return () => socket?.current.off("find-opponent");
  }, []);

  const handleBack = () => {
    playTransToGameselect();
    dispatch(setQueue(null));
  }

  return (
    <section className="pvp-room">
      <div className="room-header">
        <svg
          className={`header-arrow ${ queueStatus !== 'idle' ? 'disabled' : ''}`}
          id="Capa_2"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 41.23"
          onClick={() => handleBack()}
        >
          <defs>
            <linearGradient id="active-hextech-metal-gradient" gradientTransform="rotate(90)">
              <stop offset="5%" className="stop-1" stopColor="var(--gold-one)" />
              <stop offset="95%" className="stop-2" stopColor="var(--gold-three)" />
            </linearGradient>
          </defs>
          <g className="header-arrow-border" id="Capa_1-2" data-name="Capa 1">
            <path d="M.03,20.78c-.04-.06-.03-.19,0-.25L20.36,0l9.63,9.59-10.88,11.03,10.88,11.04-9.52,9.57L.03,20.78ZM20.39,36.21l4.6-4.56-10.89-11.03,10.88-10.97-4.55-4.63-15.38,15.54,15.35,15.66Z" />
          </g>
        </svg>
        <div className="header-queue-info">
          <Image
            width={42}
            height={42}
            className="header-map-icon"
            src={`${RESOURCES_URL}general/mini-sr.png`}
            alt="Map mini icon"
          />
          <h3 className="room-title">{lobbyName[roomTitle]}</h3>
        </div>
      </div>
      <div className="room-users">
        <div className="room-user">
          <Image
            className="user-banner"
            src="/banner/official (27).png"
            sizes={"38rem"}
            width={580}
            height={1480}
            alt="User banner"
          />
          <div className="user-banner-info-container">
            <div className="banner-user-icon">
              <Image
                className="banner-user-border"
                src={`${RESOURCES_URL}profileborder/8.png`}
                sizes={"25rem"}
                width={500}
                height={600}
                alt="User border from banner"
              />
              <Image
                className="banner-user-icon-img"
                src={`${RESOURCES_URL}profileicon/${user.profile_icon}.png`}
                width={300}
                height={300}
                alt="User icon from banner"
              />
              <video
                className="banner-user-border-magic"
                src="/profileborder/emblem-wings-magic-grandmaster.webm"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
              ></video>
            </div>
            <h2 className="banner-username">{user.alias}</h2>
            <span className="banner-alias">{user.title}</span>
          </div>
        </div>
        {/*roomUsers?.map((roomUserId, index)=>{
                    const roomUser = connectedUsers?.find(cu => cu.socketID == roomUserId)
                    return <div className="room-user">
                        <img className="user-banner" src="/general/banner.png"/>
                        <div className="user-banner-info-container">
                            <div className="banner-user-icon">
                                <img className="banner-user-border" src="/general/EoG_Border_150_4k.png"/>
                                <img className="banner-user-icon-img" src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${roomUser?.profileIcon}.png`}></img>
                            </div>
                            <h2></h2>
                            <span></span>
                        </div>
                    </div>
                    })
                    */}
      </div>
      <div className="party-chat"><input type="text" placeholder="Type here..."></input></div>
      <FindMatchButton
        type={"pvp-room"}
        socket={socket}
        setRoomId={setRoomId}
        queueStatus={queueStatus}
      ></FindMatchButton>
    </section>
  );
});

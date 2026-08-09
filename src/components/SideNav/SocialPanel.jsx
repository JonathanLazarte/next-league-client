import { useState, useEffect} from "react";
import { FaUserPlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { VscTriangleRight } from "react-icons/vsc";
import Friend from './Friend'
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useChat } from "@/hooks/useChat";


export default function SocialPanel ({ tooltipPosRef, onHoverEnd, onHoverStart }) {
  const [showMenu, setShowMenu] = useState();
  //const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const iconStyle = isFolderOpen ? { transform: "rotate(90deg)" } : null;
  const folderStyle = !isFolderOpen ? { display: "none" } : null;
  const { friendsOnline } = useConnectedUsers();
  const {
    updateChatUser,
    battleRequest
  } = useChat();

  // Update chat users when friends list changes
  useEffect(() => {
    if (friendsOnline) {
      friendsOnline.forEach((folder) => {
        folder.users.forEach((u) => {
            updateChatUser({
                userId: u.alias,
                userName: u.alias,
                profile_icon: u.profile_icon,
                profile_border: u.profile_border,
                status: u.status,
                unreadCount: 0,
              });
        });
      });
    }
  }, [friendsOnline, updateChatUser]);

  const inviteBox = (userName) => {
    const userRequest = battleRequest.find(
      (request) => request.from == userName,
    );
    return (
      userRequest && (
        <div /*styles={{height:'200px'}}*/ className="invitation-box">
          <span>{userName} te ha invitado a un enfrentamiento</span>
          <div>
            <button /*onClick={()=>handleEmitAcceptBattleRequest(userRequest.roomId)}*/
            >
              Aceptar
            </button>
            <button>Rechazar</button>
          </div>
        </div>
      )
    );
  };
  /*const Menu = () => {
    return <div
      className="custom-menu"
      style={{
        position: "fixed",
        left: menuPosition.x,
        top: menuPosition.y,
      }}
    >
      <h5
        className={selectedChat == user.userName ? "blocked" : null}
        onClick={() => {
          setShowMenu(false);
          selectedChat != user.userName && handleEmitBattleRequest();
        }}
      >
        Invitar a una partida
      </h5>
      <h5 onClick={() => setShowMenu(false)}>Ver perfil</h5>
    </div>
  }*/

  return friendsOnline?.map((folder) => (
    <>
      <div onClick={() => setShowMenu(false)} className="online-users">
        {showMenu && (null/*<Menu></Menu>*/) }
        <div className="social-menu">
          SOCIAL
          <div className="social-icons">
            <FaUserPlus className="social-icon" />
            <FaFolderPlus className="social-icon" />
            <GiHamburgerMenu className="social-icon" />
            <FaSearch className="social-icon" />
          </div>
        </div>
      </div>
    <ul className="general-user-list" key={folder.name}>
      <div
        className="user-folder-name"
        onClick={() => setIsFolderOpen((p) => !p)}
      >
        <VscTriangleRight style={iconStyle} className="triangle" />
        {folder.name.toUpperCase() + " "}({folder.users.length}/
        {folder.users.length})
      </div>

      <div style={folderStyle}>
        {folder.users.map((u) => (
          <Friend
            user={u}
            key={u.alias}
            battleRequest={battleRequest}
            inviteBox={inviteBox}
            toolTipPosRef={tooltipPosRef}
            onHoverStart={() => onHoverStart(u)}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>
      </ul>
    </>
  ));
}

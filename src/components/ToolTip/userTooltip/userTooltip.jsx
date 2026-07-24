"use client";

import "./userTooltip.css";
import { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";

export const ToolTip = ({ hoveredUser: dataToRender, tooltipPos }) => {
  const ref = useRef();
  const [tooltipHeight, setTooltipHeight] = useState();
  useLayoutEffect(() => {
    setTooltipHeight(ref.current?.getBoundingClientRect().height);
  }, [tooltipPos]);
  const getRem = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const currentRem = getRem();

  const RESOURCES_URL =
    "/" ||
    "https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/";
  const style = {
    position: "fixed",
    //width: windowPosition.width,
    display: `${dataToRender ? "flex" : "none"}`,
    right: tooltipPos.x + currentRem * 2,
    top: tooltipPos.y - tooltipHeight / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url('${RESOURCES_URL}centered/${dataToRender?.profile_background}.jpg')`,
    pointerEvents: "none",
  };
  return (
    <div className="right-nav-user-tooltip" style={style} ref={ref}>
      <div className="tooltip-user-container">
        <div className="tooltip-user-level">
          <Image
            src={`${RESOURCES_URL}general/7201_Precision.png`}
            width={30}
            height={30}
          />
          <h3>24</h3>
        </div>
        <div className="tooltip-user-info">
          <div className="tooltip-user-icon">
            <img
              className="tooltip-user-border"
              src={`${RESOURCES_URL}profileborder/1.png`}
            />
            <Image
              className="tooltip-user-icon-img"
              src={`${RESOURCES_URL}profileicon/${dataToRender?.profile_icon}.png`}
              width={100}
              height={100}
            />
          </div>
          <div className="tooltip-user-info-text">
            <h4>{dataToRender?.alias}</h4>
            <h6 className="subname">#{dataToRender?.tag}</h6>
            <span className="user-title">{dataToRender?.title}</span>
            <div className="separator" />
            <span className="rank-and-points">
              {dataToRender?.rank?.name} ({dataToRender?.rank?.points} pts)
            </span>
          </div>
        </div>
        <div className="tooltip-user-status">
          <div className="user-status">
            <div
              style={{ width: "10px", height: "10px" }}
              className="status-icon"
            ></div>{" "}
            En linea{" "}
          </div>
        </div>
      </div>
    </div>
  );
  /*const handleToolTip = (e, data) => {
      if (timeoutId){
          clearTimeout(timeoutId);
        }
        const nuevoTimeOutId = setTimeout(()=>{
        const elemento = e.target;
        const rect = elemento.getBoundingClientRect();

        setWindowPosition({ x: rect.left, y: rect.top + rect.height + 20, width: rect.width, height: rect.height })
        setDataToRender(data)
        setShowWindow(true)
      },550)
      setTimeoutId(nuevoTimeOutId)
    }
    const offToolTip = () => {
      setShowWindow(false)
      if (timeoutId) {
          clearTimeout(timeoutId); // Cancelar el timeout si el mouse sale
          setTimeoutId(null); // Limpiar el ID del timeout
        }
    }*/
};

export default ToolTip;

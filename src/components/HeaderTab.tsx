"use client"; // si usas Next.js App Router
import React from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import "./HeaderTab.css"; // o styled-components / tailwind con @layer

interface LoLHeaderTabProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function LoLHeaderTab({
  label,
  icon,
  active = false,
  disabled = false,
  onClick,
}: LoLHeaderTabProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Posición relativa del mouse (0–1)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring para suavizar el seguimiento (muy sutil, como en LoL)
  const springConfig = { damping: 25, stiffness: 120 };
  const mx = useSpring(mouseX, springConfig);
  const my = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.button
      ref={ref}
      className={`item-lol lol-tab relative px-5 py-3.5 font-spiegel uppercase tracking-wider text-sm font-medium overflow-hidden
        ${active ? "active" : ""}
        ${disabled ? "opacity-40 pointer-events-none" : "cursor-pointer"}
      `}
      disabled={disabled}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={false}
      animate={active ? "active" : isHovered ? "hover" : "idle"}
      // Asimetria extrema aquí via variants + transition personalizada por propiedad
      variants={{
        idle: {
          color: "#c8aa6e",
          "--highlight-opacity": 0,
          "--shine-opacity": 0,
          "--glow-blur": "8px",
          "--mouse-shine-opacity": 0,
        },
        hover: {
          color: "#f0e6d2",
          "--highlight-opacity": 0.9,
          "--shine-opacity": 0.7,
          "--glow-blur": "24px",
          "--mouse-shine-opacity": 0.55,
          transition: {
            color: { duration: 0.08, ease: "easeOut" },
            "--highlight-opacity": { duration: 0.12, ease: "easeOut" },
            "--shine-opacity": { duration: 0.09, ease: "easeOut" },
            "--glow-blur": { duration: 0.18 },
            "--mouse-shine-opacity": { duration: 0.1 },
          },
        },
        active: {
          color: "#ffffff",
          "--highlight-opacity": 1,
          "--shine-opacity": 0.85,
          "--glow-blur": "32px",
          "--mouse-shine-opacity": 0.4,
          transition: { duration: 0.25, ease: "easeOut" },
        },
      }}
      // Desvanecimiento MUY lento al salir
      transition={{
        default: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }, // overshoot + elastic feel al salir
        "--highlight-opacity": { duration: 1.4, ease: "easeOut" },
        "--shine-opacity": { duration: 1.8, ease: "easeOut" },
        "--mouse-shine-opacity": { duration: 2.2, ease: "easeOut" },
        "--glow-blur": { duration: 1.6, ease: "easeOut" },
      }}
    >
      {/* Fondo base metálico / oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1318] to-[#1a2127] rounded-md" />

      {/* Capa highlight principal (metal dorado con viñeta) */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(200,170,110,0.18) 0%, transparent 70%)",
          opacity: "var(--highlight-opacity)",
          boxShadow: "inset 0 1px 0 rgba(240,230,210,0.08)",
        }}
      />

      {/* Shine diagonal rápido (como rayo de luz) */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none overflow-hidden"
        style={{ opacity: "var(--shine-opacity)" }}
      >
        <motion.div
          className="w-[200%] h-[200%] -left-1/2 -top-1/2 bg-gradient-to-br from-transparent via-white/20 to-transparent"
          animate={{ rotate: 35, x: "-25%", y: "-25%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </motion.div>

      {/* Glow / bloom externo (box-shadow múltiple) */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          boxShadow: `
            0 0 var(--glow-blur) 6px rgba(200,170,110,0.35),
            inset 0 0 40px rgba(200,170,110,0.12)
          `,
        }}
      />

      {/* Brillo radial que sigue el mouse (muy sutil) */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          background: `radial-gradient(circle 180px at calc(var(--mx) * 100%) calc(var(--my) * 100%), rgba(240,230,210,0.45), transparent 70%)`,
          opacity: "var(--mouse-shine-opacity)",
        }}
        // Actualizamos --mx y --my via style inline porque framer no anima custom props directamente bien
        animate={{ "--mx": mx.get(), "--my": my.get() } as any}
      />

      {/* Contenido */}
      <div className="relative z-10 flex items-center gap-2.5 mix-blend-plus-lighter">
        {icon}
        <span>{label}</span>
      </div>

      {/* Borde superior dorado sutil en active/hover */}
      <AnimatePresence>
        {(isHovered || active) && (
          <motion.div
            className="absolute top-0 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent"
            initial={{ width: 0, opacity: 0, x: "-50%" }}
            animate={{ width: "80%", opacity: 0.7 }}
            exit={{ width: 0, opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
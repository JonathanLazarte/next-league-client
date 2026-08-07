"use client";

import "./desktopHeader.css";
import HeaderMainButton from "@/components/playButton/HeaderMainButton/HeaderMainButton";
import { memo } from "react";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useState } from 'react'
import useTooltipTrigger from '@/components/Tooltip/globalTooltip/TooltipTrigger'
import HeaderTab from './components/HeaderTab'
import HeaderWallet from './components/HeaderWallet'
import { LEFT_HEADER_TABS, RIGHT_HEADER_TABS } from '@/utils/constants.js'

export default memo(function DesktopHeader({ showSideNav }) {
  const { actualSection } = useUserInterface();
  const [ sectionTabSelected, setSectionTabSelected] = useState()
  const trigger = useTooltipTrigger()

  return (
    <>
      <header
        style={{
          marginRight: !showSideNav ? "0px" : null,
        }}
        className="index-header"
      >
        <HeaderMainButton setSectionTabSelected={setSectionTabSelected} />
        {LEFT_HEADER_TABS.map(section => (
          <HeaderTab
            key={section.id}
            setSectionTabSeleceted={setSectionTabSelected}
            sectionTabSelected={sectionTabSelected}
            actualSection={actualSection}
            section={section.id}
            type={section.type}
          />
        ))}
        <div className="header-sections">
          {RIGHT_HEADER_TABS.map(section => (
            <>
              <HeaderTab
                trigger={trigger}
                section={section.id}
                setSectionTabSeleceted={setSectionTabSelected}
                sectionTabSelected={sectionTabSelected}
                actualSection={actualSection}
                type={section.type}
              />
              {section.hasSeparator && <div className="tab-separator"></div>}
            </>
          ))}
          <HeaderWallet />
        </div>
      </header>
    </>
  );
});

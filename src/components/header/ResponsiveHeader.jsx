import React, { useEffect, useState } from 'react'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

export default function ResponsiveHeader({ showSideNav, setShowSideNav }){
	const [isMobile, setIsMobile] = useState(window.innerWidth < 767)

	useEffect(() => {
		const HandleResize = () => setIsMobile(window.innerWidth < 767)
		window.addEventListener('resize', HandleResize)

		return () => window.removeEventListener('resize', HandleResize)
	}, [])

	return isMobile ? <MobileHeader setShowSideNav={setShowSideNav} /> : <DesktopHeader showSideNav={showSideNav} />
}
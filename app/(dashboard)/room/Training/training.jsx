"use client";

import {memo} from 'react'
import './training.css'
import { MdArrowBackIos } from "react-icons/md";
import PlayButton from '@/components/playButton/playButton.jsx'
import { useDispatch } from 'react-redux'
import { setUserState } from '@/redux/slices/userInterfaceSlice.js'


export default memo(function Explore(){
	const dispatch = useDispatch()

	return <section className="explore-room">
		<div className='room-header'><MdArrowBackIos onClick={()=>{dispatch(setUserState('Online'))}} className="header-arrow" /><img src='https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/mini-sr.png'/><h3 className="room-title">GL · EXPLORACION DE ZONA · OCULTO</h3></div>
		<PlayButton type={"training"} text={"INICIAR"} />
	</section>
})
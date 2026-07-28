'use client'

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '@/redux/slices/userInterfaceSlice.ts';
import ConfirmButton from '@/components/playButton/confirmButton.jsx';

const QueueName = {
  'ranked_solo_duo': 'Ranked Solo/Duo',
  'ranked_flex': 'Ranked Flex',
  'swiftplay': 'Swiftplay',
  'aram': 'ARAM',
  'aram_mayhem': 'ARAM: Mayhem',
  'intro': 'Intro',
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
}


const RenderQueueSelector = ({ gameMode, setSelectedQueueGlobal }) => {
  const [ queueSelected, setQueueSelected ] = useState(gameMode.queues[0]);
  return (
    <div className="queues-wrapper" key={gameMode.title} >
      <div className="gamemode-description">
        <p>{queueSelected.description}</p>
      </div>
      {
        gameMode?.queues?.map((queue, index) => (
          <div
            className={`queue-option ${queueSelected.name === queue.name ? 'selected' : ''}`}
              onClick={() => { setQueueSelected(queue); setSelectedQueueGlobal(queue.name); }}
              key={index}
            >
            <div className="custom-checkbox">
              {queueSelected.name === queue.name && <div className="checkboxMark" />}
            </div>
            <span>{QueueName[queue.name]}</span>
          </div>
        ))
      }
    </div>
  );
};
const RenderGameMode = ({ gameMode, selectedMap, hoveredMap, setSelectedMap, setHoveredMap, setSelectedQueueGlobal }) => {
  return (
    <div className={`gamemode-wrapper ${hoveredMap === gameMode.title ? 'hovered' : ''} ${selectedMap === gameMode.title ? 'active' : ''}`}>
      <div className="gamemode-icon"
        onMouseLeave={() => setHoveredMap('')}
        onMouseEnter={() => {selectedMap !== gameMode.title && setHoveredMap(gameMode.title) }}
        onClick={() => {
          setSelectedMap(gameMode.title);
          hoveredMap === gameMode.title && setHoveredMap('');
        }}
      >
        <div className='map-img-wrapper'>
          <img
            src={`/general/${gameMode.disabledImg}`}
            alt={gameMode.title}
          />
          <img
            className='hover-img'
            src={`/general/${gameMode.hoverImg}`}
            alt={gameMode.title}
            style={{opacity: gameMode.title === hoveredMap ? 1 : 0}}
          />
          <img
            className='enabled-img'
            src={`/general/${gameMode.enabledImg}`}
            alt={gameMode.title}
            style={{opacity: gameMode.title === selectedMap ? 1 : 0}}
          />
        </div>
        <span className="mode-subtitle">{gameMode.subTitle}</span>
        <h1 className="mode-title">{gameMode.title}</h1>
        <div className="dividing-line"></div>
      </div>
      <RenderQueueSelector setSelectedQueueGlobal={setSelectedQueueGlobal} gameMode={gameMode} />
    </div>
  );
}

export default function ModeSelector({ data : gameModes }){
	const [ selectedMap, setSelectedMap ] = useState(gameModes[0].title);
	const [ hoveredMap, setHoveredMap ] = useState('');
  const dispatch = useDispatch();
  const [selectedQueueGlobal, setSelectedQueueGlobal] = useState(gameModes[0].queues[0].name);

  const handleConfirm = () => {
    dispatch(setUserState(selectedQueueGlobal));
  };

  useEffect(() => {
    const mapInfo = gameModes.find(map => map.title === selectedMap);
    setSelectedQueueGlobal(mapInfo?.queues[0].name);
  },[selectedMap])
	return <>

      <div className="play-selection-footer">
        <div className='gamemodes-grid'>
        {gameModes.map((gameMode, index) => (
          <RenderGameMode gameMode={gameMode} selectedMap={selectedMap} setSelectedMap={setSelectedMap} hoveredMap={hoveredMap} setHoveredMap={setHoveredMap} setSelectedQueueGlobal={setSelectedQueueGlobal} key={index} />
        ))}
        </div>
          <ConfirmButton
          text="CONFIRMAR"
          type="modeSelection"
          activeButtonAction={handleConfirm}
          />
      </div>
    </>
}

'use client'

import './room.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '@/redux/slices/userInterfaceSlice.js';
import ConfirmButton from '@/components/playButton/playButton.jsx';

export default function ModeSelector({ data : gameModes }){
	const [ mapSelected, setMapSelected ] = useState(gameModes[0].title);
	const [ hoveredMap, setHoveredMap ] = useState('');
	const [ queueSelected, setQueueSelected ] = useState(gameModes[0].queues[0]);
	const dispatch = useDispatch();


	const handleConfirm = () => {
	dispatch(setUserState(queueSelected));
	};


	return <>
      <div className="game-mode-grid">
          <div
            className="gamemode-icon"
            onMouseEnter={() => setHoveredMap(gameModes[0].title)}
            onMouseLeave={() => setHoveredMap('')}
            onClick={() => setMapSelected(gameModes[0].title)}
          >
            <img
              src={`/general/${
                hoveredMap === gameModes[0].title
                  ? gameModes[0].hoverImg
                  : mapSelected === gameModes[0].title
                  ? gameModes[0].enabledImg
                  : gameModes[0].disabledImg
              }`}
              alt={gameModes[0].title}
            />
            <span className="mode-subtitle">{gameModes[0].subTitle}</span>
            <h1 className="mode-title">{gameModes[0].title}</h1>
          </div>
      </div>

      <div className="play-selection-footer">
        {gameModes.map((gameMode, index) => (
          <div className="queues-wrapper" key={index} >
              <div className="gamemode-description">
                <p>{queueSelected.description}</p>
              </div>

              {
                gameMode.queues.map((queue, index) => (
                  <div
                    className="queue-option"
                    style={{
                      color: queueSelected.name === queue.name ? 'var(--gold-one)' : null,
                    }}
                    onClick={() => setQueueSelected(queue)}
                    key={index}
                  >
                    <div className="custom-checkbox">
                      {queueSelected.name === queue.name && <div className="checkboxMark" />}
                    </div>
                    <h3>{queue.name}</h3>
                  </div>
                ))
              }
          </div>
        ))}
                <ConfirmButton
          text="CONFIRMAR"
          type="modeSelection"
          modeSelected={mapSelected}
          queueSelected={queueSelected.name}
          okButtonAction={handleConfirm}
          />
      </div>
    </>
}
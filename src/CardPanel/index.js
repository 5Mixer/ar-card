import React, { useState } from 'react';
import ModelViewer from '../ModelViewer/ModelViewer';
import './cardPanel.css'

function CardPanel(props) {
    return (
        <div>
            <h1>{props.character.name}</h1>
            <div>
                ❤️
                <input type="number" value={props.character.health} onChange={(e) => {props.setHealth(e.target.value)}} />
            </div>
            <div>
                🗡️
                <input type="number" value={props.character.attack} onChange={(e) => {props.setAttack(e.target.value)}} />
            </div>

            <div>
                <button>Upload Model</button>
                <button>View Model in AR</button>
            </div>

            <ModelViewer></ModelViewer>
        </div>
    );
}

export default CardPanel;
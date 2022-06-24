import React, { useState } from 'react';
import './card.css'

function Card(props) {
    return (
        <div className={`card ${props.selected ? 'selected' : ''}`} onClick={props.onClick}>
            <h2>{props.character.name}</h2>
            <span className="stat">❤️ {props.character.health}</span>
            <span className="stat">🗡️ {props.character.attack}</span>
            <p>
                {props.character.description}
            </p>
            <ul>
                {props.character.special_abilities ? props.character.special_abilities.map(function(ability) {
                    return (<li key={ability.name}>
                        <b>{ability.name}</b>: {ability.description}
                    </li>)
                }) : null}
            </ul>
        </div>
    );
}

export default Card;
import React, { useState } from 'react';

function CardPanel(props) {
    return (
        <div>
            <h1>{props.character.name}</h1>
            <div>
                ❤️
                <input type="number" defaultValue={props.character.health} onChange={(e) => {props.setHealth(e.target.value)}} />
            </div>
            <div>
                ❤️️
                <input type="number" defaultValue={props.character.attack} onChange={(e) => {props.setAttack(e.target.value)}} />
            </div>
            
        </div>
    );
}

export default CardPanel;
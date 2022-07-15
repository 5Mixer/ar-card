import React, { useState } from 'react';

function Card(props) {
    return (
        <div className={`cursor-pointer w-64 h-96 p-8 m-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg drop-shadow ring-8 ring-sky-500 ${props.selected ? 'ring-2' : 'ring-0'}`} onClick={props.onClick}>
            <h2 className='text-neutral-900 dark:text-white font-bold text-2xl break-words mb-4 min-h-[2rem]'>{props.character.name}</h2>
            {/* <span className="mr-4">❤️ {props.character.health}</span> */}
            {/* <span className="mr-4">🗡️ {props.character.attack}</span> */}
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
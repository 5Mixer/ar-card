import React from 'react';

function Card(props) {
    return (
        <div className={`cursor-pointer w-64 h-96 p-8 m-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg drop-shadow flex items-center justify-center`} onClick={props.onClick}>
            <svg width="70" height="70" viewBox="0 0 24 24">
                <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" fill="#999" />
            </svg>
        </div>
    );
}

export default Card;
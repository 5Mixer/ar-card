import React, { useEffect, useState } from 'react';
import ModelViewer from '../ModelViewer/ModelViewer';
import FileUploader from '../FileUploader';
import './cardPanel.css'

function CardPanel(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [model, setModel] = useState(null);

    const onModelFileSelect = (file) => {      
		const formData = new FormData();
		formData.set('model', file);
        formData.set('name', props.character.name)

        const request = new XMLHttpRequest();
        request.open("PUT", `/api/cards/${props.character.id}`);
        request.send(formData);
        request.addEventListener('load', () => {
            file.arrayBuffer().then((data) => {
                // setModel(data)
                props.setModel(data)
            })
        });
    }
    useEffect(() => {
        setModel(props.character.model.data)
    }, [props.character.model])

    return (
        <div>
            <h1 class="cardName">{props.character.name}</h1>
            <input type="text" value={props.character.name} maxLength="50" onChange={(e)=>{props.setName(e.target.value)}}></input>
            <div>
                ❤️
                <input type="number" value={props.character.health} onChange={(e) => {props.setHealth(e.target.value)}} />
            </div>
            <div>
                🗡️
                <input type="number" value={props.character.attack} onChange={(e) => {props.setAttack(e.target.value)}} />
            </div>

            <div>
                <button>View Model in AR</button>

                <FileUploader onFileSelect={onModelFileSelect} />
            </div>

            <ModelViewer model={model}></ModelViewer>
        </div>
    );
}

export default CardPanel;
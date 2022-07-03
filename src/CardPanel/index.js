import React, { useState } from 'react';
import ModelViewer from '../ModelViewer/ModelViewer';
import FileUploader from '../FileUploader';
import './cardPanel.css'

function CardPanel(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [model, setModel] = useState(null);

    const onModelFileSelect = (file) => {
        setModel(file)

		const formData = new FormData();

		formData.append('File', file);
		fetch(
			'/api/card',
			{
				method: 'POST',
				body: formData,
			}
		)
        .then((response) => response.json())
        .then((result) => {
            console.log('Success:', result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

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
                <button>View Model in AR</button>

                <FileUploader onFileSelect={onModelFileSelect} />
            </div>

            <ModelViewer model={model}></ModelViewer>
        </div>
    );
}

export default CardPanel;
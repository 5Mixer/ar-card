import React, { useEffect, useState } from 'react';
import ModelViewer from '../ModelViewer/ModelViewer';
import FileUploader from '../FileUploader';
import patternProcessor from './patternProcessor'
import './cardPanel.css'

function CardPanel(props) {
    const [selectedModelFile, setSelectedModelFile] = useState(null);
    const [selectedMarkerFile, setSelectedMarkerFile] = useState(null);
    const [model, setModel] = useState(null);

    const [generatedMarker, setGeneratedMarker] = useState(null);
    const [patternImage, setPatternImage] = useState(null);

    const saveCard = () => {      
		const formData = new FormData();
		formData.set('model', selectedModelFile);
        formData.set('name', props.character.name)

        const request = new XMLHttpRequest();
        request.open("PUT", `/api/cards/${props.character.id}`);
        request.send(formData);
        request.addEventListener('load', () => {
            selectedModelFile.arrayBuffer().then((data) => {
                setModel(data)
                props.setModel(data)
            })
        });
    }
    useEffect(() => {
        if (props.character.model)
            setModel(props.character.model.data)
    }, [props.character.model])

    const onSelectMarker = (markerFile) => {
        setSelectedMarkerFile(URL.createObjectURL(markerFile));
        patternProcessor(URL.createObjectURL(markerFile)).then((result) => {
            setGeneratedMarker(result.marker);
            setPatternImage(result.patternImage);
        });
    }

    return (
        <div>
            {/* <h1 className="cardName">{props.character.name}</h1> */}
            <input className="cardName" type="text" value={props.character.name || ""} maxLength="50" onChange={(e)=>{props.setName(e.target.value)}}></input>
            <div>
                ❤️
                <input type="number" value={props.character.health} onChange={(e) => {props.setHealth(e.target.value)}} />
            </div>
            <div>
                🗡️
                <input type="number" value={props.character.attack} onChange={(e) => {props.setAttack(e.target.value)}} />
            </div>

            <div>
                <h3>Upload GLTF Model</h3>
                <FileUploader onFileSelect={setSelectedModelFile} />

                <h3>Upload Card Image/Marker</h3>
                <FileUploader onFileSelect={onSelectMarker} />
                {selectedMarkerFile ? (<div className="imageGrid">
                    <table>
                        <thead>
                            <tr>
                                <td>Uploaded Marker</td>
                                <td>AR Pattern detected</td>
                                <td>Processed Marker to copy</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <img src={selectedMarkerFile} alt="Uploaded Marker" width="200px"></img>
                                </td>
                                <td>
                                    <img src={patternImage} alt="AR Pattern" width="200px" className="pixelated"></img>
                                </td>
                                <td>
                                    <img src={generatedMarker} alt="Processed Marker" width="200px"></img>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>) : null }

                <button onClick={(e) => {saveCard()}}>Save Changes</button>
            </div>


            <ModelViewer model={model}></ModelViewer>
        </div>
    );
}

export default CardPanel;
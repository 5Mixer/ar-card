import React, { useEffect, useState } from 'react';
import ModelViewer from '../ModelViewer/ModelViewer';
import FileUploader from '../FileUploader';
import patternProcessor from './patternProcessor'

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
        <div className="dark:bg-neutral-800 p-8 bg-neutral-200 flex-auto h-full">
            <input className="shadow-inner p-4 font-bold w-full text-xl rounded dark:bg-neutral-700 dark:text-neutral-50 border-neutral-300 dark:border-neutral-600 border" type="text" value={props.character.name || ""} maxLength="50" onChange={(e)=>{props.setName(e.target.value)}}></input>
            <div className="mt-8 flex">
                <span className="m-auto px-2">❤️</span>
                <input className="shadow-inner flex-grow p-4 ml-4 rounded dark:bg-neutral-700 dark:text-neutral-50 border-neutral-300 dark:border-neutral-600 border" type="number" value={props.character.health} onChange={(e) => {props.setHealth(e.target.value)}} />
            </div>
            <div className="mt-8 flex">
                <span className="m-auto px-2">🗡️</span>
                <input className="shadow-inner flex-grow p-4 ml-4 rounded dark:bg-neutral-700 dark:text-neutral-50 border-neutral-300 dark:border-neutral-600 border" type="number" value={props.character.attack} onChange={(e) => {props.setAttack(e.target.value)}} />
            </div>

            <div className="mt-8">
                <h3 className="mt-8 mb-2 text-xl dark:text-neutral-200">Upload GLTF Model</h3>
                <span className='dark:text-neutral-300 mb-4'>This is the 3D model of your character.</span>
                <FileUploader onFileSelect={setSelectedModelFile} />

                <h3 className="mt-8 mb-2 text-xl dark:text-neutral-200 ">Upload Card Image/Marker</h3>
                <span className='dark:text-neutral-300 mb-8'>This is 2D character image forming the marker on the card.</span>
                <FileUploader onFileSelect={onSelectMarker} />
                {selectedMarkerFile ? (<div className="imageGrid">
                    <div className="w-full grid grid-cols-3 gap-x-4 mt-8">
                        <span className="dark:text-neutral-300">Uploaded Marker</span>
                        <span className="dark:text-neutral-300">AR Pattern detected</span>
                        <span className="dark:text-neutral-300">Processed Marker to copy</span>
            
                        <img src={selectedMarkerFile} alt="Uploaded Marker" width="200px" className="rounded"></img>
                        <img src={patternImage} alt="AR Pattern" width="200px" className="rounded [image-rendering:pixelated]"></img>
                        <img src={generatedMarker} alt="Processed Marker" width="200px" className="rounded"></img>
                    </div>
                </div>) : null }

                <button className="shadow-inner p-4 my-8 float-right rounded bg-white hover:dark:bg-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 border-neutral-300 dark:border-neutral-600 border" onClick={(e) => {saveCard()}}>Save Changes</button>
            </div>


            <ModelViewer model={model}></ModelViewer>
        </div>
    );
}

export default CardPanel;
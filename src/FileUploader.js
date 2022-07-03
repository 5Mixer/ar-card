import React, { useRef } from 'react';

function FileUploader(props) {
    const handleFileInput = (e) => {
        props.onFileSelect(e.target.files[0]);
    };

    return (
        <div className="file-uploader">
            <input type="file" onChange={handleFileInput} accept="model/gltf+json" />
        </div>
    )
}

export default FileUploader;
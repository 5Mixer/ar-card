import React, { useRef } from 'react';

function FileUploader(props) {
    const fileInput = useRef(null);
    
    const handleFileInput = (e) => {
        props.onFileSelect(e.target.files[0]);
    }
    
    return (
        <div className="file-uploader">
            <input type="file" onChange={handleFileInput} accept="model/gltf+json" />
            {/* <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary">select</button> */}
        </div>
    )
}

export default FileUploader;
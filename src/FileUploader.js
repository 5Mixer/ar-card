import React, { useRef } from 'react';

function FileUploader(props) {
    const handleFileInput = (e) => {
        props.onFileSelect(e.target.files[0]);
    };

    return (
        <div className="file-uploader">
            <input
                id="file_input"
                className="block p-4 w-full text-sm text-neutral-900 bg-neutral-50 rounded border border-gray-300 cursor-pointer dark:text-neutral-300 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600"
                type="file"
                onChange={handleFileInput}
                accept="model/gltf+json"
            />
        </div>
    )
}

export default FileUploader;
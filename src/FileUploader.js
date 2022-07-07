import React, { useRef } from 'react';

function FileUploader(props) {
    const handleFileInput = (e) => {
        props.onFileSelect(e.target.files[0]);
    };

    return (
        <div className="py-2">
            <input
                id="file_input"
                className="
                    block
                    file:shadow-inner file:rounded file:mr-4 file:px-4 file:py-2 file:bg-white dark:file:bg-neutral-700 file:border-0 file:text-neutral-900 dark:file:text-neutral-200
                    py-2 w-full text-sm text-neutral-900 rounded cursor-pointer dark:text-neutral-300 focus:outline-none  dark:border-neutral-600
                "
                type="file"
                onChange={handleFileInput}
                accept="model/gltf+json"
            />
        </div>
    )
}

export default FileUploader;
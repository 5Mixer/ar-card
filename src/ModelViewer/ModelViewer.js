import React, { useRef, useEffect } from 'react';
import viewer from './viewer'
import './modelViewer.css'

function ModelViewer(props) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const context = canvasRef.current
        const view = viewer(context)
        if (props.model) {
            view.setModelFromBlob(props.model)
        }

        return () => {
            view.dispose()
        }
    }, [props.model]);

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

export default ModelViewer;
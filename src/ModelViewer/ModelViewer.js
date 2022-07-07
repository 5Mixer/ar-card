import React, { useRef, useEffect } from 'react';
import viewer from './viewer'

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
        <canvas className="flex min-w-full rounded margin-auto" ref={canvasRef}></canvas>
    );
}

export default ModelViewer;
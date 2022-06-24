import React, { useState, useRef, useEffect } from 'react';
import viewer from './viewer'

function ModelViewer(props) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const context = canvasRef.current
        const view = viewer(context)
        if (props.model) {
            view.setModel(props.model)
        }
    });

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

export default ModelViewer;
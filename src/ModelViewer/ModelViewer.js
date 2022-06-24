import React, { useState, useRef, useEffect } from 'react';
import viewer from './viewer'

function ModelViewer(props) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const context = canvasRef.current
        viewer(context)
    });

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

export default ModelViewer;
import React, { useState, useRef, useEffect } from 'react';
import useWindowSize from './WindowSize';

// check an error that Canvas rerenders (and the picture is gone)
// the first time RefreshButton is clicked.
// another bug - when resizing, the painting is gone
// to fix this would require keeping persistent state
// or maybe saving in local storage like here?
// https://blog.koenvangilst.nl/react-hooks-with-canvas/

export default function Canvas (props) {

  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef();
  // Normally in React you don’t need a ref to update something,
  // but the canvas is not like other DOM elements. Most DOM elements
  // have a property like value that you can update directly.
  // The canvas works with a context (ctx in our app) that allows you
  // to draw things. For that we have to use a ref, which is a reference
  // to the actual canvas DOM element.
  //

  const ctx = useRef();
  useEffect(() => {
    ctx.current = canvasRef.current.getContext('2d')
  }, []);

  const [width, height] = useWindowSize();

  function handleMouseMove(e) {
    // actual coordinates
    const coords = [
      e.clientX - canvasRef.current.offsetLeft,
      e.clientY - canvasRef.current.offsetTop
    ]
    if (drawing) {
      ctx.current.lineTo(...coords)
      ctx.current.stroke()
    }
    if (props.handleMouseMove) {
        props.handleMouseMove(...coords)
    }
  }

  function startDrawing(e) {
    ctx.current.lineJoin = 'round'
    ctx.current.lineCap = 'round'
    ctx.current.lineWidth = 10
    ctx.current.strokeStyle = props.color
    ctx.current.beginPath();
    // actual coordinates
    ctx.current.moveTo(
      e.clientX - canvasRef.current.offsetLeft,
      e.clientY - canvasRef.current.offsetTop
    )
    setDrawing(true);
  }

  function stopDrawing() {
    ctx.current.closePath()
    setDrawing(false)
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onMouseMove={handleMouseMove}
    />
  )
}

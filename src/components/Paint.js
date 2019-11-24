import React, { useState, useEffect, useRef, useCallback } from 'react';
import Name from './Name';
import randomColor from 'randomcolor';
import ColorPicker from './ColorPicker';
import RefreshButton from './RefreshButton';
import Canvas from './Canvas';
import useWindowSize from './WindowSize';

function Paint() {
  // to optimize the app we can use useCallback with
  // React.memo -> see RefreshButton component

  // set the initial state
  const [colors, setColors] = useState([]);
  const [activeColor, setActiveColor] = useState(null);

  const getColors = () => {
    // using function from 'randomcolor'  library to get the first color
    const baseColor = randomColor().slice(1);

    // get array of colors based on baseColor from api
    fetch(`https://www.thecolorapi.com/scheme?hex=${baseColor}&mode=monochrome`)
    .then(res => res.json())
    .then(res => {
      setColors(res.colors.map(color => color.hex.value))
      setActiveColor(res.colors[0].hex.value)
    })
  }
  // this useEffect runs only once - at the first render
  // because the array of dependencies is empty
  // so when the Paint component renders, we call getColors
  // it is similar to ComponentDidMount()
  useEffect(getColors, []);

  // set the initial state whether or not the windows size is visible
  const [visible, setVisible] = useState(false);

  // calling the custom hook to get the window size
  // we can pass a function to this hook
  // which can handle the visibility
  // we also use useRef hook to keep the timeoutID because
  // it stays the same between renders
  let timeoutId = useRef();
  const [windowWidth, windowHeight] = useWindowSize(() => {
    setVisible(true);
    clearTimeout(timeoutId.current);
    // after resize - for 0.5sec set the window size to visible
    timeoutId.current = setTimeout(() => setVisible(false), 500);
  });

  // here we define a callback that is passed to the RefreshButton
  const cb = useCallback(getColors, []);

  // here we define a ref to store the value - height of the header
  // which is later used to compute the real height of the Canvas
  // substracting the header height
  const headerRef = useRef( {offsetHeight: 0} );
// console.log('render Paint');
  return (
    <div className='app'>
      <header ref={headerRef} style={{ borderTop: `10px solid ${activeColor}` }} >
        <div className='app'>
          <Name />
        </div>
        <div style={{ marginTop: 10}}>
          <ColorPicker
            colors={colors}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />
          <RefreshButton cb={cb} />

        </div>
      </header>
      {activeColor && (
        <Canvas
          color={activeColor}
          width={windowWidth}
          height={window.innerHeight - headerRef.current.offsetHeight}
        />
      )}
      <div className={`window-size ${visible ? '' : 'hidden'}`}>
        {windowWidth} x {windowHeight}
      </div>
    </div>

  )
}

export default Paint;
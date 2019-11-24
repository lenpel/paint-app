import { useState, useEffect } from 'react';

// component WindowSize refactored into a hook useWindowSize
// we simplify just to handle the size and extract the visibility logic out
// also we don't want to return a <div> but just a data - [width, height]

export default function useWindowSize(cb) {
  // this is array destructing - useState returns an array and a setter function
  const [[windowWidth, windowHeight], setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => {
      // when the user resizes the window, save in state new
      // window width and height
      setWindowSize([window.innerWidth, window.innerHeight]);

      // also we are calling the callback function cb passed from
      // the parent component. Everytime the useEffect runs - when
      // the user resizes the window, we call the cb function
      // in this case it is the visibility handler
      cb();
    }
    window.addEventListener('resize', handleResize);
    // useEffect can return a function for 'clean up'
    return () => window.removeEventListener('resize', handleResize);
  }, [cb])

  // for our custom hook just return windowWidth and windowHeight
  return [windowWidth, windowHeight]
}


import React from 'react';

// this is a component turned into a memo which optimizes the app
// because we don't need to rerender the RefreshButton when the input
// hasn't changed. In this case the cb stays the same so the component
// doesn't rerender
export default React.memo(({ cb }) => {
  return (
    <button className='button-refresh-colors' onClick={cb}>
      &#8634;
    </button>
  )
})


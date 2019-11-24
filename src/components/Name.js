import React, { useState } from 'react';

// again this component is turned into a memo which means
// if the own state doesn't change the component doesn't
// have to rerender
export default React.memo(() => {
  const [name, setName] = useState('');
  return (
    <label className = 'header-name'>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onClick={e => e.target.setSelectionRange(0, e.target.value.length)}
        placeholder='Untitled'
      />
    </label>
  )
})
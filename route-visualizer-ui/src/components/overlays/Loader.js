import React from 'react'

export default function Loader(props) {
  return (
    <div className='overlay overlay--loader'>
      <div className='loader--wrapper'>
        <div className='loader'></div>
        <div className='loader--text'>{props.loadingMessage}</div>
      </div>
      
    </div>
  )
}

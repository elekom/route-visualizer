import React from 'react'

export default function Button(props) {
  return (
    <div className={props.className}>
      <button className='btn btn--primary btn--round' onClick={props.onClick} title={props.title}>
        {props.children}
      </button>
    </div>
  )
}

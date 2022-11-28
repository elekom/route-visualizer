import React, { useState } from 'react'

export default function AddTag() {

  const [tagName, setTagName] = useState();

  const addTag = (tagName) => {
    console.log(tagName);
  }

  return (
    <div className='form'>
      <div className="form__group">
        <input type="text" className="form__input" placeholder="Tag Name" id="tagName" onChange={(v) => setTagName(v.target.value)} required />
        <label htmlFor="tagName" className="form__label">Tag Name</label>
      </div>

      <button className='btn-text' onClick={() => addTag(tagName)}>
        Add Tag
      </button>
    </div>
  )
}

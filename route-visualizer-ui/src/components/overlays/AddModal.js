import { find } from 'lodash';
import React, { useState } from 'react'
import Button from '../Button'
import AddTag from '../forms/AddTag';
import Tags from '../Tags'

export default function AddModal(props) {

  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <div className='overlay'>
      <div>
        lat: {props.selectedLocation.latLng.lat()}
      </div>
      <div>
        lang: {props.selectedLocation.latLng.lng()}
      </div>
      {props.selectedLocation.placeId !== undefined && <div>
        placeId: {props.selectedLocation.placeId}
      </div>}
      <Tags selectedTags={selectedTags} setSelectedTags={setSelectedTags} handleRemove={() => {}}></Tags>
      <AddTag></AddTag>
      <div className='u-top-margin-small'>
        <button className='btn btn--primary'>Add Location</button>
      </div>
      <Button className='u-bottom-left-position' onClick={props.onClick} title='Close'>x</Button>
    </div>
  )
}

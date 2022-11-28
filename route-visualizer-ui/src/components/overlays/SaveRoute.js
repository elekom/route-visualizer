import React, { useState } from 'react'
import { saveRoute } from '../../services/routesService';
import Button from '../Button';

export default function SaveRoute(props) {

  const [routeTitle, setRouteTitle] = useState(props.routeData?.routeTitle);

  const submitRequest = (req) => {
    console.log(req);
    saveRoute(req);
  }

  return (
    <div className='overlay'>
      <div className='form'>
        <div className="form__group">
          <input type="text" className="form__input" placeholder={routeTitle} id="routeTitle" onChange={(v) => setRouteTitle(v.target.value)} required />
          <label htmlFor="routeTitle" className="form__label">Route Title</label>
        </div>

        <button className='btn-text' onClick={()=> submitRequest({
          routeTitle: routeTitle, 
          routeSegments: props.routeData.routeSegments,
          routeUrl: props.routeData?.routeUrl
        })}>
          Save Route
        </button>
      </div>
      <Button className='u-bottom-left-position' onClick={props.onClick} title='Close'>x</Button>
    </div>
  )
}

import React, { useState } from 'react'
import Button from '../Button'
import EnterRoute from '../forms/EnterRoute'
import SavedRoutes from './SavedRoutes';
import { useAuth } from '../../shared/contexts/AuthContext';

export default function RouteMapper(props) {
  const [showSavedRoutes, setShowSavedRoutes] = useState();
  const auth = useAuth();

  return (
    <div className='overlay'>
      <Button className='u-top-right-position' onClick={props.onClick} title='Close'>x</Button>
      <EnterRoute populateRouteData={props.populateRouteData}></EnterRoute>
      {
        auth.isLoggedIn &&
        <div className='u-bottom-margin-extrasmall'><a className='form__label--small'
          onClick={() => setShowSavedRoutes(!showSavedRoutes)}>Saved Routes</a></div> 
      }
      {
        showSavedRoutes &&
        <SavedRoutes
          savedRoutes={props.savedRoutes}
          displayRoute={props.displayRoute}
          onClick={() => {
            props.onClick();
            setShowSavedRoutes(!showSavedRoutes)
          }} 
        />
      }
    </div>
  )
}

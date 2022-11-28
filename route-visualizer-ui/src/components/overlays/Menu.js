import React, { useState } from 'react'
import Button from '../Button'
import Login from '../forms/Login';
import { useAuth } from '../../shared/contexts/AuthContext';
import SavedRoutes from './SavedRoutes';

export default function Menu(props) {
  const auth = useAuth();

  const [showLoginForm, setShowLoginForm] = useState();
  const [showAbout, setShowAbout] = useState();
  const [showSavedRoutes, setShowSavedRoutes] = useState();

  return (
    <div className='overlay'>
      <div className='menu'>
        <button className='btn-text menu__item' onClick={() => setShowAbout(!showAbout)}>
          <h2 className='filter__heading'>
            About
          </h2>
        </button>
        {
          showAbout && <div className='u-top-margin-small'>
            This app was created by <a href='https://github.com/elekom'>@elekom</a>
          </div>
        }
        {
          auth.isLoggedIn &&
            <button className='btn-text menu__item' onClick={() => setShowSavedRoutes(!showSavedRoutes)}>
              <h2 className='filter__heading'>
                Saved Routes
              </h2>
            </button>
        }
        {
          !auth.isLoggedIn ?
            <button className='btn-text menu__item' onClick={() => setShowLoginForm(!showLoginForm)}>
              <h2 className='filter__heading'>
                Login
              </h2>
            </button>
            :
            <button className='btn-text menu__item' onClick={() => auth.signout()}>
              <h2 className='filter__heading'>
                Logout
              </h2>
            </button>
        }
        <Button className='u-top-right-position' onClick={props.onClick} title='Close'>x</Button>
        {
          showLoginForm && <Login setShowLoginForm={setShowLoginForm}></Login>
        }
        {
          showSavedRoutes &&
          <SavedRoutes
            savedRoutes={props.savedRoutes}
            displayRoute={props.displayRoute}
            onClick={() => {
              props.onClick();
              setShowSavedRoutes(!showSavedRoutes);
            }}
          />
        }
      </div>
    </div>
  )
}

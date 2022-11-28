import React from 'react'
import Button from '../Button';

export default function SavedRoutes(props) {

  const savedRoutes = props.savedRoutes;

  const handleClick = (route) => {
    props.displayRoute(route);
    props.onClick();
  }

  return (
    <div className='overlay u-top-margin-medium'>
      <Button className='u-top-right-position' onClick={props.onClick} title='Close'>x</Button>

      <ul>
        {
          savedRoutes &&
          savedRoutes.map((route) =>
            <li className='list-item' key={route.routeUrl}>
              <button className='btn btn--pill' onClick={() => { handleClick(route) }}>Display {route.id}</button>
              <a className='row-item' href={route.routeUrl}>&#40;JORUDAN link	&#41;</a>
            </li>)
        }
      </ul>
    </div>
  )
}

import React, { useState } from 'react'

export default function EnterRoute(props) {
  const [routeUrl, setRouteUrl] = useState('https://www.jorudan.co.jp/norikae/cgi/nori.cgi?eki1=%E9%AB%98%E5%86%86%E5%AF%BA&eki2=%E9%87%91%E6%B2%A2&eki3=&via_on=1&Dyy=2022&Dmm=8&Ddd=2&Dhh=14&Dmn1=5&Dmn2=2&Cway=2&Cfp=1&Czu=2&C7=1&C2=0&C3=0&C1=0&sort=rec&C4=5&C5=0&C6=2&S=%E6%A4%9C%E7%B4%A2&Cmap1=&rf=nr&pg=1&eok1=R-&eok2=R-&eok3=&Csg=1');
  const [routeIndex, setRouteIndex] = useState(0);
  const [includeStationsBetween, setIncludeStationsBetween] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState();

  return (
    <div className='form--route'>
      <h2>Route Visualizer Instructions</h2>
      <ul>
        <li>
          Look up 青春１８きっぷ route on <a target='blank' href='https://www.jorudan.co.jp/norikae/seishun18.html'>JORUDAN</a>
        </li>
        <li>
          Paste link into input below and hit 'Fetch Route Data'
        </li>
        <li>
          This app will then plot the route onto a map and display the results
        </li>
        <br />
        To see an example (高円寺駅 to 金沢駅) hit 'Fetch Route Data' without entering anything
        {/* <br />
        <br />
        * Only the first route result in the link will be displayed
        <br />
        * In some cases there is more than one station with the same name so the wrong one is marked on the map */}
      </ul>
      <div className='form'>
        <div className="form__group">
          <input type="text" className="form__input" placeholder={routeUrl} id="routeUrl" onChange={(v) => setRouteUrl(v.target.value)} required />
          <label htmlFor="routeUrl" className="form__label">Route URL</label>
        </div>

        <div className='u-bottom-margin-extrasmall'><a className='form__label--small'
          onClick={() => setShowAdvanced(!showAdvanced)}>Advanced Settings</a></div>
        { showAdvanced &&
          <div className="form__group">
            <input type="number" className="form__input form__input--small" placeholder='Route Index (0)' id="routeIndex" min='0'
              onChange={(v) => setRouteIndex(v.target.value)} required />
            <label htmlFor="routeIndex" className="form__label">Route Index</label>

            <div className='form__checkbox'>
              <input type="checkbox" className="form__input form__input--small" checked={includeStationsBetween} id="stationsBetween"
                onChange={() => setIncludeStationsBetween(!includeStationsBetween)} required />
              <label htmlFor="stationsBetween" className="form__label">Show Stations Inbetween</label>
            </div>
          </div>
          
        }

        <button className='btn-text' onClick={() => props.populateRouteData({
          routeUrl: routeUrl,
          index: routeIndex,
          includeStationsBetween: includeStationsBetween
        })}>
          Fetch Route Data
        </button>
      </div>
    </div>
  )
}

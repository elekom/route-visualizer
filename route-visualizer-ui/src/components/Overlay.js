import React, { useEffect, useState } from 'react'
import { getTagLocations } from '../services/filtersService';
import { getSavedRoutes } from '../services/routesService';
import { useAuth } from '../shared/contexts/AuthContext';
import Button from './Button';
import AddModal from './overlays/AddModal';
import Filter from './overlays/Filter';
import Menu from './overlays/Menu';
import RouteMapper from './overlays/RouteMapper';
import SaveRoute from './overlays/SaveRoute';

export default function Overlay(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showRouteMapper, setShowRouteMapper] = useState(false);
  const [showSaveRouteModal, setShowSaveRouteModal] = useState(false);

  const [savedRoutes, setSavedRoutes] = useState();

  const auth = useAuth();

  function toggleShowMenu() {
    closeOtherPopups();
    setShowMenu(!showMenu);
  }

  function toggleShowAddModal() {
    closeOtherPopups();
    setShowAddModal(!showAddModal);
  }

  function toggleShowFilter() {
    closeOtherPopups();
    setShowFilter(!showFilter);
  }

  function toggleShowRouteMapper() {
    closeOtherPopups();
    setShowRouteMapper(!showRouteMapper);
  }

  function closeOtherPopups() {
    setShowMenu(false);
    setShowAddModal(false);
    setShowFilter(false);
  }

  useEffect(() => {
    if (!savedRoutes && auth.isLoggedIn) {
      console.log('fetching saved routes for user')
      const fetchSavedRoutes = async () => {
        const routes = await getSavedRoutes();
        setSavedRoutes(routes);
        console.log('savedRoutes', routes);
      }
      fetchSavedRoutes();
    }
  }, [auth.isLoggedIn]);

  return (
    <div>
      <Button className='u-top-right-position' onClick={toggleShowMenu} title='Menu'>
        <div className='navigation__icon'></div>
      </Button>
      <Button className='u-top-right-position-2' onClick={toggleShowRouteMapper} title='Route Visualizer'>
        <i className='icon-basic-map'></i>
      </Button>
      {/* {
        auth.isLoggedIn && props.selectedLocation !== undefined &&
        <Button className='u-bottom-left-position' onClick={toggleShowAddModal} title='Add Location'>+</Button>
      } */}
      {
        auth.isLoggedIn && props.routeData !== undefined &&
        <Button className='u-bottom-left-position' onClick={() => setShowSaveRouteModal(!showSaveRouteModal)} title='Save Route'>+</Button>
      }
      {
        auth.isLoggedIn &&
        <Button className='u-bottom-right-position' onClick={toggleShowFilter} title='Filter Locations'>
          <i className='icon-basic-mixer2'></i>
        </Button>
      }
      {showMenu &&
        <Menu
          onClick={toggleShowMenu}
                    savedRoutes={savedRoutes}
          displayRoute={props.displayRoute}
        />}
      {/* {
        showAddModal &&
        <AddModal 
          onClick={toggleShowAddModal}
          selectedLocation={props.selectedLocation}
          selectedFilters={props.selectedFilters}
          setSelectedFilters={props.setSelectedFilters}
        />
      } */}
      {
        showSaveRouteModal &&
        <SaveRoute
          onClick={() => setShowSaveRouteModal(!showSaveRouteModal)}
          routeData={props.routeData}
        />
      }
      {showFilter && auth.isLoggedIn &&
        <Filter
          onClick={toggleShowFilter}
          selectedFilters={props.selectedFilters}
          setSelectedFilters={props.setSelectedFilters}
          removeMarkers={props.removeMarkers}
        />}
      {showRouteMapper &&
        <RouteMapper
          onClick={toggleShowRouteMapper}
          populateRouteData={props.populateRouteData}
          savedRoutes={savedRoutes}
          displayRoute={props.displayRoute}
        />
      }
    </div>
  );
}

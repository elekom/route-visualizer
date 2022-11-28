import { find, filter } from 'lodash';
import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getTags } from '../../services/filtersService';
import Button from '../Button';
import Tags from '../Tags';

export default function Filter(props) {
  const [expandTags, setExpandTags] = useState(false);
  const [expandDateRange, setExpandDateRange] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [tags, setTags] = useState([]);

  let selectedFilters = props.selectedFilters;
  let setSelectedFilters = props.setSelectedFilters;

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    }
    fetchTags();
  }, []);

  function manageFilter(selectedFilter) {
    if(!isFilterSelected(selectedFilter.name)) {
      setSelectedFilters([...selectedFilters, selectedFilter]);
    } else {
      props.removeMarkers(selectedFilter.tagId);
      setSelectedFilters(filter(selectedFilters, obj => obj.name !== selectedFilter.name));
    }
  }

  function isFilterSelected(filterName) {
    return find(selectedFilters, ['name', filterName]) != null;
  }

  return (
    <div className='overlay'>
      <div className='filter'>
        <div className='filter__section'>
          <button className='btn-text' onClick={() => setExpandTags(!expandTags)}>
            <h2 className='filter__heading'>
              Tags
            </h2>
          </button>
          { 
            expandTags && 
            <Tags
              selectedTags={selectedFilters}
              setSelectedTags={setSelectedFilters}
              handleRemove={props.removeMarkers}
            ></Tags>
            // tags !== undefined &&
            // tags.map((tag) => {
            //   return (
            //     <button
            //       key={tag.name+'-tag'} 
            //       className={'btn btn--pill filter__pill ' + (isFilterSelected(tag.name) ? 'btn--white' : 'btn--primary')}
            //       onClick={() => manageFilter({type: 'tag', name: tag.name, id: tag.id})}
            //     >
            //         {tag.name}
            //     </button>
            //   );
            // })
          }
        </div>
        <div className='filter__section'>
          <button className='btn-text' onClick={() => setExpandDateRange(!expandDateRange)}>
            <h2 className='filter__heading'>
              Date Range
            </h2>
          </button>
          {
            expandDateRange &&
            <div className='filter__date-picker'>
              Start Date: 
              <ReactDatePicker selected={startDate}
                onChange={(date) => 
                  {
                    setStartDate(new Date(date));
                  }
                }/> 
              End Date: 
              <ReactDatePicker selected={endDate} minDate={startDate}
                onChange={(date) => 
                  {
                    setEndDate(new Date(date));
                    manageFilter({type: 'endDate', name: 'end: '+date.toLocaleDateString(), value: date.toLocaleDateString()});
                  }
                }/> 
            </div>
          }
        </div>
      </div>
      <Button className='u-bottom-right-position' onClick={props.onClick} title='Close'>x</Button>
    </div>
  )
}

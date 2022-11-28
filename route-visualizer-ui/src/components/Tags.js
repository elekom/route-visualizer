import { filter, find } from 'lodash';
import React, { useEffect, useState } from 'react'
import { getTags } from '../services/filtersService';

export default function Tags(props) {

  const [tags, setTags] = useState([]);

  let selectedTags = props.selectedTags;
  let setSelectedTags = props.setSelectedTags;

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    }
    fetchTags();
  }, []);

  function manageTags(selectedTag) {
    if(!isTagSelected(selectedTag.name)) {
      setSelectedTags([...selectedTags, selectedTag]);
    } else {
      props.handleRemove(selectedTag.tagId);
      setSelectedTags(filter(selectedTags, obj => obj.name !== selectedTag.name));
    }
  }

  function isTagSelected(tagName) {
    return find(selectedTags, ['name', tagName]) != null;
  }

  return (
    <div>
      {
        tags !== undefined &&
        tags.map((tag) => {
          return (
            <button
              key={tag.name+'-tag'} 
              className={'btn btn--pill filter__pill ' + (isTagSelected(tag.name) ? 'btn--white' : 'btn--primary')}
              onClick={() => manageTags({type: 'tag', name: tag.name, id: tag.id})}
            >
                {tag.name}
            </button>
          );
        })
      }
    </div>
  )
}

import React from 'react';
import { EditableArea } from '@magnolia/react-editor';

const List = (props) => {
  const { items } = props;

  return (
    <>
      <div className='hint'>[LIST]</div>
      <ul className='List'>
        <EditableArea content={items} parentTemplateId={props.metadata['mgnl:template']} />
      </ul>
    </>
  );
};

export default List;

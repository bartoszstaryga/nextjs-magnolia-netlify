import React from 'react';

const Image = (props) => (
  <img
    className='Image'
    src={process.env.NEXT_PUBLIC_MGNL_HOST + '/dam/' + props.image['@id'] + props.image['@path']}
    alt='Etiam Purus'
  />
);

export default Image;

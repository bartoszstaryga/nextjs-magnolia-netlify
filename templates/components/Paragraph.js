import React from 'react';

function Paragraph(props) {
  return <div className='Paragraph' dangerouslySetInnerHTML={{ __html: props.richText }} />;
}

export default Paragraph;

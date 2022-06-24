import React from 'react';
import Link from 'next/link';
import { languages } from '../../utils';

let NODE_NAME;
let BASENAME = '';

// In author build all links should go via preview API e.g. /contact => /api/preview?slug=/contact

function renderLink(item) {
  return (
    <React.Fragment key={item['@id']}>
      <Link href={BASENAME + item['@path'].replace(NODE_NAME, '') || '/'}>
        <a>{item['@name']}</a>
      </Link>
      {item['@nodes'].length > 0 && item['@nodes'].map((nodeName) => renderLink(item[nodeName]))}
      </React.Fragment>
  );
}

function Navigation(props) {
  const { content, nodeName, currentLanguage, basename } = props;

  NODE_NAME = nodeName;
  BASENAME = basename;

  return (
    <nav>
      {renderLink(content, currentLanguage)}
      {languages.map((language, i) => (
        <button onClick={() => (window.location.href = '/' + (i === 0 ? '' : language)) } key={language}>{language}</button>
      ))}
    </nav>
  );
}

export default Navigation;

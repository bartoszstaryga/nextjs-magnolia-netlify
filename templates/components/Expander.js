import React from 'react';
import { EditableArea } from '@magnolia/react-editor';

class Expander extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: true };
    this.toggle = this.toggle.bind(this);
  }

  state = {};

  toggle(event) {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
    event.preventDefault();
  }

  render() {
    const expanderItems = this.props.expanderItems;

    return (
      <div className='expander'>
        <div onClick={this.toggle} className={this.state.isCollapsed ? 'open expanderHeader' : 'closed expanderHeader'}>
          Expander
          <svg className='expanderIcon' focusable='false' viewBox='0 0 24 24' aria-hidden='true' role='presentation'>
            <path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'></path>
          </svg>
        </div>

        {!this.state.isCollapsed && (
          <div>
            <div className='hint'>[EXPANDER OPENED]</div>
            <EditableArea content={expanderItems} parentTemplateId={this.props.metadata['mgnl:template']} />
          </div>
        )}
      </div>
    );
  }
}

export default Expander;

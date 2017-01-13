/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';


class FilterOptions extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    debugger;
  }

  renderChildren(children) {
    return (
      React.Children.map(children, (child) => {
        if(Array.isArray(children)) {
          if(child.type === 'select') {
            console.log(child.props.name);
          }
          if(typeof child !== 'string') {
            if(child.props.type === 'checkbox') {
              console.log(child.props.value);
            }
            this.renderChildren(child.props.children);
          }
          return child;
        } else {
          if(children.props) {
            if(children.props.type === 'checkbox') {
              console.log(children.props.value);
            }
            if(children.props.children) {
              if(child.type === 'select') {
                console.log(child.props.name);
              }
              this.renderChildren(child.props.children);
              return child;
            }
          }
        }
      })
    );
  }

  render() {
    return (
      <section className='action-container'>
        <div className='sv-triangle on-right'/>
        <section className='action-container--content'>
          {this.renderChildren(this.props.children)}
          <footer>
            <button className='sv-button link link-danger sv-pull-left'>
              Clear All
            </button>
            <button className='sv-button link link-info sv-pull-right'>Apply Filter</button>
            <button className='sv-button link link-cancel sv-pull-right'>Cancel</button>
          </footer>
        </section>
      </section>
    );
  }
}

FilterOptions.displayName = 'FilterOptions';

export default FilterOptions;

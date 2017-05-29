/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _assign from 'lodash/assign';

class FilterOptions extends React.Component {

  constructor() {
    super();
    this.state = { 
      optionsAreOpen: false 
    };    
  }

  onClearAll() {    
    this.setState(
      {optionsAreOpen: false}, 
      this.props.clearAllFields()
    );
  }

  onFilter() {             
    this.setState(
      {optionsAreOpen: false}, 
      this.props.doFilterBySearchField()
    );    
  }

  toggleVisibilityOfOptions() {
    this.setState({
      optionsAreOpen: !this.state.optionsAreOpen
    });
  }

  close() {
    this.setState({
      optionsAreOpen: false
    });
  }

  render() {

    let {
      applyFilterButtonLabel,
      cancelButtonLabel,
      clearFilterOptionsButtonLabel,
      filterButtonLabel,
    } = this.props;

    let filterSpanStyle = _assign(
      {display: this.props.hasFilterOptions ? 'block': 'none'},
      {color: this.state.optionsAreOpen ? '#2196f3': '#455a64'}
    );

    return (
      <div>
        <span
          className='label-action at-last'
          onClick={() => this.toggleVisibilityOfOptions()}
          style={filterSpanStyle}>
          {filterButtonLabel}
          <i className='fa fa-sliders fa-fw'/>
        </span>
        <section 
          className='action-container' 
          style={{display: this.state.optionsAreOpen ? 'block': 'none'}}>
          <div className='sv-triangle on-right'/>
          <section className='action-container--content'>
            {this.props.children}
            <footer>
              <input
                className='sv-button link link-danger'
                onClick={() => this.onClearAll()}
                type='button'
                value={clearFilterOptionsButtonLabel}
              />
              <input
                className='sv-button link link-info sv-pull-right'
                onClick={() => this.onFilter()}
                type='button'
                value={applyFilterButtonLabel}
              />
              <input
                className='sv-button link link-cancel sv-pull-right'
                onClick={() => this.close()}
                type='button'
                value={cancelButtonLabel}
              />
            </footer>
          </section>
        </section>
      </div>
    );
  }
}

FilterOptions.propTypes = {
  addSearchValueToFilterValues: PropTypes.func,
  applyFilterButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  clearAllFields: PropTypes.func,
  clearFilterOptionsButtonLabel: PropTypes.string,
  doFilterBySearchField: PropTypes.func.isRequired,
  filterButtonLabel: PropTypes.string,
  hasFilterOptions: PropTypes.bool,  
};

FilterOptions.displayName = 'FilterOptions';
export default FilterOptions;

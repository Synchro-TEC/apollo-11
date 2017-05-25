/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _assign from 'lodash/assign';

class FilterOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false };   
    this.onFilter = this.onFilter.bind(this);
  }

  onClearAll() {
    if(this.props.onClearAll) {
      this.setState({ isOpen: false }, this.props.onClearAll());
    }
  }

  onFilter() {             
    this.setState({ isOpen: false }, this.props.doFilterBySearchField());    
  }

  toggleVisibility() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  close() {
    this.setState({ isOpen: false });
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
      {color: this.state.isOpen ? '#2196f3': '#455a64'}
    );

    return (
      <div>
        <span
          className='label-action at-last'
          onClick={() => this.toggleVisibility()}
          style={filterSpanStyle}>
          {filterButtonLabel}
          <i className='fa fa-sliders fa-fw'/>
        </span>
        <section className='action-container' style={{display: this.state.isOpen ? 'block': 'none'}}>
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
  clearFilterOptionsButtonLabel: PropTypes.string,
  doFilterBySearchField: PropTypes.func.isRequired,
  filterButtonLabel: PropTypes.string,
  hasFilterOptions: PropTypes.bool,
  onClearAll: PropTypes.func,
  onFilter: PropTypes.func,
};

FilterOptions.displayName = 'FilterOptions';
export default FilterOptions;

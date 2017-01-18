/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor(props) {
    super(props);
  }

  _onSearch(values) {
    values.searchValue = document.getElementById('query').value;
    if(this.props.onSearch) {
      this.props.onSearch(values);
    }
  }

  toggleVisibilityOfFilterOptions() {
    this.refs.filterOptions.toggleVisibility();
  }

  render() {

    const { placeholder, children } = this.props;

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input className='on-center' id='query' placeholder={placeholder} type='search'/>
          <FilterOptions hasFilterOptions={!_isUndefined(children)}
                         onSearch={(values) => this._onSearch(values)} ref='filterOptions'>
            {this.props.children}
          </FilterOptions>
        </div>
      </form>
    );
  }
}

Filter.defaultProps = {
  placeholder: 'Type to search!',
  minimalSearchDelimiter: 0
};

Filter.propTypes = {
  placeholder: React.PropTypes.string,
  minimalSearchDelimiter: React.PropTypes.number,
  onSearch: React.PropTypes.func,
  dataToFilter: React.PropTypes.array
};

Filter.displayName = 'Filter';

export default Filter;
import React from 'react';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';
import _assign from 'lodash/assign';

class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.filterOptionValues = {};
  }

  /**
   * Associa um objeto valueOfSearch ao filterOptions
   * @returns {*}
   */
  addSearchValue() {

    let inputElement = document.getElementsByName(this.props.name)[0];
    let nameOfField = inputElement.name;
    let valueOfSearch = {};

    if(!_isEmpty(inputElement.value)) {
      valueOfSearch[nameOfField] = inputElement.value;
    }

    return _assign({}, this.filterOptionValues, valueOfSearch);
  }

  _onSearch(filterOptionValues) {
    this.filterOptionValues = filterOptionValues;
    if(this.props.onSearch) {
      this.props.onSearch(this.addSearchValue());
    }
  }

  _onSearchWhenPressEnter(e) {
    if(this.props.onSearch && e.keyCode === 13) {
      e.preventDefault();
      this.props.onSearch(this.addSearchValue());
    }
  }

  render() {

    const { placeholder, name, children, onClearAll } = this.props;

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input className='on-center'
            id='query'
            name={name}
            onKeyDown={(e) => { this._onSearchWhenPressEnter(e); }}
            placeholder={placeholder}
            type='search'
          />
          <FilterOptions
            hasFilterOptions={!_isUndefined(children)}
            onClearAll={onClearAll}
            onSearch={(filterOptionValues) => this._onSearch(filterOptionValues)}
            ref='filterOptions'>
              {this.props.children}
          </FilterOptions>
        </div>
      </form>
    );
  }
}

Filter.defaultProps = {
  placeholder: 'Type to search!'
};

Filter.propTypes = {
  name: React.PropTypes.string.isRequired,
  onClearAll: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

Filter.displayName = 'Filter';

export default Filter;

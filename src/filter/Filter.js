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

  /**
   * Adiciona o value do campo de busca ao objeto e retorna o objeto modificado
   * @param filterOptionValues
   * @returns {*}
   */
  addSearchValue(filterOptionValues) {
    let inputElement = document.getElementById('query');
    let nameOfField = inputElement.name;
    if(filterOptionValues === null) {
      let value = {};
      value[nameOfField] = inputElement.value;
      return value;
    } else {
      filterOptionValues[nameOfField] = inputElement.value;
      return filterOptionValues
    }
  }

  _onSearch(filterOptionValues) {
    if(this.props.onSearch) {
      this.props.onSearch(this.addSearchValue(filterOptionValues));
    }
  }

  _searchWhenKeyDown(e) {
    if(this.props.onSearch && e.target.keyCode === 13) {
      this.props.onSearch(this.addSearchValue(null));
    }
  }

  toggleVisibilityOfFilterOptions() {
    this.refs.filterOptions.toggleVisibility();
  }

  render() {

    const { placeholder, name, children } = this.props;

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input className='on-center'
                 id='query'
                 name={name}
                 onKeyDown={(e) => this._searchWhenKeyDown(e)}
                 placeholder={placeholder}
                 type='search' />
          <FilterOptions hasFilterOptions={!_isUndefined(children)}
                         onSearch={(filterOptionValues) => this._onSearch(filterOptionValues)} ref='filterOptions'>
            {this.props.children}
          </FilterOptions>
        </div>
      </form>
    );
  }
}

Filter.defaultProps = {
  placeholder: 'Type to search!',
  name: 'searchValue'
};

Filter.propTypes = {
  name: React.PropTypes.string,
  onSearch: React.PropTypes.func,
  placeholder: React.PropTypes.string
};

Filter.displayName = 'Filter';

export default Filter;
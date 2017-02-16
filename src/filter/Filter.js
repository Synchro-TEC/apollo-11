import React from 'react';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor(props) {
    super(props);
  }

  applyFilter(filterOptionValues) {
    //Recupera o valor do campo de busca a partir do nome
    let searchFieldValue = document.getElementsByName(this.props.name)[0].value;
    if(searchFieldValue !== '') {
      filterOptionValues[this.props.name] = searchFieldValue;
    }
    if(this.props.onApplyFilter) {
      this.props.onApplyFilter(filterOptionValues);
    }
  }

  searchByEnter(e) {
    if(this.props.onSearchByEnter && e.keyCode === 13) {
      e.preventDefault();
      this.props.onSearchByEnter(e.target.value);
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
            name={name}
            onKeyDown={(e) => {this.searchByEnter(e);}}
            placeholder={placeholder}
            type='search'
          />
          <FilterOptions
            hasFilterOptions={!_isUndefined(children)}
            onApplyFilter={(filterOptionValues) => this.applyFilter(filterOptionValues)}
            onClearAll={onClearAll}
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
  onApplyFilter: React.PropTypes.func,
  onClearAll: React.PropTypes.func,
  onSearchByEnter: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

Filter.displayName = 'Filter';

export default Filter;

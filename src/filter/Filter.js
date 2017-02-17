import React from 'react';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.doFilterByApplyFilter = this.doFilterByApplyFilter.bind(this);
  }

  /**
   * addSearchValueToFilterValues - description
   * Função executada pelo filho FilterOptions. Recebe o objeto com os valores do
   * filtro e adiciona o valor do campo de busca a este objeto.
   * @param  {type} filterValues description
   * @return {void}
   */
  addSearchValueToFilterValues(filterValues) {
    let searchFieldValue = document.getElementsByName(this.props.name)[0].value;
    if(searchFieldValue !== '') {
      filterValues[this.props.name] = searchFieldValue;
    }
    this.props.onFilter(filterValues);
  }


  /**
   * doFilterBySearchField - description
   * Função executada quando o usuario usa o enter para realizar o filtro.
   * Se o filtro é um filtro com opções, uma função do filho FilterOptions é
   * chamada para recuperar os valores das opções, em seguida é chamada
   * a função doFilterByApplyFilter do pai para acrescentar a este objeto o valor
   * do campo de busca
   * @param  {type} e description
   * @return {void}
   */
  doFilterBySearchField(e) {
    let isFilterWithOptions = this.refs.filterOptions.props.children;
    if(e.keyCode === 13) {
      e.preventDefault();
      if(isFilterWithOptions) {
        this.refs.filterOptions.applyFilter();
      } else {
        this.props.onFilter(e.target.value);
      }
    }
  }

  render() {

    const {
      applyFilterButtonLabel,
      cancelButtonLabel,
      clearAllButtonLabel,
      filterButtonLabel,
      placeholder,
      name,
      children,
      onClearAll,
      onFilter,
    } = this.props;

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input
            className='on-center'
            name={name}
            onKeyDown={(e) => {this.doFilterBySearchField(e);}}
            placeholder={placeholder}
            type='search'
          />
          <FilterOptions
            applyFilterButtonLabel={applyFilterButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            clearAllButtonLabel={clearAllButtonLabel}
            doFilterByApplyFilter={this.doFilterByApplyFilter}
            filterButtonLabel={filterButtonLabel}
            hasFilterOptions={!_isUndefined(children)}
            onClearAll={onClearAll}
            onFilter={onFilter}
            ref='filterOptions'>
            {this.props.children}
          </FilterOptions>
        </div>
      </form>
    );
  }
}

Filter.defaultProps = {
  placeholder: 'Buscar'
};

Filter.propTypes = {
  applyFilterButtonLabel: React.PropTypes.string,
  cancelButtonLabel: React.PropTypes.string,
  clearAllButtonLabel: React.PropTypes.string,
  filterButtonLabel: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onClearAll: React.PropTypes.func,
  onFilter: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

Filter.displayName = 'Filter';

export default Filter;

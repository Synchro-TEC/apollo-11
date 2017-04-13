import React from 'react';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {clearFieldIsVisible: false};
    this.addSearchValueToFilterValues = this.addSearchValueToFilterValues.bind(this);
  }

  /**
   * shouldComponentUpdate - description
   * Componente não deve atualizar caso o estado clearFieldIsVisible
   * seja o mesmo do próximo estado
   * @param  {type} nextProps description
   * @param  {type} nextState description
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.clearFieldIsVisible !== nextState.clearFieldIsVisible;
  }

  toggleClearField(e) {
    this.setState({clearFieldIsVisible: e.target.value !== ''});
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
    if(isFilterWithOptions) {
      this.refs.filterOptions.mountFilterOptionsObject();
    } else {
      this.props.onFilter(e.target.value);
    }
  }

  clearSearchField() {
    document.getElementsByName(this.props.name)[0].value = '';
    let isFilterWithOptions = this.refs.filterOptions.props.children;

    this.setState({clearFieldIsVisible: false}, () => {
      //A função que aplica o filtro é chamada para não perder os possiveis filtros ja feitos
      if(isFilterWithOptions) {
        this.refs.filterOptions.mountFilterOptionsObject();
      } else {
        this.props.onFilter('');
      }
    });
  }

  render() {

    const {
      applyFilterButtonLabel,
      cancelButtonLabel,
      clearFilterOptionsButtonLabel,
      filterButtonLabel,
      placeholder,
      name,
      children,
      onClearAll,
      onFilter,
    } = this.props;

    let clearFieldIcon = '';

    if(this.state.clearFieldIsVisible) {
      clearFieldIcon = (
        <span>
          <i className='fa fa-times'
            onClick={() => this.clearSearchField()}
            style={{'lineHeight': '34px',
              'marginLeft': '-25px',
              'cursor': 'pointer'}}/>
        </span>
      );
    }

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input
            className='on-center'
            name={name}
            onKeyUp={(e) => {this.toggleClearField(e); this.doFilterBySearchField(e);}}
            placeholder={placeholder}
            ref='searchField'
            type='search'/>
            {clearFieldIcon}
          <FilterOptions
            addSearchValueToFilterValues={this.addSearchValueToFilterValues}
            applyFilterButtonLabel={applyFilterButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            clearFilterOptionsButtonLabel={clearFilterOptionsButtonLabel}
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
  applyFilterButtonLabel: 'Aplicar Filtro',
  cancelButtonLabel: 'Cancelar',
  clearFilterOptionsButtonLabel: 'Limpar Filtro',
  filterButtonLabel: 'Opções',
  placeholder: 'Buscar',
};

Filter.propTypes = {
  applyFilterButtonLabel: React.PropTypes.string,
  cancelButtonLabel: React.PropTypes.string,
  clearFilterOptionsButtonLabel: React.PropTypes.string,
  filterButtonLabel: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onClearAll: React.PropTypes.func,
  onFilter: React.PropTypes.func,
  placeholder: React.PropTypes.string,
};

Filter.displayName = 'Filter';

export default Filter;

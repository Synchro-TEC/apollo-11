import React from 'react';
import PropTypes from 'prop-types';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor() {
    super();
    this.state = {
      clearFieldIsVisible: false
    };
    this.doFilterBySearchField = this.doFilterBySearchField.bind(this);
    this.clearAllFields = this.clearAllFields.bind(this);
  }

  toggleClearField() {
    this.setState({
      clearFieldIsVisible: this.refs.search.value !== ''
    });
  }

  doFilterBySearchField() {
    if(this.props.onFilter) {
      this.props.onFilter(this.refs.search.value);
    }
  }

  clearAllFields() {
    if(this.props.onClearAll) {
      this.props.onClearAll(this.refs.search.value);
    }
  }

  clearSearchField() {
    if(this.props.onFilter) {
      this.refs.search.value = '';
      this.setState(
        {clearFieldIsVisible: false},
        this.props.onFilter(this.refs.search.value)
      );
    }
  }

  render() {

    const timesIconStyle = {
      'paddingTop': '10px',
      'marginLeft': '-25px',
      'cursor': 'pointer',
    };

    const {
      applyFilterButtonLabel,
      cancelButtonLabel,
      clearFilterOptionsButtonLabel,
      filterButtonLabel,
      placeholder,
      children
    } = this.props;

    let clearFieldIcon = '';

    if(this.state.clearFieldIsVisible) {
      clearFieldIcon = (
        <span>
          <i className='fa fa-times'
            onClick={() => this.clearSearchField()}
            style={timesIconStyle}/>
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
            onKeyUp={() => {this.toggleClearField(); this.doFilterBySearchField();}}
            placeholder={placeholder}
            ref='search'
            type='search'
          />
          {clearFieldIcon}
          <FilterOptions
            applyFilterButtonLabel={applyFilterButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            clearAllFields={this.clearAllFields}
            clearFilterOptionsButtonLabel={clearFilterOptionsButtonLabel}
            doFilterBySearchField={this.doFilterBySearchField}
            filterButtonLabel={filterButtonLabel}
            hasFilterOptions={!_isUndefined(children)}>
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
  applyFilterButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  clearFilterOptionsButtonLabel: PropTypes.string,
  filterButtonLabel: PropTypes.string,
  onClearAll: PropTypes.func,
  onFilter: PropTypes.func,
  placeholder: PropTypes.string,
};

Filter.displayName = 'Filter';
export default Filter;

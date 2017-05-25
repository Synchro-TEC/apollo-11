import React from 'react';
import PropTypes from 'prop-types';
import FilterOptions from './FilterOptions';
import _isUndefined from 'lodash/isUndefined';

class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {clearFieldIsVisible: false};   
    this.doFilterBySearchField = this.doFilterBySearchField.bind(this);
  }  

  toggleClearField(e) {
    this.setState({ clearFieldIsVisible: e.target.value !== ''});
  }

  doFilterBySearchField() {              
    if(this.props.onFilter) {
      this.props.onFilter(this.refs.searchValue.value);
    }
  }

  clearSearchField() {          
    if(this.props.onFilter) {      
      this.refs.searchValue.value = '';
      this.setState(
        {clearFieldIsVisible: false}, 
        this.props.onFilter(this.refs.searchValue.value)
      );
    }    
  }

  render() { 

    const timesIconStyle = {
      'lineHeight': '34px',
      'marginLeft': '-25px',
      'cursor': 'pointer',
    };

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
            name={name}
            onKeyUp={(e) => {this.toggleClearField(e); this.doFilterBySearchField();}}
            placeholder={placeholder}            
            ref='searchValue'
            type='search'
          />
          {clearFieldIcon}
          <FilterOptions            
            applyFilterButtonLabel={applyFilterButtonLabel}
            cancelButtonLabel={cancelButtonLabel}
            clearFilterOptionsButtonLabel={clearFilterOptionsButtonLabel}  
            doFilterBySearchField={this.doFilterBySearchField}          
            filterButtonLabel={filterButtonLabel}
            hasFilterOptions={!_isUndefined(children)}
            onClearAll={onClearAll} 
            onFilter={onFilter}>
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
  name: PropTypes.string,
  onClearAll: PropTypes.func,
  onFilter: PropTypes.func,
  placeholder: PropTypes.string,
};

Filter.displayName = 'Filter';

export default Filter;

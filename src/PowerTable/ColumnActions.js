import React from 'react';
import update from 'immutability-helper';

class ColumnActions extends React.Component {
  constructor(props){
    super(props);

    this.filterChange = this.filterChange.bind(this);
    this.addToDistinctFilter = this.addToDistinctFilter.bind(this);
    this._hasInFilter = this._hasInFilter.bind(this);
    this._onChangeCondition = this._onChangeCondition.bind(this);

    this.sort = this.sort.bind(this);

    this.conditions = {
      numeric: [
        {label: 'Maior que', value: '$gt'},
        {label: 'Maior igual que', value: '$gte'},
        {label: 'Menor que', value: '$lt'},
        {label: 'Menor igual que', value: '$lte'},
        {label: 'Entre', value: '$bet'},
      ],
      text: [
        {label: 'Contém', value: '$in'},
        {label: 'Não Contém', value: '$nin'},
      ],
      date: [
        {label: 'Maior que', value: '$gt'},
        {label: 'Maior igual que', value: '$gte'},
        {label: 'Menor que', value: '$lt'},
        {label: 'Menor igual que', value: '$lte'},
        {label: 'Entre', value: '$bet'},
      ],
    };


    this.styles = {
      box: {
        position: 'absolute',
        width: '250px',
        top: '34px',
        padding: '0px',
        fontFamily: 'Arial, "sans serif"',
        fontSize: '13px',
        backgroundColor: 'rgba(255, 255, 255, .99)',
        border: '1px solid rgba(0,0,0,.2)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: '99',
        textTransform: 'none',
      },
      h6: {
        fontSize: '13px',
        padding: '5px 0 0 0',
        fontWeight: 'bold',
      },
      hr: {
        margin: '0 0 6px 0',
      },
      filterValues: {
        height: '100px',
        overflow: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #c0ccda',
        borderRadius: '2px',
        color: 'inherit',
        margin: '4px 0 6px 0',
        fontSize: '13px',
        padding: '4px 8px',
        verticalAlign: 'middle',
        boxShadow: 'inset 0 0 3px #e0e6ed',
        width: '100%',
        whiteSpace: 'nowrap',
      },
      containerTop: {
        padding: '7px',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        borderBottom: '1px solid #d7dfe8',
      },
      containerOrder: {
        padding: '4px 7px 0 7px',
        height: '40px',
      },
      container: {
        padding: '0 7px',
        marginBottom: '7px',
      },
      containerBottom: {
        borderTop: '1px solid #d7dfe8',
        backgroundColor: '#f9f9f9',
        padding: '12px 7px',
        textAlign: 'center',
      },
      sortButtons: {
        fontFamily: 'Arial, "sans serif"',
        fontSize: '13px',
        color: '#607d8b',
      }
    };

    this.state = {condition: this.conditions[this.props.dataType][0], filter: {value: {}}};
    this.filterValues = {value: {}};

  }

  shouldComponentUpdate(nextProps) {
    if(nextProps.distinctFilters !== this.props.distinctFilters || nextProps.isVisible !== this.props.distinctFilters) {
      return true;
    } else {
      return false;
    }
  }

  filterChange(e) {
    let queryText = e.target.value.trim();
    this.props.onSearch({dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType});
  }

  sort(direction) {
    if(this.props.dataKey) {
      this.props.onSort(direction, this.props.dataKey);
    }
  }

  filterDistinct(e) {
    let queryText = e.target.value.trim();
    this.props.onFilterDistinct({dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType});
  }

  addToDistinctFilter(value) {
    this.props.onAddToFilterDistinct({dataKey: this.props.dataKey, value: value, dataType: this.props.dataType});
  }

  _setValueInFilter(e){
    // this.setState(update(this.state, {filter: {$set: e.data.itens}}));
    this.filterValues.value[e.target.name] = e.target.value;
    this.setState(update(this.state, {filter: {$set: this.filterValues}}));
  }

  _hasInFilter(value) {

    let hasInFilter = false;
    if(this.props.distinctFilters.hasOwnProperty(this.props.dataKey)) {
      hasInFilter = this.props.distinctFilters[this.props.dataKey].includes(value);
    }
    return hasInFilter;
  }

  _onChangeCondition(condition) {
    this.filterValues = {value: {}};
    this.setState({condition, filter: {value: {}}});
  }

  renderDistinctFilters() {
    let items;
    if(this.props.distinctFilters.hasOwnProperty(this.props.dataKey)) {
      items = this.props.distinctFilters[this.props.dataKey].map((item, i) => {
        return (
          <div className='sv-tag info' key={`item-${item}-${i}`}>
            <span className='sv-tag__close' onClick={() => this.addToDistinctFilter(item)}>×</span>
            <span className='sv-tag__content'>{item}</span>
          </div>
        );
      });
    } else {
      items = '';
    }

    return (<div>{items}</div>);
  }

  renderConditionsByDataType() {
    let options = this.conditions[this.props.dataType].map((opt, i) => {
      return (<option key={`${this.props.dataType}-${opt.value}-${i}`} value={JSON.stringify(opt)}>{opt.label}</option>);
    });

    return (
      <label>
        <span>Condição</span>
        <div className='sv-select'>
          <select onChange={(e) => this._onChangeCondition(JSON.parse(e.target.value))}>
            {options}
          </select>
          <label>
            <i className='fa fa-angle-down fa-fw' />
          </label>
        </div>
      </label>
    );
  }

  renderConditionValue() {

    let valueFild = (
      <input
        name='only'
        onChange={(e) => this._setValueInFilter(e)}
        placeholder='Valor desejado'
        type='text'
        value={this.state.filter.value['only'] || ''}
      />
    );

    if(this.props.dataType === 'numeric' && this.state.condition.value === '$bet') {
      valueFild = (
        <div className='sv-row--with-gutter'>
          <div className='sv-column'>
            <input
              name='start'
              onChange={(e) => this._setValueInFilter(e)}
              placeholder='Valor inicial'
              type='number'
              value={this.state.filter.value['start'] || ''}
            />
          </div>
          <div className='sv-column'>
            <input
              name='end'
              onChange={(e) => this._setValueInFilter(e)}
              placeholder='Valor final'
              type='number'
              value={this.state.filter.value['end'] || ''}
            />
          </div>
        </div>
      );
    }

    return valueFild;
  }

  renderFilter() {

    let uniques = this.props.uniqueValues[this.props.dataKey];
    let uniqueValues = '';

    if(uniques) {
      uniqueValues = uniques.map((uniq, i) => {
        if(!this._hasInFilter(uniq)) {
          return (
            <li key={`${uniq}__${i}`}>
              <label className='sv-no-margins' onClick={() => this.addToDistinctFilter(uniq)}>
                <i className='fa fa-square-o fa-fw'/> {uniq}
              </label>
            </li>
          );
        } else {
          return (
            <li key={`${uniq}__${i}`}>
              <label className='sv-no-margins' onClick={() => this.addToDistinctFilter(uniq)}>
                <i className='fa fa-check-square-o fa-fw'/> {uniq}
              </label>
            </li>
          );
        }
      });
    }

    return (
      <div style={this.styles.container}>
        <h6 style={this.styles.h6}>Filtro por valor</h6>
        <hr style={this.styles.hr} />
        <div>
          <form className='sv-form' onSubmit={(e) => e.preventDefault()}>
            <input onChange={(e) => this.filterDistinct(e)} placeholder='Filtrar por' type='text' />

            <div style={this.styles.filterValues}>
              <ul>
                {uniqueValues}
              </ul>
            </div>
          </form>
          {this.renderDistinctFilters()}
        </div>

        <h6 style={this.styles.h6}>Filtro por condição</h6>
        <hr style={this.styles.hr} />
        <form className='sv-form' onSubmit={(e) => e.preventDefault()}>
          {this.renderConditionsByDataType()}
          {this.renderConditionValue()}
        </form>
      </div>
    );
  }

  renderButtons() {
    return (
      <div style={this.styles.containerBottom}>
        {this.props.searchable ? (
          <button
            className='sv-button primary small sv-horizontal-marged-15'
            onClick={
              ()=> this.props.onApplyFilter(
                this.props.distinctFilters[this.props.dataKey],
                {condition: this.state.condition.value, filter: this.state.filter.value},
                {dataKey: this.props.dataKey, dataType: this.props.dataType}
                )
            }
            type='button'>Aplicar</button>) : null}
        <button
          className='sv-button default small sv-horizontal-marged-15'
          onClick={() => this.props.onClose(this.props.dataKey)}
          type='button'
        >
          Cancelar
        </button>
      </div>
    );
  }

  render() {

    if (this.props.isVisible) {
      this.styles.box.display = 'block';
    } else {
      this.styles.box.display = 'none';
    }

    let sortClasses = {asc: 'fa-sort-alpha-asc fa-fw', desc: 'fa-sort-alpha-desc'};

    if(this.props.dataType !== 'text') {
      sortClasses.asc = 'fa-sort-numeric-asc';
      sortClasses.desc = 'fa-sort-numeric-desc';
    }

    return (
      <div className='pwt-actions' onClick={(e) => e.stopPropagation()} style={{...this.styles.box, ...this.props.style}}>

        <div style={this.styles.containerTop}>
          <h6 style={this.styles.h6}>{this.props.columnTitle}</h6>
        </div>
        <div style={this.styles.containerOrder}>
          <button
            className='sv-button link link-default sv-pull-left'
            onClick={() => this.sort('ASC')}
            style={this.styles.sortButtons}
            type='button'
          >
            Ordenar <i className={`fa fa-fw ${sortClasses.asc}`} />
          </button>
          <button
            className='sv-button link link-default sv-pull-right'
            onClick={() => this.sort('DESC')}
            style={this.styles.sortButtons}
            type='button'
          >
            Ordenar <i className={`fa fa-fw ${sortClasses.desc}`} />
          </button>
        </div>

        {this.props.searchable ? this.renderFilter() : null}
        {this.renderButtons()}

      </div>

    );
  }
}

ColumnActions.displayName = 'ColumnActions';

ColumnActions.defaultProps = {
  uniqueValues: {},
};

ColumnActions.propTypes = {
  columnTitle: React.PropTypes.string,
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.string,
  distinctFilters: React.PropTypes.object,
  isVisible: React.PropTypes.bool,
  onAddToFilterDistinct: React.PropTypes.func,
  onApplyFilter: React.PropTypes.func,
  onClose: React.PropTypes.func,
  onFilterDistinct: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onSort: React.PropTypes.func,
  position: React.PropTypes.object,
  searchable: React.PropTypes.bool,
  style: React.PropTypes.object,
  uniqueValues: React.PropTypes.any,
};

export default ColumnActions;
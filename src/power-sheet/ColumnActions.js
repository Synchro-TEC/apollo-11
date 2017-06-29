import React from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { conditions } from './conditions';

class ColumnActions extends React.Component {
  constructor(props) {
    super(props);

    this.filterChange = this.filterChange.bind(this);
    this.addValueOnFilter = this.addValueOnFilter.bind(this);
    this._hasInFilter = this._hasInFilter.bind(this);
    this._onChangeCondition = this._onChangeCondition.bind(this);

    this.sort = this.sort.bind(this);

    this.styles = {
      box: {
        position: 'fixed',
        width: '250px',
        padding: '0px',
        fontFamily: 'Arial, "sans serif"',
        fontSize: '13px',
        backgroundColor: 'rgba(255, 255, 255, .99)',
        border: '1px solid rgba(0,0,0,.2)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: '990',
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
      },
    };

    this.state = { filter: { value: {} } };
    this.filterValues = { value: {} };
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.distinctFilters !== this.props.distinctFilters || nextProps.isVisible !== this.props.distinctFilters
    );
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      this.props.onCancel();
    }
  }

  filterChange(e) {
    let queryText = e.target.value.trim();
    this.props.onSearch({ dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType });
  }

  sort(direction) {
    this.props.onSort(direction);
  }

  filterDistinct(e) {
    let queryText = e.target.value.trim();
    this.props.onFilterDistinct({ value: queryText, dataType: this.props.dataType });
  }

  addValueOnFilter(value) {
    this.props.onSelectValueOnFilter({ value: value, dataType: this.props.dataType });
  }

  _setValueInFilter(e) {
    this.props.handlerValueInConditionFilter(e.target.name, e.target.value);
  }

  _hasInFilter(value) {
    return this.props.selectedDistinctValues.includes(value);
  }

  _onChangeCondition(condition) {
    this.props.handlerConditionFilter(condition);
  }

  renderSelectedsDistinctValues() {
    let items = this.props.selectedDistinctValues.map((item, i) => {
      let rendered = this.props.formatterOnFilter ? this.props.formatterOnFilter(item) : item;
      return (
        <div className="sv-tag info" key={`item-${item}-${i}`}>
          <span className="sv-tag__close" onClick={() => this.addValueOnFilter(item)}>×</span>
          <span className="sv-tag__content">{rendered}</span>
        </div>
      );
    });

    return <div>{items}</div>;
  }

  renderConditionsByDataType() {
    let options = conditions[this.props.dataType].map((opt, i) => {
      return <option key={`${this.props.dataType}-${opt.value}-${i}`} value={JSON.stringify(opt)}>{opt.label}</option>;
    });

    return (
      <label>
        <span>Condição</span>
        <div className="sv-select">
          <select onChange={e => this._onChangeCondition(JSON.parse(e.target.value))}>
            {options}
          </select>
          <label>
            <i className="fa fa-angle-down fa-fw" />
          </label>
        </div>
      </label>
    );
  }

  renderConditionValue() {
    let valueFild = (
      <input
        name="only"
        onChange={e => this._setValueInFilter(e)}
        placeholder="Valor desejado"
        type="text"
        value={this.props.filtersByConditions.value['only'] || ''}
      />
    );

    if (this.props.dataType === 'numeric' && this.props.condition.value === '$bet') {
      valueFild = (
        <div className="sv-row--with-gutter">
          <div className="sv-column">
            <input
              className={!this.props.isGteValueValid ? 'is--invalid': ''}
              name="start"
              onChange={e => this._setValueInFilter(e)}
              placeholder="Valor inicial"
              type="number"
              value={this.props.filtersByConditions.value['start'] || ''}
            />
            {
              !this.props.isGteValueValid ? (
                <span className="sv-color--red-500"> Campo obrigatório </span>
              ): ''
            }
          </div>
          <div className="sv-column">
            <input
              className={!this.props.isLteValueValid ? 'is--invalid': ''}
              name="end"
              onChange={e => this._setValueInFilter(e)}
              placeholder="Valor final"
              type="number"
              value={this.props.filtersByConditions.value['end'] || ''}
            />
            {
              !this.props.isLteValueValid ? (
                <span className="sv-color--red-500"> Campo obrigatório </span>
              ): ''
            }
          </div>
        </div>
      );
    }

    return valueFild;
  }

  renderFilter() {
    let distinctsValues = this.props.distinctValues.map((uniq, i) => {
      let rendered = this.props.formatterOnFilter ? this.props.formatterOnFilter(uniq) : uniq;
      let cssClass = !this._hasInFilter(uniq) ? 'fa fa-square-o fa-fw' : 'fa fa-check-square-o fa-fw';
      return (
        <li key={`${uniq}__${i}`}>
          <label className="sv-no-margins" onClick={() => this.addValueOnFilter(uniq)}>
            <i className={cssClass} /> {rendered}
          </label>
        </li>
      );
    });

    return (
      <div style={this.styles.container}>
        <h6 style={this.styles.h6}>Filtro por valor</h6>
        <hr style={this.styles.hr} />
        <div>
          <form className="sv-form" onSubmit={e => e.preventDefault()}>
            <input onChange={e => this.filterDistinct(e)} placeholder="Filtrar por" type="text" />

            <div style={this.styles.filterValues}>
              <ul>
                {distinctsValues}
              </ul>
            </div>
          </form>
          {this.renderSelectedsDistinctValues()}
        </div>

        <h6 style={this.styles.h6}>Filtro por condição</h6>
        <hr style={this.styles.hr} />
        <form className="sv-form" onSubmit={e => e.preventDefault()}>
          {this.renderConditionsByDataType()}
          {this.renderConditionValue()}
        </form>
      </div>
    );
  }

  renderButtons() {
    return (
      <div key={v4()} style={this.styles.containerBottom}>
        {this.props.searchable
          ? <button
              className="sv-button primary small sv-horizontal-marged-15"
              onClick={() =>
                this.props.onApplyFilters({ condition: this.props.condition.value, filter: this.state.filter.value })}
              type="button"
            >
              Aplicar
            </button>
          : null}
        <button
          className="sv-button default small sv-horizontal-marged-15"
          onClick={() => this.props.onCancel()}
          type="button"
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

    let sortClasses = { asc: 'fa-sort-alpha-asc fa-fw', desc: 'fa-sort-alpha-desc' };

    if (this.props.dataType !== 'text') {
      sortClasses.asc = 'fa-sort-numeric-asc';
      sortClasses.desc = 'fa-sort-numeric-desc';
    }

    return (
      <div
        className="pwt-actions"
        onClick={e => e.stopPropagation()}
        style={{ ...this.styles.box, ...this.props.style }}
      >

        <div style={this.styles.containerTop}>
          <h6 style={this.styles.h6}>{this.props.columnTitle}</h6>
        </div>
        <div style={this.styles.containerOrder}>
          <button
            className="sv-button link link-default sv-pull-left"
            onClick={() => this.sort('ASC')}
            style={this.styles.sortButtons}
            type="button"
          >
            Ordenar <i className={`fa fa-fw ${sortClasses.asc}`} />
          </button>
          <button
            className="sv-button link link-default sv-pull-right"
            onClick={() => this.sort('DESC')}
            style={this.styles.sortButtons}
            type="button"
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

ColumnActions.propTypes = {
  columnTitle: PropTypes.string,
  condition: PropTypes.object,
  dataKey: PropTypes.string,
  dataType: PropTypes.oneOf(['numeric', 'text', 'date']).isRequired,
  distinctFilters: PropTypes.object,
  distinctFiltersValue: PropTypes.any,
  distinctValues: PropTypes.array,
  filtersByConditions: PropTypes.object,
  formatterOnFilter: PropTypes.func,
  handlerConditionFilter: PropTypes.func,
  handlerValueInConditionFilter: PropTypes.func,
  isGteValueValid: PropTypes.bool,
  isVisible: PropTypes.bool,
  isLteValueValid: PropTypes.bool,
  onApplyFilters: PropTypes.func,
  onCancel: PropTypes.func, //OK
  onFilterDistinct: PropTypes.func, //OK
  onSearch: PropTypes.func, //OK
  onSelect: PropTypes.func,
  onSelectValueOnFilter: PropTypes.func,
  onSort: PropTypes.func, //OK
  searchable: PropTypes.bool,
  selectedDistinctValues: PropTypes.array,
  style: PropTypes.object,
};

export default ColumnActions;

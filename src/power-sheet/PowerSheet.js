import React from 'react';
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types';
import update from 'immutability-helper';
import WindowedList from 'react-windowed-list';
import axios from 'axios';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import _find from 'lodash/find';
import {v4} from 'uuid';
import sift from 'sift';

import { bytesToSize } from './utils.js';
import ColumnActions from './ColumnActions';

import style from './styles.css';

class PowerSheet extends React.Component {
  constructor(props){
    super(props);

    this.originalData = [];
    this._distinctsLimited = {};
    this._distincts = {};
    this.columns = this._extractColumns(props);
    this.columnsWidths = this._extractColumnsWidth(props);


    this._renderItem = this._renderItem.bind(this);

    this._fixScrollBarDiff = this._fixScrollBarDiff.bind(this);
    this._fillDistincts = this._fillDistincts.bind(this);
    this._selectColumn = this._selectColumn.bind(this);



    this._onSort = this._onSort.bind(this);
    this._onFilter = this._onFilter.bind(this);
    this._onApplyFilter = this._onApplyFilter.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._handlerDistinctFilters = this._handlerDistinctFilters.bind(this);

    this._filterDistinct = this._filterDistinct.bind(this);

    this._handlerConditionFilter = this._handlerConditionFilter.bind(this);
    this._handlerValueInConditionFilter = this._handlerValueInConditionFilter.bind(this);


    this._getCurrentDistinctValues = this._getCurrentDistinctValues.bind(this);
    this._getCurrentSelectedDistinctValues = this._getCurrentSelectedDistinctValues.bind(this);

    this.sort = null;
    this.sortDesc = false;
    this.sorts = {};

    this.state = {
      activeColumn: null,
      activeColumnType: 'text',
      activeColumnTitle: '',
      columnPosition: {x: '0px', y: '0px'},
      collection: [],
      currentData: [],
      message: 'Iniciando o carregamento dos dados',
      count: 0,
      filters: {},
      filtersByConditions: {},
      selectedDistinctFilters: {},
      distinctFiltersValue: {},
      loading: true,
      sorts: {},
    };

  }

  componentDidMount() {
    let requestConfig = {
      method: this.props.fetch.method,
      onDownloadProgress: (e) => {
        const newState = update(this.state, {message: {$set: `${bytesToSize(e.loaded)} carregados...`}});
        this.setState(newState);
      }
    };

    if(this.props.fetch.params) {
      this.props.fetch.method === 'get' ? requestConfig.params = this.props.fetch.params : requestConfig.data = this.props.fetch.params;
    }

    axios
      .get(this.props.fetch.url, requestConfig)
      .then((response) => {
        this.originalData = response.data;
        const distincts = this._fillDistincts();
        const newState = update(this.state, {
          message: {$set: ''},
          currentData: {$set: response.data},
          distinctValues: {$set: distincts}
        });

        this.setState(newState, () => this._fixScrollBarDiff());
      })
      .catch((error) => {
        console.error(error);
        const newState = update(this.state, {message: {$set: error}});
        this.setState(newState);
      });
  }

  componentDidUpdate(){
    this._fixScrollBarDiff();
  }

  _fixScrollBarDiff() {
    const container = ReactDOM.findDOMNode(this);
    let scrollAreaWidth = container.offsetWidth;
    let tableContainer = container.querySelector('.pw-table-tbody');
    let tableRow = container.querySelector('.pw-table-tbody .pw-table-tbody-row');
    let tableWidth = null;

    if(tableRow){
      tableWidth = tableRow.offsetWidth;
    }

    if(tableWidth !== null && scrollAreaWidth !== tableWidth) {
      let headerContainer = container.querySelector('.pw-table-header');
      let styles = window.getComputedStyle(tableContainer);
      let border = styles.borderRight.split(' ')[0];
      const borderSize = parseInt(border.match(/(?:\d*\.)?\d+/g)[0], 10);
      headerContainer.style.paddingRight = `${scrollAreaWidth - borderSize - tableWidth}px`;
    }
  }


  /**
   * Extrai as informações das colunas.
   *
   * @param props
   * @return {*}
   * @private
   */
  _extractColumns(props) {
    return React.Children.map(props.children, (child) => {
      return {
        title: child.props.columnTitle,
        key: child.props.dataKey,
        formatter: child.props.formatter,
        searchable: child.props.searchable,
        groupBy: child.props.groupBy
      };
    });
  }

  /**
   * Extrai a prop widh das colunas.
   *
   * @param props
   * @return {*}
   * @private
   */
  _extractColumnsWidth(props) {
    let widths = [];
    React.Children.forEach(props.children, (child) => widths.push(child.props.width));
    return widths;
  }

  /**
   * Seta qual é a coluna ativa (que terá as opções de filtro e sort aberto)
   *
   * @param dataKey
   * @param dataType
   * @param columnTitle
   * @param e
   * @private
   */
  _selectColumn(dataKey, dataType, columnTitle, e) {
    let activeColumn = dataKey === this.state.activeColumn ? null : dataKey;
    let activeColumnType = activeColumn ? dataType : 'text';

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const colunmActionWidth = 250;
    const mouseGutter = 20;
    let xPosition = e.nativeEvent.x;


    if((e.nativeEvent.x + colunmActionWidth) >= screenWidth) {
      xPosition = e.nativeEvent.x - colunmActionWidth - mouseGutter;
    }

    const newPosition = {x: xPosition, y: e.nativeEvent.y};

    const newState = update(this.state, {
      activeColumn: {$set: activeColumn},
      activeColumnType: {$set: activeColumnType},
      activeColumnTitle: {$set: columnTitle},
      columnPosition: {$set: newPosition}
    });

    this.setState(newState);
  }


  _fillDistincts() {
    for (let i = 0; i < this.columns.length; i++) {
      let col = this.columns[i];
      if (col && col.searchable) {
        this._distinctsLimited[col.key] = [...new Set(this.originalData.slice(0, 100).map(item => _get(item, col.key)))];
        this._distincts[col.key] = [...new Set(this.originalData.map(item => _get(item, col.key)))];
      }
    }
    return this._distinctsLimited;
  }

  _onFilter() {
    debugger;
  }

  _filterDistinct(filterProps) {

    const {value} = filterProps;
    const dataKey = this.state.activeColumn;

    if (value) {
      const contains = (val) => {
        return val.toString().toLowerCase().indexOf(value.toLowerCase()) > -1;
      };

      let itens = _get(this._distincts, dataKey, []).filter(contains);
      let distincts = itens.slice(0, 199);

      let oldDistinctFiltersValueState = JSON.stringify(this.state.distinctFiltersValue);
      let newDistinctFiltersValueState = JSON.parse(oldDistinctFiltersValueState);
      newDistinctFiltersValueState[dataKey] = value;


      let oldDistinctState = JSON.stringify(this.state.distinctValues);
      let newDistinctState = JSON.parse(oldDistinctState);
      newDistinctState[dataKey] = distincts;

      let oldState = JSON.stringify(this.state.selectedDistinctFilters);
      let newState = JSON.parse(oldState);

      if(newState.hasOwnProperty(dataKey)) {
        if(!newState[dataKey].includes(value)) {
          newState[dataKey].push(value);
        } else {
          let index = newState[dataKey].indexOf(value);
          newState[dataKey].splice(index, 1);
        }
      } else {
        newState[dataKey] = [value];
      }

      this.setState(update(this.state, {
        distinctValues: {$set: newDistinctState},
        distinctFiltersValue: {$set: newDistinctFiltersValueState},
      }));

    } else {
      const distincts = this._fillDistincts();

      const newState = update(this.state, {
        distinctValues: {$set: distincts}
      });

      this.setState(newState);
    }
  }

  /**
   * Manipula o retorno do filtro nos valores distinct.
   *
   * @param filterProps
   * @private
   */
  _handlerDistinctFilters(filterProps) {

    const { value } = filterProps;
    const dataKey = this.state.activeColumn;

    let oldState = JSON.stringify(this.state.selectedDistinctFilters);
    let newState = JSON.parse(oldState);

    if(newState.hasOwnProperty(dataKey)) {
      if(!newState[dataKey].includes(value)) {
        newState[dataKey].push(value);
      } else {
        let index = newState[dataKey].indexOf(value);
        newState[dataKey].splice(index, 1);
      }
    } else {
      newState[dataKey] = [value];
    }

    if(!newState[dataKey].length) {
      delete newState[dataKey];
    }

    this.setState(update(this.state, {selectedDistinctFilters: {$set: newState}}));
  }

  _handlerConditionFilter(condition) {
    const dataKey = this.state.activeColumn;

    let oldState = JSON.stringify(this.state.filtersByConditions);
    let newState = JSON.parse(oldState);

    let conditionValue;
    if(condition) {
      conditionValue = condition.value;
    } else {
      conditionValue = (this.state.activeColumnType === 'text' ? '$in' : '$gt');
    }

    this._generateCondition(newState, dataKey, conditionValue);
    debugger;

    this.setState(update(this.state, {filtersByConditions: {$set: newState}}));

  }

  _generateCondition(newState, dataKey, condition = (this.state.activeColumnType === 'text' ? '$in' : '$gt')) {
    if (newState.hasOwnProperty(dataKey)) {
      newState[dataKey].condition = condition;
    } else {
      newState[dataKey] = {condition: condition, value: {}};
    }
  }

  _handlerValueInConditionFilter(name, value) {

    const dataKey = this.state.activeColumn;

    let oldState = JSON.stringify(this.state.filtersByConditions);
    let newState = JSON.parse(oldState);

    let setValue = function () {
      newState[dataKey].value[name] = value;
    };

    if(newState.hasOwnProperty(dataKey)) {
      setValue();
    } else {
      this._generateCondition(newState, dataKey);
      setValue();
    }
    debugger;
    this.setState(update(this.state, {filtersByConditions: {$set: newState}}));
  }

  _onSort(direction) {
    this.sortDesc = direction !== 'ASC';
    this.sort = this.state.activeColumn;
    this.sorts = {};
    this.sorts[this.state.activeColumn] = this.sortDesc;

    this._onApplyFilter();
  }

  _onApplyFilter() {

    let perValueFilter = {};
    let filtersByConditions = this.state.filtersByConditions;

    Object.keys(this.state.selectedDistinctFilters).forEach(key => {
      if(key) {
        perValueFilter[key] = {$in: this.state.selectedDistinctFilters[key]};
      }
    });

    let itens = sift(perValueFilter, this.originalData);

    let perConditionsFilter = {};
    let $andConditions = [];

    Object.keys(filtersByConditions).forEach(key => {
      let conditions = {};
      let condition = filtersByConditions[key].condition;

      if(condition !== '$bet') {

        let value = filtersByConditions[key].value.only;

        if (condition === '$in' || condition === '$nin') {
          if(condition === '$in') {
            value = new RegExp(`${value.toString()}`, 'gi');
          } else {
            value = new RegExp(`[^${value.toString()}]`, 'gi');
          }
          condition = '$regex';
        } else {
          value = parseInt(value, 10);
        }
        conditions[condition] = value;
        perConditionsFilter[key] = conditions;
      } else {

        let {start, end} = filtersByConditions[key].value;
        let startCondition = {};
        let endCondition = {};

        startCondition[key] = {$gte: parseInt(start, 10)};
        endCondition[key] = {$lte: parseInt(end, 10)};

        if(start.length > 0 && end.length > 0) {
          $andConditions.push(startCondition, endCondition);
        }

        perConditionsFilter = { $and: $andConditions};
      }
    });

    itens = sift(perConditionsFilter, itens);


    if(this.sorts) {
      let key = Object.keys(this.sorts)[0];
      itens = _sortBy(itens, key);

      if(this.sorts[key]) {
        itens.reverse();
      }

    }

    const newState = update(this.state, {currentData: {$set: itens}});
    this.setState(newState);

  }


  _onCancel () {
    const newState = update(this.state, {
      activeColumn: {$set: null},
      activeColumnType: {$set: 'text'},
    });
    this.setState(newState);
  }

  _renderItem(index, key) {
    let row = this.state.currentData[index];

    let cols = this.columns.map((col, i) => {
      let style = {};
      if(this.columnsWidths[i]) {
        style.flex = `0 0 ${this.columnsWidths[i]}px`;
      }
      return (<div className='pw-table-tbody-cell' key={v4()} style={style}><div>{_get(row, col.key)}</div></div>);
    });

    return (
      <div className='pw-table-tbody-row' key={key}>
        {cols}
      </div>
    );
  }

  _getCurrentDistinctValues() {
    const {activeColumn, distinctValues} = this.state;
    return (activeColumn &&  distinctValues[activeColumn]) ? distinctValues[activeColumn] : [];
  }

  _getCurrentSelectedDistinctValues() {
    const {activeColumn, selectedDistinctFilters} = this.state;
    return (activeColumn &&  selectedDistinctFilters[activeColumn]) ? selectedDistinctFilters[activeColumn] : [];
  }

  _getCurrentFilterByConditionValues() {
    const {activeColumn, filtersByConditions} = this.state;
    return (activeColumn &&  filtersByConditions[activeColumn]) ? filtersByConditions[activeColumn] : {condition: '', value: {}};
  }

  _getSearchable() {
    let isSearchable = false;

    if(this.state.activeColumn) {
      isSearchable = _find(this.columns, { key: this.state.activeColumn }).searchable;
    }

    return isSearchable;
  }

  render() {
    // let display = this.state.activeColumn ? 'block' : 'none';
    let headers = this.props.children.map((chield) => {
      let newProps = {key: v4()};
      if(chield.props.dataKey){
        // newProps.onSearch = this._onFilter;
        // newProps.onSort = this._onSort;
        newProps.filters = this.state.filters;
        // newProps.filtersByConditions = this.state.filtersByConditions;
        newProps.sorts = this.sorts;
        newProps.onSelect = this._selectColumn;
        // newProps.onFilterDistinct = this._filterDistinct;
        // newProps.onAddToFilterDistinct = this._handlerDistinctFilters;

        // newProps.distinctsLimited = this.state.distinctsLimited;
        // newProps.distinctFiltersValue = this.state.distinctFiltersValue;

        // newProps.activeColumn = this.state.activeColumn;
        // newProps.distinctFilters = this.state.distinctFilters;
        // newProps.onApplyFilter = this._onApplyFilter;
      }
      let props = {...chield.props, ...newProps};

      return React.cloneElement(chield, props);
    });

    let infoClasses = 'pw-table-info';
    if(this.originalData.length === 0) {
      infoClasses += ' active';
    }
    return (
      <div className='pw-table'>
        <div className={infoClasses}>
          {this.originalData.length ?
            ` ${this.originalData.length.toLocaleString()} registros` :
            <i className='fa fa-circle-o-notch fa-spin fa-lg fa-fw' style={{marginRight: '10px'}} />
          }
          { this.state.message }
        </div>
        {this.originalData.length > 0 &&
          <div className='pw-table-header'>
            <div className='pw-table-header-row'>
              {headers}
            </div>
          </div>
        }
        {this.originalData.length > 0 &&
          <div className='pw-table-tbody' style={{maxHeight: `${this.props.containerHeight}px`}}>
            <WindowedList
            itemRenderer={this._renderItem}
            length={this.state.currentData.length}
            pageSize={(this.props.pageSize > this.state.currentData.length) ? this.state.currentData.length : this.props.pageSize}
            type='uniform'
            />
          </div>
        }

        <ColumnActions
          columnTitle={this.state.activeColumnTitle}
          onSort={this._onSort}
          onCancel={this._onCancel}
          onSelectValueOnFilter={this._handlerDistinctFilters}
          sorts={this.sorts}
          dataType={this.state.activeColumnType}
          isVisible={this.state.activeColumn !== null}
          style={{
            top: `${this.state.columnPosition.y + 10}px`,
            left: `${this.state.columnPosition.x + 10}px`,
          }}
          handlerValueInConditionFilter={this._handlerValueInConditionFilter}
          handlerConditionFilter={this._handlerConditionFilter}
          distinctValues={this._getCurrentDistinctValues()}
          selectedDistinctValues={this._getCurrentSelectedDistinctValues()}
          searchable={this._getSearchable()}
          onFilter={this._onFilter}
          filters={this.state.filters}
          filtersByConditions={this._getCurrentFilterByConditionValues()}
          onSelect={this._selectColumn}
          onFilterDistinct={this._filterDistinct}


          activeColumn={this.state.activeColumn}

          onApplyFilters={this._onApplyFilter}
        />

      </div>
    );
  }

}

PowerSheet.displayName = 'PowerSheet';

PowerSheet.propTypes = {
  containerHeight: Proptypes.number.isRequired,
  fetch: Proptypes.shape({
    url: Proptypes.string.isRequired,
    method: Proptypes.oneOf(['get', 'post']).isRequired,
    params: Proptypes.object,
  }).isRequired,
  pageSize: Proptypes.number.isRequired,
};

export default PowerSheet;
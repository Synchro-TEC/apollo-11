import React from 'react';
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types';
import update from 'immutability-helper';
import ReactList from 'react-list';
import axios from 'axios';
import { v4 } from 'uuid';
import sift from 'sift';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import _find from 'lodash/find';
import _has from 'lodash/has';
import _intersectionWith from 'lodash/intersectionWith';
import _xor from 'lodash/xor';
import _sumBy from 'lodash/sumBy';
import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';

import GroupedTableBody from './GroupedTableBody';
import { bytesToSize } from './utils.js';
import ColumnActions from './ColumnActions';
import { conditions } from './conditions.js';

import './styles.css';

class PowerSheet extends React.Component {
  constructor(props) {
    super(props);

    this.originalData = [];
    this.groupedColumns = [];

    this._distinctsLimited = {};
    this._distincts = {};
    this.columns = this._extractColumns(props);
    this.columnsWidths = this._extractColumnsWidth(props);
    this.cachedRenderedGroup = [];
    this.cachedRenderedGroupHeighs = [];

    this._renderItem = this._renderItem.bind(this);
    this._renderGroupedItem = this._renderGroupedItem.bind(this);
    this._fixScrollBarDiff = this._fixScrollBarDiff.bind(this);
    this._fillDistincts = this._fillDistincts.bind(this);
    this._selectColumn = this._selectColumn.bind(this);
    this._onSort = this._onSort.bind(this);
    this._onApplyFilter = this._onApplyFilter.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._handlerDistinctFilters = this._handlerDistinctFilters.bind(this);
    this._filterDistinct = this._filterDistinct.bind(this);
    this._handlerConditionFilter = this._handlerConditionFilter.bind(this);
    this._handlerValueInConditionFilter = this._handlerValueInConditionFilter.bind(this);
    this._getCurrentDistinctValues = this._getCurrentDistinctValues.bind(this);
    this._getCurrentSelectedDistinctValues = this._getCurrentSelectedDistinctValues.bind(this);
    this._getFormatterOnFilter = this._getFormatterOnFilter.bind(this);
    this._keysThatHasFilter = this._keysThatHasFilter.bind(this);
    this._getItemHeight = this._getItemHeight.bind(this);
    this._sumRowSpan = this._sumRowSpan.bind(this);
    this._groupByMulti = this._groupByMulti.bind(this);
    this._prepareLocalData = this._prepareLocalData.bind(this);
    this._prepareRemoteData = this._prepareRemoteData.bind(this);
    this._prepareData = this._prepareData.bind(this);
    this._makeHeightsCache = this._makeHeightsCache.bind(this);
    this._clearCachedRenderedGroup = this._clearCachedRenderedGroup.bind(this);
    this.sortDesc = false;    
    this.sorts = {};

    this.state = {
      activeColumn: null,
      activeColumnType: 'text',
      activeColumnTitle: '',
      columnPosition: { x: '0px', y: '0px' },
      collection: [],
      currentData: [],
      message: 'Iniciando o carregamento dos dados',
      count: 0,
      condition: {},      
      filters: {},
      filtersByConditions: {},
      gteValueIsValid: true,
      lteValueIsValid: true,
      selectedDistinctFilters: {},
      distinctFiltersValue: {},
      loading: true,
      sorts: {},
    };
  }

  componentDidMount() {
    this.props.fetch.hasOwnProperty('data') ? this._prepareLocalData() : this._prepareRemoteData();
    window.addEventListener('resize', this._fixScrollBarDiff(true));
  }

  componentDidUpdate() {
    this._fixScrollBarDiff();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._fixScrollBarDiff);
  }

  /**
   * Prepara os dados recebido pelo fetch {data}
   *
   *
   * @memberof PowerSheet
   */
  _prepareLocalData() {
    this.originalData = this.props.fetch.data;
    const preparedDataState = this._prepareData(this.props.fetch.data);
    this.setState(preparedDataState, this._fixScrollBarDiff);
  }

  /**
   * Prepara os dados recebidos pelo fetch remoto {url, data, params}
   *
   *
   * @memberof PowerSheet
   */
  _prepareRemoteData() {

    let requestConfig = {
      method: this.props.fetch.method,
      onDownloadProgress: e => {
        const newState = update(this.state, { message: { $set: `${bytesToSize(e.loaded)} carregados...` } });
        this.setState(newState);
      },
    };

    if (this.props.fetch.params) {
      this.props.fetch.method === 'get'
        ? (requestConfig.params = this.props.fetch.params)
        : (requestConfig.data = this.props.fetch.params);
    }

    axios
      .get(this.props.fetch.url, requestConfig)
      .then(response => {
        this.originalData = response.data;
        const preparedDataState = this._prepareData(response.data);
        this.setState(preparedDataState, this._fixScrollBarDiff);
      })
      .catch(error => {
        console.error(error);
        const newState = update(this.state, { message: { $set: error } });
        this.setState(newState);
      });
  }

  /**
   * Prepara os dados recebidos de forma única, tanto recebidos pelo fetch local ou pelo fetch remoto
   *
   * @param {any} data
   *
   * @memberof PowerSheet
   */
  _prepareData(data) {

    const distincts = this._fillDistincts();
    const currentData = this.groupedColumns.length
          ? this._groupByMulti(data, _map(_filter(this.columns, { groupBy: true }), 'key'))
          : data;

    if (this.groupedColumns.length) {
      this._clearCachedRenderedGroup();
      this._makeHeightsCache(currentData);
    }

    return update(this.state, {
      message: { $set: '' },
      currentData: { $set: currentData },
      distinctValues: { $set: distincts },
    });
  }

  /**
   * Faz o cache das alturas das linhas baseado nos rowsapn da linha agrupada
   *
   * @param {any} currentData
   *
   * @memberof PowerSheet
   */
  _makeHeightsCache(currentData) {
    this.cachedRenderedGroupHeighs = [];
    for (let i = 0; i < currentData.length; i++) {
      let row = currentData[i];
      this._sumRowSpan(row);
      this.cachedRenderedGroupHeighs.push(row.rowSpan * this.props.rowHeight);
    }
  }

  /**
   * Limpa o cache dos componentes que já foram montados
   *
   *
   * @memberof PowerSheet
   */
  _clearCachedRenderedGroup() {
    this.cachedRenderedGroup = [];
  }

  /**
   * Agrupa os dados através valores groupBy recebidos
   *
   * @param {any} list
   * @param {any} values
   * @returns
   *
   * @memberof PowerSheet
   */
  _groupByMulti(list, values) {
    if (!values.length) {
      return list;
    }

    let grouped = _groupBy(list, values[0]);

    let result = [];
    for (let prop in grouped) {
      result.push({
        name: values[0],
        value: prop,
        nested: this._groupByMulti(grouped[prop], values.slice(1)),
      });
    }

    return result;
  }

  /**
   * Ajusta os espaçamentos das colunas quando a barra de rolagem está visivel e deixa homogenio o comportamento
   * no MAC. LINUX e Windows
   *
   * @param {boolean} [shouldUpdate=false]
   *
   * @memberof PowerSheet
   */
  _fixScrollBarDiff(shouldUpdate = false) {
    const container = ReactDOM.findDOMNode(this);
    let scrollAreaWidth = container.offsetWidth;
    let innerContainer = this.groupedColumns.length ? '.pw-table-grouped-tbody' : '.pw-table-tbody';
    let tableContainer = container.querySelector(innerContainer);
    let tableRow = container.querySelector(`${innerContainer} .pw-table-tbody-row`);

    let tableWidth = null;

    if (tableRow) {
      tableWidth = tableRow.offsetWidth;
    }

    if (tableWidth !== null) {
      let headerContainer = container.querySelector('.pw-table-header');
      let styles = window.getComputedStyle(tableContainer);
      let border = styles.borderRight.split(' ')[0];
      const borderSize = parseInt(border.match(/(?:\d*\.)?\d+/g)[0], 10);
      headerContainer.style.paddingRight = `${scrollAreaWidth - borderSize - tableWidth}px`;
    }

    const headerContainer = container.querySelector('.pw-table-header-row');

    if (headerContainer) {
      const fisrtMargin = 15;
      const lastMargin = 15;
      [].slice.call(headerContainer.querySelectorAll('.pw-table-header-cell')).forEach((cell, i) => {
        if (!this.columns[i].width) {
          this.columns[i].width = i === 0 ? cell.offsetWidth - fisrtMargin : cell.offsetWidth - lastMargin;
        }
      });
    }

    if (shouldUpdate) {
      this.forceUpdate();
    }
  }

  /**
   * Extrai os dados das colunas (SheetColumns) que são children do PowerTable
   *
   * @param {any} props
   * @returns
   *
   * @memberof PowerSheet
   */
  _extractColumns(props) {
    let cols = React.Children.map(props.children, child => {
      if (child.props.groupBy) {
        this.groupedColumns.push(child.props.dataKey);
      }

      return {
        title: child.props.columnTitle,
        key: child.props.dataKey,
        formatter: child.props.formatter,
        formatterOnFilter: child.props.formatterOnFilter,
        searchable: child.props.searchable,
        groupBy: child.props.groupBy,
        width: child.props.width,
      };
    });

    let nonGroupedColumns = _filter(cols, { groupBy: false });
    let groupedCols = _filter(cols, { groupBy: true });

    return groupedCols.concat(nonGroupedColumns);
  }

  /**
   * Extrai os widths que são recebidos pelas colunas
   *
   * @param {any} props
   * @returns
   *
   * @memberof PowerSheet
   */
  _extractColumnsWidth(props) {
    let widths = [];
    React.Children.forEach(props.children, child => widths.push(child.props.width));
    return widths;
  }

  /**
   * Define a coluna que está selecionada
   *
   * @param {any} dataKey
   * @param {any} dataType
   * @param {any} columnTitle
   * @param {any} e
   *
   * @memberof PowerSheet
   */
  _selectColumn(dataKey, dataType, columnTitle, e) {
    let activeColumn = dataKey === this.state.activeColumn ? null : dataKey;
    let activeColumnType = activeColumn ? dataType : 'text';

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const colunmActionWidth = 250;
    const mouseGutter = 20;
    let xPosition = e.nativeEvent.x;
    let filtersByConditionsDefault = {};

    if (e.nativeEvent.x + colunmActionWidth >= screenWidth) {
      xPosition = e.nativeEvent.x - colunmActionWidth - mouseGutter;
    }
    
    if (!this.state.filtersByConditions.hasOwnProperty(dataKey)) {      
      filtersByConditionsDefault[dataKey] = { condition: conditions[dataType][0].value, value: {} };
    }

    const newPosition = { x: xPosition, y: e.nativeEvent.y };

    const newState = update(this.state, {
      activeColumn: { $set: activeColumn },
      activeColumnType: { $set: activeColumnType },
      activeColumnTitle: { $set: columnTitle },
      columnPosition: { $set: newPosition },
      condition: { $set: conditions[dataType][0] },
      filtersByConditions: { $set: filtersByConditionsDefault },
      gteValueIsValid: { $set: true }, 
      lteValueIsValid: { $set: true}          
    });

    this.setState(newState);
  }

  /**
   * Preenche os distincs de cada coluna
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _fillDistincts() {
    for (let i = 0; i < this.columns.length; i++) {
      let col = this.columns[i];
      if (col && col.searchable) {
        this._distinctsLimited[col.key] = [
          ...new Set(this.originalData.slice(0, 100).map(item => _get(item, col.key))),
        ];
        this._distincts[col.key] = [...new Set(this.originalData.map(item => _get(item, col.key)))];
      }
    }
    return this._distinctsLimited;
  }

  /**
   * Filtra os dados que estão nos distincts, pois por motivos de desenmpenho são enviados apenas 100 valores por vez
   * para cada coluna.
   *
   * @param {any} filterProps
   *
   * @memberof PowerSheet
   */
  _filterDistinct(filterProps) {
    const { value } = filterProps;
    const dataKey = this.state.activeColumn;

    if (value) {
      const contains = val => {
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

      if (newState.hasOwnProperty(dataKey)) {
        if (!newState[dataKey].includes(value)) {
          newState[dataKey].push(value);
        } else {
          let index = newState[dataKey].indexOf(value);
          newState[dataKey].splice(index, 1);
        }
      } else {
        newState[dataKey] = [value];
      }

      this.setState(
        update(this.state, {
          distinctValues: { $set: newDistinctState },
          distinctFiltersValue: { $set: newDistinctFiltersValueState },
        })
      );
    } else {
      const distincts = this._fillDistincts();

      const newState = update(this.state, {
        distinctValues: { $set: distincts },
      });

      this.setState(newState);
    }
  }

  /**
   * Manipula e define o comportamento dos filtros nos valores distincts
   *
   * @param {any} filterProps
   *
   * @memberof PowerSheet
   */
  _handlerDistinctFilters(filterProps) {
    const { value } = filterProps;
    const dataKey = this.state.activeColumn;

    let oldState = JSON.stringify(this.state.selectedDistinctFilters);
    let newState = JSON.parse(oldState);

    if (newState.hasOwnProperty(dataKey)) {
      if (!newState[dataKey].includes(value)) {
        newState[dataKey].push(value);
      } else {
        let index = newState[dataKey].indexOf(value);
        newState[dataKey].splice(index, 1);
      }
    } else {
      newState[dataKey] = [value];
    }

    if (!newState[dataKey].length) {
      delete newState[dataKey];
    }

    this.setState(update(this.state, { selectedDistinctFilters: { $set: newState } }));
  }

  /**
   * Manipula e define o comportamento dos filtros por condição
   *
   * @param {any} condition
   *
   * @memberof PowerSheet
   */
  _handlerConditionFilter(condition) {    
    const dataKey = this.state.activeColumn;

    let oldState = JSON.stringify(this.state.filtersByConditions);
    let newState = JSON.parse(oldState);

    let conditionValue;

    if (condition) {
      conditionValue = condition.value;
    } else {
      conditionValue = this.state.activeColumnType === 'text' ? '$in' : '$gt';
    }

    this._generateCondition(newState, dataKey, conditionValue);

    this.setState(
      update(this.state, {
        filtersByConditions: { $set: newState },
        condition: { $set: condition },
      })
    );
  }

  /**
   * Gera as condições baseadas no tipo de dado da coluna
   *
   * @param {any} newState
   * @param {any} dataKey
   * @param {string} [condition=this.state.activeColumnType === 'text' ? '$in' : '$gt']
   *
   * @memberof PowerSheet
   */
  _generateCondition(newState, dataKey, condition = this.state.activeColumnType === 'text' ? '$in' : '$gt') {
    if (newState.hasOwnProperty(dataKey)) {
      newState[dataKey].condition = condition;
    } else {
      newState[dataKey] = { condition: condition, value: {} };
    }
  }

  /**
   * Manipula e define o comportamento dos VALORES dos filtros por condição
   *
   * @param {any} name
   * @param {any} value
   *
   * @memberof PowerSheet
   */
  _handlerValueInConditionFilter(name, value) {
    const dataKey = this.state.activeColumn;    

    let oldState = JSON.stringify(this.state.filtersByConditions);
    let newState = JSON.parse(oldState);

    let setValue = function() {
      newState[dataKey].value[name] = value;
    };

    if (newState.hasOwnProperty(dataKey)) {
      setValue();
    } else {
      this._generateCondition(newState, dataKey);
      setValue();
    }

    this.setState(
      update(this.state, {
        filtersByConditions: { $set: newState },
        gteValueIsValid: { 
          $set: name === 'start' ? value !== '' : this.state.gteValueIsValid
        },
        lteValueIsValid: { 
          $set: name === 'end' ? value !== '' : this.state.lteValueIsValid
        }        
      })
    );
  }

  /**
   * Aplica o sort das colunas
   *
   * @param {any} direction
   *
   * @memberof PowerSheet
   */
  _onSort(direction) {
    this.sortDesc = direction !== 'ASC';
    this.sorts = {};
    this.sorts[this.state.activeColumn] = this.sortDesc;

    this._onApplyFilter();
  }

  /**
   * Aplica todos os filtros, por valores distincts ou condição
   *
   *
   * @memberof PowerSheet
   */
  _onApplyFilter() {
    let perValueFilter = {};
    let filtersByConditions = this.state.filtersByConditions;

    Object.keys(this.state.selectedDistinctFilters).forEach(key => {
      if (key) {
        perValueFilter[key] = { $in: this.state.selectedDistinctFilters[key] };
      }
    });

    let itens = sift(perValueFilter, this.originalData);

    let perConditionsFilter = {};
    let $andConditions = [];    
    let gteValueIsValid = true;
    let lteValueIsValid = true;

    Object.keys(filtersByConditions).forEach(key => {
      let conditions = {};
      let condition = filtersByConditions[key].condition;      
      
      if (condition !== '$bet') {
        let value = filtersByConditions[key].value.only;
        if(value) {
          if (condition === '$in' || condition === '$nin') {
            if (condition === '$in') {
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
        }
      } else {        
        let { start, end } = filtersByConditions[key].value;        
        gteValueIsValid = start ? true : false;
        lteValueIsValid = end ? true : false;
        let startCondition = {};
        let endCondition = {};

        startCondition[key] = { $gte: parseInt(start, 10) };
        endCondition[key] = { $lte: parseInt(end, 10) }; 

        if(start && end) {
          if (start.length > 0 && end.length > 0) {
            $andConditions.push(startCondition, endCondition);
          }
        }

        perConditionsFilter = { $and: $andConditions };
      }
    });

    itens = sift(perConditionsFilter, itens);

    if (this.sorts) {
      let key = Object.keys(this.sorts)[0];
      itens = _sortBy(itens, key);

      if (this.sorts[key]) {
        itens.reverse();
      }
    }

    let currentData = this.groupedColumns.length
      ? this._groupByMulti(itens, _map(_filter(this.columns, { groupBy: true }), 'key'))
      : itens;

    const newState = update(this.state, {
      currentData: { $set: currentData },
      activeColumn: { $set: null },
      activeColumnType: { $set: 'text' },      
    });

    if (this.groupedColumns.length) {
      this._clearCachedRenderedGroup();
      this._makeHeightsCache(currentData);
    }
    
    if(gteValueIsValid && lteValueIsValid) {
      this.setState(newState, this._fixScrollBarDiff);
    } else {
      const newState = update(this.state, {
        gteValueIsValid: { $set: gteValueIsValid },
        lteValueIsValid: { $set: lteValueIsValid}
      });
      this.setState(newState);
    }   
  }

  /**
   * Método chamado para cancelar / fechar um box de ação
   *
   * @memberof PowerSheet
   */
  _onCancel() {
    const newState = update(this.state, {
      activeColumn: { $set: null },
      activeColumnType: { $set: 'text' },
    });
    this.setState(newState);
  }

  /**
   * Renderiza os itens quando não há nenhum agrupamento
   *
   * @param {any} index
   * @param {any} key
   * @returns
   *
   * @memberof PowerSheet
   */
  _renderItem(index, key) {

    let row = this.state.currentData[index];

    let cols = this.columns.map((col, i) => {
      let style = {};
      if (this.columnsWidths[i]) {
        style.flex = `0 0 ${this.columnsWidths[i]}px`;
      }
      const valueToPrint = col.formatter ? col.formatter(row) : _get(row, col.key);
      return <div className="pw-table-tbody-cell" key={v4()} style={style}><div>{valueToPrint}</div></div>;
    });

    return (
      <div className="pw-table-tbody-row" key={key}>
        {cols}
      </div>
    );
  }

  /**
   * Calcula os rowspans das linhas agrupadas
   *
   * @param {any} row
   *
   * @memberof PowerSheet
   */
  _sumRowSpan(row) {
    if (_has(row, 'nested')) {
      row.rowSpan = 0;

      for (let i = 0; i < row.nested.length; i++) {
        row.nested[i].parent = row;
        this._sumRowSpan(row.nested[i]);
      }

      row.rowSpan = _sumBy(row.nested, r => {
        return r.rowSpan;
      });
    } else {
      row.rowSpan = 1;
    }
  }

  /**
   * Recura o altura de uma linha agrupada
   *
   * @param {int} index
   * @returns
   *
   * @memberof PowerSheet
   */
  _getItemHeight(index) {
    return this.cachedRenderedGroupHeighs[index];
  }

  /**
   * Renderiza os itens quando há coluans agrupadas
   *
   * @param {any} index
   * @param {any} key
   * @returns
   *
   * @memberof PowerSheet
   */
  _renderGroupedItem(index, key) {
    let dataRow = this.state.currentData[index];
    let row;

    if (this.cachedRenderedGroup[index]) {
      console.log('cached!');
      row = this.cachedRenderedGroup[index];
    } else {
      row = <GroupedTableBody columns={this.columns} data={dataRow} />;
      this.cachedRenderedGroup.splice(index, 0, row);
    }

    return (
      <div className="pw-table-tbody-row" key={key}>
        <table className="pw-table-grouped" style={{ tableLayout: 'fixed' }}>
          {row}
        </table>
      </div>
    );
  }

  /**
   * Recupera os valores distincts da coluna ativa
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _getCurrentDistinctValues() {
    const { activeColumn, distinctValues } = this.state;
    return activeColumn && distinctValues[activeColumn] ? distinctValues[activeColumn] : [];
  }

  /**
   * Recupera os valores distincts selecionados da coluna ativa
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _getCurrentSelectedDistinctValues() {
    const { activeColumn, selectedDistinctFilters } = this.state;
    return activeColumn && selectedDistinctFilters[activeColumn] ? selectedDistinctFilters[activeColumn] : [];
  }

  /**
   * Recupera os valores por condição da coluna ativa
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _getCurrentFilterByConditionValues() {
    const { activeColumn, filtersByConditions } = this.state;
    return activeColumn && filtersByConditions[activeColumn]
      ? filtersByConditions[activeColumn]
      : { condition: '', value: {} };
  }

  /**
   * Verifica se um campo é "Pesquisável" ou não
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _getSearchable() {
    let isSearchable = false;
    if (this.state.activeColumn) {
      isSearchable = _find(this.columns, { key: this.state.activeColumn }).searchable;
    }
    return isSearchable;
  }

  /**
   * Recupera os formatters da coluna ativa
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _getFormatterOnFilter() {
    let formatter;

    if (this.state.activeColumn) {
      formatter = _find(this.columns, { key: this.state.activeColumn }).formatterOnFilter;
    }
    return formatter;
  }

  /**
   * Recupera as keys das colunas que tem filtro
   *
   * @returns
   *
   * @memberof PowerSheet
   */
  _keysThatHasFilter() {
    const { selectedDistinctFilters, filtersByConditions } = this.state;
    return [...new Set(Object.keys(selectedDistinctFilters).concat(Object.keys(filtersByConditions)))];
  }

  render() {    
    let headers = [];
    let toRender = '';
    let scrollProps = {};

    if (this.state.currentData.length) {
      scrollProps.itemRenderer = this._renderItem;
      scrollProps.length = this.state.currentData.length;
      scrollProps.type = 'uniform';
      scrollProps.pageSize = this.props.pageSize;

      headers = this.props.children.map(chield => {
        let newProps = { key: v4(), isGrouped: !!this.groupedColumns.length };
        if (chield.props.dataKey) {
          newProps.selectedDistinctFilters = this._getCurrentSelectedDistinctValues();
          newProps.filtersByConditions = this._getCurrentFilterByConditionValues();
          newProps.sorts = this.sorts;
          newProps.onSelect = this._selectColumn;
          newProps.filterKeys = this._keysThatHasFilter();
        }
        let props = { ...chield.props, ...newProps };

        return React.cloneElement(chield, props);
      });

      if (this.groupedColumns.length) {
        scrollProps.itemRenderer = this._renderGroupedItem;
        // scrollProps.itemSizeEstimator = this._getItemHeight;
        scrollProps.itemSizeGetter = this._getItemHeight;

        scrollProps.type = 'variable';
        if (this.props.pageSize > this.groupedColumns.length) {
          scrollProps.pageSize = this.groupedColumns.length;
        }

        let hs = _intersectionWith(headers, this.groupedColumns, (header, key) => {
          return _has(header.props, 'dataKey') && key === header.props.dataKey;
        });
        let diff = _xor(headers, hs);
        headers = hs.concat(diff);

        toRender = (
          <table className="pw-table-grouped" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {headers}
              </tr>
            </thead>
          </table>
        );
      } else {
        toRender = headers;
      }
    }

    let infoClasses = 'pw-table-info';
    if (this.originalData.length === 0) {
      infoClasses += ' active';
    }
    return (
      <div className="pw-table">
        <div className={infoClasses}>
          {this.originalData.length
            ? ` ${this.originalData.length.toLocaleString()} registros`
            : <i className="fa fa-circle-o-notch fa-spin fa-lg fa-fw" style={{ marginRight: '10px' }} />}
          {this.state.message}
        </div>
        {this.originalData.length > 0 &&
          <div className="pw-table-header">
            <div className="pw-table-header-row">
              {toRender}
            </div>
          </div>}
        {this.state.currentData.length > 0 &&
          <div
            className={this.groupedColumns.length > 0 ? 'pw-table-grouped-tbody' : 'pw-table-tbody'}
            style={{ maxHeight: `${this.props.containerHeight}px` }}
          >
            <ReactList {...scrollProps} />
          </div>}

        <ColumnActions
          activeColumn={this.state.activeColumn}
          columnTitle={this.state.activeColumnTitle}
          condition={this.state.condition}
          dataType={this.state.activeColumnType}
          distinctValues={this._getCurrentDistinctValues()}
          filters={this.state.filters}
          filtersByConditions={this._getCurrentFilterByConditionValues()}
          formatterOnFilter={this._getFormatterOnFilter()}
          gteValueIsValid={this.state.gteValueIsValid}
          handlerConditionFilter={this._handlerConditionFilter}
          handlerValueInConditionFilter={this._handlerValueInConditionFilter}
          isVisible={this.state.activeColumn !== null}
          lteValueIsValid={this.state.lteValueIsValid}
          onApplyFilters={this._onApplyFilter}
          onCancel={this._onCancel}          
          onFilterDistinct={this._filterDistinct}
          onSelect={this._selectColumn}
          onSelectValueOnFilter={this._handlerDistinctFilters}
          onSort={this._onSort}
          searchable={this._getSearchable()}
          selectedDistinctValues={this._getCurrentSelectedDistinctValues()}
          sorts={this.sorts}
          style={{
            top: `${this.state.columnPosition.y + 10}px`,
            left: `${this.state.columnPosition.x + 10}px`,
          }}
        />
      </div>
    );
  }
}

PowerSheet.displayName = 'PowerSheet';

PowerSheet.propTypes = {
  containerHeight: Proptypes.number.isRequired,
  fetch: Proptypes.oneOfType([
    Proptypes.shape({
      url: Proptypes.string.isRequired,
      method: Proptypes.oneOf(['get', 'post']).isRequired,
      params: Proptypes.object,
    }).isRequired,
    Proptypes.shape({
      data: Proptypes.array.isRequired,
    }).isRequired,
  ]),
  pageSize: Proptypes.number.isRequired,
  rowHeight: Proptypes.number.isRequired,
};

export default PowerSheet;
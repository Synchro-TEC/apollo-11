import React from 'react';
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types';
import update from 'immutability-helper';
import { bytesToSize } from './utils.js';
import WindowedList from 'react-windowed-list';
import axios from 'axios';
import _get from 'lodash/get';
import {v4} from 'uuid'
import style from './styles.css';

import sift from 'sift';

/**
 * Sort
 *
 * @param field
 * @param reverse
 * @param primer
 * @return {function(*=, *=)}
 */
const sortBy = (field, reverse, primer) => {
  let key = primer ?
    (x) => primer(x[field]) :
    (x) => x[field];

  reverse = !reverse ? 1 : -1;

  return (a, b) => {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  };
};

class PowerSheet extends React.Component {
  constructor(props){
    super(props);

    this.originalData = [];
    this.distinctsLimited = {};
    this.distincts = {};
    this.columns = this._extractColumns(props);
    this.columnsWidths = this._extractColumnsWidth(props);

    this.renderItem = this.renderItem.bind(this);
    this.fixScrollBarDiff = this.fixScrollBarDiff.bind(this);
    this._fillDistincts = this._fillDistincts.bind(this);
    this._selectColumn = this._selectColumn.bind(this);

    this._sort = this._sort.bind(this);
    this._onApplyFilter = this._onApplyFilter.bind(this);

    this.sort = null;
    this.sortDesc = false;
    this.sorts = {};

    this.state = {
      activeColumn: null,
      collection: [],
      currentData: [],
      message: 'Iniciando o carregamento dos dados',
      count: 0,
      filters: {},
      filtersByConditions: {},
      distinctFilters: {},
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
        this.setState(
          {message: '', currentData: response.data},
          () => {
            this.fixScrollBarDiff();
            this._fillDistincts();
          });
      })
      .catch((error) => {
        console.error(error);
        const newState = update(this.state, {message: {$set: error}});
        this.setState(newState);
      });
  }

  componentWillUnmount() {
  }

  componentDidUpdate(){
    this.fixScrollBarDiff();
  }

  fixScrollBarDiff() {
    const container = ReactDOM.findDOMNode(this);
    let scrollAreaWidth = container.offsetWidth;
    let tableContainer = container.querySelector('.pw-table-tbody .pw-table-tbody-row');
    let tableWidth = null;

    if (tableContainer){
      tableWidth = tableContainer.offsetWidth;
    }

    if(tableWidth !== null && scrollAreaWidth !== tableWidth) {
      let headerContainer = container.querySelector('.pw-table-header');
      const bordersSize = 5;
      const scrollDiffInPixels = `${scrollAreaWidth + bordersSize - tableWidth}px`;
      const headers = headerContainer.querySelectorAll('.pw-table-header-cell');
      const lastHeaderCell = headers[headers.length - 1];

      lastHeaderCell.style.paddingRight = scrollDiffInPixels;
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
   * @private
   */
  _selectColumn(dataKey) {
    let activeColumn = dataKey === this.state.activeColumn ? null : dataKey;
    const newState = update(this.state, {activeColumn: {$set: activeColumn}});
    this.setState(newState);
  }

  _fillDistincts() {
    for (let i = 0; i < this.columns.length; i++) {
      let col = this.columns[i];
      if (col && col.searchable) {
        this.distinctsLimited[col.key] = [...new Set(this.originalData.slice(0, 100).map(item => _get(item, col.key)))];
        this.distincts[col.key] = [...new Set(this.originalData.map(item => _get(item, col.key)))];
      }
    }
  }

  _filter() {
    debugger;
  }

  _filterDistinct(filterProps) {
    debugger;
    // this.worker.postMessage({ action: 'FILTER_DISTINCT', filterProps});
  }

  /**
   * Manipula o retorno do filtro nos valores distinct.
   *
   * @param filterProps
   * @private
   */
  _handlerDistinctFilters(filterProps) {
    debugger;
    // const {value, dataKey} = filterProps;
    //
    // let oldState = JSON.stringify(this.state.distinctFilters);
    // let newState = JSON.parse(oldState);
    //
    // if(newState.hasOwnProperty(dataKey)) {
    //   if(!newState[dataKey].includes(value)) {
    //     newState[dataKey].push(value);
    //   } else {
    //     let index = newState[dataKey].indexOf(value);
    //     newState[dataKey].splice(index, 1);
    //   }
    // } else {
    //   newState[dataKey] = [value];
    // }
    //
    // this.setState(update(this.state, {distinctFilters: {$set: newState}}));
  }

  _sort(direction, datakey) {
    debugger;
    //TODO: Sort com datakey composta (name.first)
    this.sortDesc = direction !== 'ASC';
    this.sort = datakey;
    this.sorts = {};
    this.sorts[datakey] = this.sortDesc;

    this._onApplyFilter();
  }

  _onApplyFilter(perValue, perConditions, dataInfo) {
    debugger;
    // this.worker.postMessage({ action: 'FILTER', perValue, perConditions, dataInfo});
    // this._selectColumn(null);

    let perValueFilter = {};
    let itens = sift(perValueFilter, this.originalData);

    //TODO: Sort com datakey composta (name.first)
    if(this.sorts) {
      let key = Object.keys(this.sorts)[0];
      itens = itens.sort(sortBy(key, this.sorts[key]));
    }

    const newState = update(this.state, {currentData: {$set: itens}});
    this.setState(newState);

  }


  renderItem(index, key) {
    let row = this.state.currentData[index];

    let cols = this.columns.map((col, i) => {
      let style = {};
      if(this.columnsWidths[i]) {
        style.flex = `0 0 ${this.columnsWidths[i]}px`
      }
      return  <div className='pw-table-tbody-cell' key={v4()} style={style}>{_get(row, col.key)}</div>
    });

    return (
      <div className='pw-table-tbody-row' key={key}>
        {cols}
      </div>
    );
  }


  render() {

    let headers = this.props.children.map((chield) => {

      let newProps = {key: v4()};
      if(chield.props.dataKey){
        newProps.onSearch = this._filter;
        newProps.onSort = this._sort;
        newProps.filters = this.state.filters;
        newProps.filtersByConditions = this.state.filtersByConditions;
        newProps.sorts = this.state.sorts;
        newProps.onSelect = this._selectColumn;
        newProps.onFilterDistinct = this._filterDistinct;
        newProps.onAddToFilterDistinct = this._handlerDistinctFilters;
        newProps.uniqueValues = this.state.distincts;
        newProps.activeColumn = this.state.activeColumn;
        newProps.distinctFilters = this.state.distinctFilters;
        newProps.onApplyFilter = this._onApplyFilter;
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
        {/*{this.originalData.length > 0 &&*/}
          {/*<div className='pw-table-action'>*/}
            {/*<div className='pw-table-action-row'>*/}
              {/*<div className='pw-table-action-cell' style={{flex: `0 0 ${80}px`}}><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
              {/*<div className='pw-table-action-cell'><i className='fa fa-fw fa-caret-square-o-down'/></div>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*}*/}
        {this.originalData.length > 0 &&
          <div className='pw-table-header'>
            <div className='pw-table-header-row'>
              {headers}
              {/*<div className='pw-table-header-cell' style={{flex: `0 0 ${80}px`}}>ID</div>*/}
              {/*<div className='pw-table-header-cell'>Nome</div>*/}
              {/*<div className='pw-table-header-cell'>Sobrenome</div>*/}
              {/*<div className='pw-table-header-cell'>Papel</div>*/}
              {/*<div className='pw-table-header-cell'>Time</div>*/}
              {/*<div className='pw-table-header-cell'>E-mail</div>*/}
              {/*<div className='pw-table-header-cell'>Texto</div>*/}
            </div>
          </div>
        }
        {this.originalData.length > 0 &&
          <div className='pw-table-tbody' style={{maxHeight: `${this.props.containerHeight}px`}}>
            <WindowedList
            itemRenderer={this.renderItem}
            length={this.originalData.length}
            pageSize={this.props.pageSize}
            type='uniform'
            />
          </div>
        }
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
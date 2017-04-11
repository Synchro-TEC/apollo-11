import React from 'react';
import update from 'immutability-helper';
import ScrollArea from './ScrollArea';
import Paginate from '../paginate/Paginate';

const Worker = require('worker-loader?name=powerTableWorker.js&inline!./fetch.worker.js');

class PowerTable extends React.Component {

  constructor(props){
    super(props);

    this._filter = this._filter.bind(this);
    this._filterDistinct = this._filterDistinct.bind(this);
    this._handlerDistinctFilters = this._handlerDistinctFilters.bind(this);
    this._handlerWorkerReturn = this._handlerWorkerReturn.bind(this);
    this._onApplyFilter = this._onApplyFilter.bind(this);
    this._paginate = this._paginate.bind(this);
    this._selectColumn = this._selectColumn.bind(this);
    this._sort = this._sort.bind(this);

    this.worker = new Worker;
    this.columns = this._extractColumns(props);
    this.state = {
      activeColumn: null,
      collection: [],
      message: '',
      count: 0,
      filters: {},
      filtersByConditions: {},
      distinctFilters: {},
      loading: true,
      sorts: {},
    };

  }

  componentDidMount() {

    this.worker.addEventListener('message', (e) => {
      this._handlerWorkerReturn(e);
    }, false);

    let _message = {
      action: 'LOAD',
      url: 'http://localhost:9000/data_collection-1.1.6.js',
      dataUrl: this.props.dataUrl,
      fetchMethod: this.props.fetchMethod,
      pageSize: this.props.itensInViewPort,
      cols: this.columns.map((col) => {
        if(col.key) {
          return {key: col.key, searchable: col.searchable};
        }
      }),
    };

    if(this.props.groupBy && this.props.groupBy.length > 0) {
      _message.groupBy = this.props.groupBy.split(',');
    }

    this.worker.postMessage(
      _message
    );

  }

  componentWillUnmount() {
    this.worker.terminate();
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
      };
    });
  }

  /**
   * Envia ao worker a mensagem solicitando o filtro.
   * @param filterProps
   * @private
   */
  _filter(filterProps) {
    this.worker.postMessage({ action: 'FILTER', filterProps});
  }

  /**
   * Envia ao worker a mensagem solicitando o filtro nos valores Distincts.
   *
   * @param filterProps
   * @private
   */
  _filterDistinct(filterProps) {
    this.worker.postMessage({ action: 'FILTER_DISTINCT', filterProps});
  }

  /**
   * Manipula o retorno do filtro nos valores distinct.
   *
   * @param filterProps
   * @private
   */
  _handlerDistinctFilters(filterProps) {

    const {value, dataKey} = filterProps;

    let oldState = JSON.stringify(this.state.distinctFilters);
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

    this.setState(update(this.state, {distinctFilters: {$set: newState}}));
  }


  /**
   * Metodo que manipula o retorno dos processos realizado pelo Worker.
   *
   * @param e
   * @private
   */
  _handlerWorkerReturn(e) {

    const updateMessage = (message) => {
      const newState = update(this.state, {message: {$set: message}});
      this.setState(newState);
    };

    const refreshState = () => {
      const newState = update(this.state, {
        collection: {$set: e.data.itens},
        message: {$set: e.data.message},
        count: {$set: e.data.count},
        filters: {$set: e.data.filters},
        filtersByConditions: {$set: e.data.filtersByConditions},
        loading: {$set: false},
        sorts: {$set: e.data.sorts},
      });
      this.setState(newState);
    };

    switch (e.data.type) {
      case 'LOADING_INIT':
        updateMessage(e.data.message);
        break;
      case 'LOADING_ERROR':
        updateMessage(e.data.message);
        break;
      case 'LOADING':
        updateMessage(e.data.message);
        break;
      case 'LOADED':
        refreshState.call(this);
        break;
      case 'PAGINATE':
        refreshState.call(this);
        break;
      case 'SORT':
        this.refs.paginate.reset();
        refreshState.call(this);
        break;
      case 'FILTER':
        refreshState.call(this);
        break;
      case 'DISTINCT':
        this.setState(update(this.state, {distincts: {$set: e.data.itens}}));
        break;
      case 'FILTER_DISTINCT':
        if(!e.data.dataKey) {
          this.setState(update(this.state, {distincts: {$set: e.data.itens}}));
        } else {
          let oldState = JSON.stringify(this.state.distincts);
          let newState = JSON.parse(oldState);
          newState[e.data.dataKey] = e.data.itens;
          this.setState(update(this.state, {distincts: {$set: newState}}));
        }
        break;
    }
  }

  /**
   * Envia ao worker a mensagem solicitando que o filtro seja aplicado.
   *
   * @param perValue
   * @param perConditions
   * @param dataInfo
   * @private
   */
  _onApplyFilter(perValue, perConditions, dataInfo) {
    this.worker.postMessage({ action: 'FILTER', perValue, perConditions, dataInfo});
  }

  /**
   * Envia ao worker a mensagem solicitando a paginação.
   *
   * @param pagerObject
   * @private
   */
  _paginate(pagerObject) {
    const { currentPage, offset } = pagerObject;
    this.worker.postMessage({ action: 'PAGINATE', currentPage, offset });
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


  /**
   * Envia ao worker a mensagem solicitando o sort.
   *
   * @param direction
   * @param dataKey
   * @private
   */
  _sort(direction, dataKey) {
    this.worker.postMessage({ action: 'SORT', direction, dataKey});
  }


  render() {

    let opts = {
      collection: this.state.collection,
      columns: this.columns,
      container: this.node,
      itensInViewPort: this.props.itensInViewPort,
      onScroll: this._paginate,
      rowHeight: this.props.rowHeight,
      totalRecords: this.state.count,
    };

    let headers = this.props.children.map((chield, i) => {

      let newProps = {key: i};
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

    let scrollableArea = this.state.collection.length ?
      (<ScrollArea {...opts} />) : (this.state.loading ? '' : <div>Nenhum Registro Encontrado.</div>);

    return (
      <div>
        <p>{this.state.message || ' '}</p>
        <div className='PWT-TableHeader' style={{backgroundColor: '#f3f3f3'}}>
          <table className='sv-table with--hover with--grid' style={{tableLayout: 'fixed'}}>
            <thead>
            <tr>
              {headers}
            </tr>
            </thead>
          </table>
        </div>
        {scrollableArea}
        <div className='sv-padd-25'>
          <Paginate
            onNextPage={this._paginate}
            onPreviousPage={this._paginate}
            onSelectASpecifPage={this._paginate}
            recordsByPage={16}
            ref='paginate'
            totalSizeOfData={this.state.count}
          />
        </div>

      </div>
    );
  }
}

PowerTable.displayName = 'PowerTable';

PowerTable.defaultProps = {
  fetchMethod: 'GET',
};

PowerTable.propTypes = {
  dataUrl: React.PropTypes.string.isRequired,
  fetchMethod: React.PropTypes.oneOf(['GET', 'POST']),
  fetchParams: React.PropTypes.object,
  groupBy: React.PropTypes.string,
  itensInViewPort: React.PropTypes.number.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};

export default PowerTable;

import React from 'react';
import { findDOMNode } from 'react-dom';
import worker from './fetch.worker';
import update from 'immutability-helper';
import ScrollArea from './ScrollArea';
import ColumnActions from './ColumnActions';
import Paginate from '../paginate/Paginate';

class PowerTable extends React.Component {

  constructor(props){
    super(props);
    this.worker = null;
    this.workerInstace = new Blob(['(' + worker.toString() + ')()'], {
      type: 'text/javascript'
    });
    this.workerReturn = this.workerReturn.bind(this);
    this.distincts = {};
    this.distinctsLoaded = false;
    this.paginate = this.paginate.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.node = null;
    this.before = null;
    this.after = null;
    this.offset = 0;
    this.isScrolling = false;

    this.columns = React.Children.map(props.children, (child) => {
      return {
        title: child.props.columnTitle,
        key: child.props.dataKey,
        formatter: child.props.formatter,
        searchable: child.props.searchable,
      };
    });

    this.state = {collection: [], message: '', count: 0, scrolled: 0};

  }

  componentDidMount() {
    this.worker = new Worker(window.URL.createObjectURL(this.workerInstace));

    this.worker.addEventListener('message', (e) => {
      this.workerReturn(e);
    }, false);

    this.worker.postMessage(
      {
        action: 'LOAD',
        url: 'http://localhost:9000/data_collection-1.1.6.js',
        dataUrl: this.props.dataUrl,
        fetchMethod: this.props.fetchMethod,
        cols: this.columns.map((col) => {
          if(col.key) {
            return {key: col.key, searchable: col.searchable};
          }
        }),
      }
    );

    let ths = [].slice.call(findDOMNode(this).querySelectorAll('.PWT-TableHeader th'));

    for (let i = 0; i < ths.length; i++) {
      ths[i].addEventListener('click', () => {
        if(ths[i].dataset.key) {
          this.showOptions(ths[i].dataset.key);
        }
      });
    }

    this.node = findDOMNode(this);
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  showOptions(key) {
    console.log(key);
  }

  workerReturn(e) {

    const updateMessage = (message) => {
      const newState = update(this.state, {message: {$set: message}});
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
        this.setState({collection: e.data.itens, message: e.data.message, count: e.data.count});
        break;
      case 'PAGINATE':
        this.setState({collection: e.data.itens, message: e.data.message, count: e.data.count});
        break;
      case 'SORT':
        this.setState({collection: e.data.itens, message: e.data.message, count: e.data.count});
        break;
      case 'DISTINCT':
        this.distinctsLoaded = true;
        this.distincts = e.data.itens;
        console.log(this.distincts);
        break;
    }
  }

  paginate(pagerObject) {
    const { currentPage, offset } = pagerObject;
    this.worker.postMessage({ action: 'PAGINATE', currentPage, offset });
  }

  render() {

    let opts = {
      collection: this.state.collection,
      columns: this.columns,
      container: this.node,
      itensInViewPort: this.props.itensInViewPort,
      onScroll: this.paginate,
      rowHeight: this.props.rowHeight,
      totalRecords: this.state.count,
    };

    if(this.isScrolling) {
      opts.afterHeight = (this.props.rowHeight * this.state.count - this.props.rowHeight * this.props.itensInViewPort);
      opts.beforeHeight = this.offset * this.props.rowHeight;
    }

    let scrollableArea = this.state.collection.length ?
      (
        <div>
          <ScrollArea {...opts} />
          <div className='sv-padd-25'>
            <Paginate
              onNextPage={this.paginate}
              onPreviousPage={this.paginate}
              onSelectASpecifPage={this.paginate}
              recordsByPage={16}
              totalSizeOfData={this.state.count}
            />
          </div>
        </div>
      ) : '';

    return (
      <div>
        <p>{this.state.message || ''}</p>
        <div className='PWT-TableHeader' style={{backgroundColor: '#f3f3f3'}}>
          <table className='sv-table with--hover with--grid' style={{tableLayout: 'fixed'}}>
            <thead>
              <tr>
                {this.props.children}
              </tr>
            </thead>
          </table>
        </div>
        <ColumnActions />
        {scrollableArea}
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
  itensInViewPort: React.PropTypes.number.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};

export default PowerTable;

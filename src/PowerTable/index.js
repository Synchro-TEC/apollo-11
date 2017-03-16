import React from 'react';
import { findDOMNode } from 'react-dom';
import worker from './fetch.worker';
import update from 'immutability-helper';
import ScrollArea from './ScrollArea';
import ColumnActions from './ColumnActions';
// import _takeRight from 'lodash.takeright';
// import _take from 'lodash.take';

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
    this.node = null;
    this.before = null;
    this.after = null;
    this.offset = 0;

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
          this.worker.postMessage({ action: 'SORT', value: ths[i].dataset.key });
        }
      });
    }

    this.node = findDOMNode(this);
  }

  componentWillUnmount() {
    this.worker.terminate();
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
        // var itensInCache = this.props.itensInViewPort / 2;
        // var cache = null;
        // var newCollectionWithoutCache = null;
        // var newCollection = null;

        // if(e.data.page === 0) {
        var newCollection = e.data.itens;
        // } else {
        //   if(e.data.direction === 'NEXT') {
        //     cache = _takeRight(this.state.collection, itensInCache);
        // let newCollectionWithoutCache = newCollection.splice(0, this.offset);
        //     newCollection = cache.concat(newCollectionWithoutCache);
        //   } else {
        //     cache = _take(this.state.collection, itensInCache);
        //     newCollectionWithoutCache = _takeRight(e.data.itens, itensInCache);
        //     newCollection = newCollectionWithoutCache.concat(cache);
        //   }
        // }





        this.setState({collection: newCollection, message: e.data.message, count: e.data.count});
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

  paginate(page, offset, scrollTop) {
    this.offset = offset;
    this.worker.postMessage({ action: 'PAGINATE', page, offset });
    const newState = update(this.state, {scrolled: {$set: scrollTop}});
    this.setState(newState);
  }

  render() {

    let scrollableArea = this.state.collection.length ?
      (<ScrollArea
        afterHeight={(this.props.rowHeight * this.state.count - this.props.rowHeight * this.props.itensInViewPort)}
        beforeHeight={this.state.scrolled}
        collection={this.state.collection}
        columns={this.columns}
        container={this.node}
        itensInViewPort={this.props.itensInViewPort}
        onScroll={this.paginate}
        rowHeight={this.props.rowHeight}
        totalRecords={this.state.count}
      />) : '';

    return (
      <div>
        <p>{this.state.message}</p>
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

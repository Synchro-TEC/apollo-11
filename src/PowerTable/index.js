import React from 'react';
import worker from './fetch.worker';
import update from 'immutability-helper';
import ScrollArea from './ScrollArea';
import ColumnActions from './ColumnActions';

class PowerTable extends React.Component {

  constructor(props){
    super(props);
    this.worker = null;
    this.workerInstace = new Blob(['(' + worker.toString() + ')()'], {
      type: 'text/javascript'
    });
    this.workerReturn = this.workerReturn.bind(this);
    this.scroll = this.scroll.bind(this);
    this.distincts = {};
    this.distinctsLoaded = false;

    this.columns = React.Children.map(props.children, (child) => {
      return {
        title: child.props.columnTitle,
        key: child.props.dataKey,
        formatter: child.props.formatter,
        searchable: child.props.searchable,
      };
    });

    this.state = {collection: [], message: '', distincts: []};

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

    // let headerContainer = document.getElementById('tableHeader');
    let ths = [].slice.call(document.querySelectorAll('#tableHeader th'));

    for (let i = 0; i < ths.length; i++) {
      ths[i].addEventListener('click', () => {
        if(ths[i].dataset.key) {
          this.worker.postMessage({ action: 'SORT', value: ths[i].dataset.key });
        }
      });
    }

    // recordsContainer.addEventListener('scroll', _throttle(this.scroll, 1000));

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
      case 'NEXT':
        this.setState({collection: e.data.itens, message: e.data.message, count: e.data.count});
        break;
      case 'PREV':
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



      // let after = document.getElementById('after');
      // after.style.height = `${(this.props.rowHeight * e.data.count) - (this.props.rowHeight * this.props.itensInViewPort)}px`;
  }

  scroll(e) {
    // console.log('Scroll Height', e.target.scrollHeight);
    // console.log('Offset Height', e.target.offsetHeight);
    // console.log('Scroll Top', e.target.scrollTop);
    console.log('Total rodado', e.target.scrollTop + e.target.offsetHeight);

    if(e.target.scrollTop > ((this.props.rowHeight * this.props.itensInViewPort) * 2)) {
      console.log('PAGE');
      this.worker.postMessage({ action: 'PAGINATE_NEXT' });
    }

  }

  next() {
    this.worker.postMessage({ action: 'PAGINATE_NEXT' });
  }

  prev() {
    this.worker.postMessage({ action: 'PAGINATE_PREV' });
  }

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <span className='sv-bar-loader large' />
        <p>
          <button className='sv-button primary' onClick={()=> this.prev()} type='button'>Prev</button>
          <button className='sv-button primary' onClick={()=> this.next()} type='button'>Next</button>
        </p>

        <div id='tableHeader'>
          <table className='sv-table with--hover with--grid' style={{tableLayout: 'fixed'}}>
            <thead>
              <tr>
                {this.props.children}
              </tr>
            </thead>
          </table>
        </div>
        <ColumnActions  />
        <ScrollArea
          collection={this.state.collection}
          columns={this.columns}
          itensInViewPort={this.props.itensInViewPort}
          rowHeight={this.props.rowHeight}
        />

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

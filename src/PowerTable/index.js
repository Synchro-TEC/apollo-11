import React from 'react';
import worker from './fetch.worker';
// import DataCollection from 'data-collection';
import update from 'immutability-helper';

class PowerTable extends React.Component {

  constructor(props){
    super(props);
    this.worker = null;
    this.workerInstace = new Blob(['(' + worker.toString() + ')()'], {
      type: 'text/javascript'
    });
    this.workerReturn = this.workerReturn.bind(this);
    this.collection = null;

    this.columns = React.Children.map(props.children, (child) => {
      return { title: child.props.columnTitle, key: child.props.dataKey, formatter: child.props.formatter };
    });

    this.state = {collection: [], message: ''};

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
        fetchMethod: this.props.fetchMethod
      }
    );
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  workerReturn(e) {
    if(typeof e.data === 'string') {
      const newState = update(this.state, {message: {$set: e.data}});
      this.setState(newState);
    } else {
      this.setState({collection: e.data, message: 'Dados carregados!'});
    }
  }

  next() {
    this.worker.postMessage({ action: 'PAGINATE_NEXT' });
  }

  prev() {
    this.worker.postMessage({ action: 'PAGINATE_PREV' });
  }

  sort() {
    this.worker.postMessage({ action: 'SORT' });
  }

  render() {

    let result = this.state.collection.map((row, i) => {
      return (
        <tr key={i}>
          { this.columns.map((col, j) => {
            let rendered = col.key ? row[col.key] : col.formatter(row);
            return <td key={`${i}${j}`}>{rendered}</td> })
          }
        </tr>
      );
    });

    return (
      <div>
        <p>{this.state.message}</p>

        <p>
          <button className='sv-button primary' onClick={()=> this.prev()} type='button'>Prev</button>
          <button className='sv-button primary' onClick={()=> this.next()} type='button'>Next</button>
          <button className='sv-button info' onClick={()=> this.sort()} type='button'>Sort</button>
        </p>

        <table className='sv-table with--borders with--hover'>
          <thead>
          <tr>
            {this.props.children}
          </tr>
          </thead>
          <tbody>
            {result}
          </tbody>
        </table>
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
};

export default PowerTable;

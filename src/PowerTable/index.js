import React from 'react';
import worker from './fetch.worker';
// import DataCollection from 'data-collection';
import update from 'immutability-helper';
import _throttle from 'lodash.throttle';

class PowerTable extends React.Component {

  constructor(props){
    super(props);
    this.worker = null;
    this.workerInstace = new Blob(['(' + worker.toString() + ')()'], {
      type: 'text/javascript'
    });
    this.workerReturn = this.workerReturn.bind(this);
    this.scroll = this.scroll.bind(this);
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

    let recordsContainer = document.getElementById('scroll');

    recordsContainer.addEventListener('scroll', _throttle(this.scroll, 1000));

  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  workerReturn(e) {
    if(typeof e.data === 'string') {
      const newState = update(this.state, {message: {$set: e.data}});
      this.setState(newState);
    } else {
      this.setState({collection: e.data.itens, message: 'Dados carregados!'});
      console.log('TOTAL', e.data.count);
      let after = document.getElementById('after');
      after.style.height = `${(this.props.rowHeight * e.data.count) - (this.props.rowHeight * this.props.itensInViewPort)}px`;

    }
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

  sort() {
    this.worker.postMessage({ action: 'SORT' });
  }

  render() {

    let result = this.state.collection.map((row, i) => {
      return (
        <tr key={i}>
          { this.columns.map((col, j) => {
            let rendered = col.key ? row[col.key] : col.formatter(row);

            let style = {textAlign: 'left', borderRight: '1px solid #dadada'};
            if(j === 0 ) {
              style.borderLeft = '1px solid #dadada';
            }

            return (<td key={`${i}${j}`} style={style}>{rendered}</td>); })
          }
        </tr>
      );
    });

    let ths = this.columns.map((col, i) => {
      let style = {textAlign: 'left', borderRight: '1px solid #dadada'};
      if(i === 0 ) {
        style.borderLeft = '1px solid #dadada';
      }

      return (<th key={`th-${i}`} style={style}>{col.title}</th>);
    });

    return (
      <div>
        <p>{this.state.message}</p>

        <p>
          <button className='sv-button primary' onClick={()=> this.prev()} type='button'>Prev</button>
          <button className='sv-button primary' onClick={()=> this.next()} type='button'>Next</button>
          <button className='sv-button info' onClick={()=> this.sort()} type='button'>Sort</button>
        </p>

        <div>
          <table className='sv-table with--borders with--hover' style={{tableLayout: 'fixed'}}>
            <thead>
            <tr>
              {ths}
            </tr>
            </thead>
          </table>
        </div>

        <div id='scroll'
             style={{
               display: 'block',
               height: (this.props.itensInViewPort * this.props.rowHeight),
               overflow: 'auto',
               marginTop: '-31px',
             }}>
          <table className='sv-table with--borders with--hover' style={{tableLayout: 'fixed', marginBottom: '0px'}}>
            <tbody>
              {result}
            </tbody>
          </table>
          <div id='after' />
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
  itensInViewPort: React.PropTypes.number.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};

export default PowerTable;

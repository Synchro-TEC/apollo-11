import React from 'react';
import loki from 'lokijs';
import worker from './worker';

class PowerTable extends React.Component {
  constructor(props){
    super(props);
    this.worker = null;
    this.workerInstace = new Blob(['(' + worker.toString() + ')()'], {
      type: 'text/javascript'
    });
    debugger;
    this.db = new loki.LokiLocalStorageAdapter('powerTable');
    this.workerReturn = this.workerReturn.bind(this);
  }

  componentDidMount() {
    this.worker = new Worker(window.URL.createObjectURL(this.workerInstace));
    this.worker.addEventListener('message', (e) => {
      this.workerReturn(e);
    }, false);
    debugger;
    this.worker.postMessage({dataUrl: this.props.dataUrl, fetchMethod: this.props.fetchMethod, db: this.db});
  }

  componentWillUnmount() {
  }

  workerReturn(e) {
    console.log(e.data);
  }

  render() {
    return (
      <div>
        Power Table
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

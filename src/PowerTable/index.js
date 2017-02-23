import React from 'react';

let MyWorker = require("worker!./worker.js");

class PowerTable extends React.Component {
  constructor(props){
    super(props);
    this.worker = new MyWorker();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>

      </div>
    );
  }

}

PowerTable.displayName = 'PowerTable';

PowerTable.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default PowerTable;

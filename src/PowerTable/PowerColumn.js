import React from 'react'

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return <th>{this.props.columnTitle}</th>
  }

}

PowerColumn.displayName = 'PowerColumn';

PowerColumn.propTypes = {
  columnTitle: React.PropTypes.string.isRequired,
  dataKey: React.PropTypes.string,
  formatter: React.PropTypes.func,
};

export default PowerColumn;
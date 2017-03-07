import React from 'react';

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {actionIsVisible: false};
  }

  render() {
    return (
      <th data-key={this.props.dataKey}>
        {this.props.columnTitle}
      </th>
    );
  }

}

PowerColumn.displayName = 'PowerColumn';

PowerColumn.defaultProps = {
  searchable: false,
};

PowerColumn.propTypes = {
  columnTitle: React.PropTypes.string.isRequired,
  dataKey: React.PropTypes.string,
  formatter: React.PropTypes.func,
  searchable: React.PropTypes.bool,
};

export default PowerColumn;

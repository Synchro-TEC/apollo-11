import React from 'react';
import ColumnActions from './ColumnActions';

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {actionIsVisible: false};
  }

  toggle() {
    this.setState({actionIsVisible: !this.state.actionIsVisible});
  }

  render() {
    return (
      <th data-key={this.props.dataKey} onClick={() => this.toggle()}>
        {this.props.columnTitle}
        <ColumnActions dataKey={this.props.dataKey} isVisible={this.state.actionIsVisible} onSearch={this.props.onSearch}  />
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
  onSearch: React.PropTypes.func,
  searchable: React.PropTypes.bool,
  uniqueValues: React.PropTypes.any,
};

export default PowerColumn;

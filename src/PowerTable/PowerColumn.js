import React from 'react';
import ColumnActions from './ColumnActions';

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);

    this.renderFilter = this.renderFilter.bind(this);
    this.renderSort = this.renderSort.bind(this);
    this.state = {actionIsVisible: false};
  }

  toggle() {
    this.setState({actionIsVisible: !this.state.actionIsVisible});
  }

  renderFilter() {
    let result = '';
    let colName = this.props.dataType === 'numeric' ? this.props.dataKey : `${this.props.dataKey}__icontains`;
    if(this.props.dataKey && this.props.filters[colName]) {
      result = (<div className='sv-pull-right'><i className='fa fa-filter fa-fw' title={this.props.filters[colName]} /></div>);
    }
    return result;
  }

  renderSort() {
    let cssClass = 'fa fa-fw';
    if(this.props.dataKey && this.props.sorts.hasOwnProperty(this.props.dataKey)){
      cssClass += this.props.sorts[this.props.dataKey] ? ' fa-sort-amount-desc' : ' fa-sort-amount-asc';
    }
    return (<div className='sv-pull-right'><i className={cssClass} /></div>);
  }

  render() {
    return (
      <th data-key={this.props.dataKey} onClick={() => this.toggle()}>
        {this.props.columnTitle}
        <ColumnActions
          dataKey={this.props.dataKey}
          dataType={this.props.dataType}
          isVisible={this.state.actionIsVisible}
          onSearch={this.props.onSearch}
          onSort={this.props.onSort}
        />
        {this.renderFilter()}
        {this.renderSort()}
      </th>
    );
  }

}

PowerColumn.displayName = 'PowerColumn';

PowerColumn.defaultProps = {
  dataType: 'text',
  searchable: false,
};

PowerColumn.propTypes = {
  columnTitle: React.PropTypes.string.isRequired,
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.oneOf(['numeric', 'text', 'date']),
  filters: React.PropTypes.object,
  formatter: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onSort: React.PropTypes.func,
  searchable: React.PropTypes.bool,
  sorts: React.PropTypes.object,
  uniqueValues: React.PropTypes.any,
};

export default PowerColumn;

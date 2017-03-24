import React from 'react';
import ColumnActions from './ColumnActions';

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);

    this.renderFilter = this.renderFilter.bind(this);
    this.renderSort = this.renderSort.bind(this);
    this.setColumn = this.setColumn.bind(this);

  }

  setColumn() {
    this.props.onSelect(this.props.dataKey);
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
      cssClass += this.props.sorts[this.props.dataKey] ? ' fa-sort-alpha-desc' : ' fa-sort-alpha-asc';
    }
    return (<div className='sv-pull-right'><i className={cssClass} /></div>);
  }

  render() {

    let result;

    if(this.props.dataKey) {
      result = (
        <th>
          {this.props.columnTitle}
          <div className='sv-pull-right' >
            <i className='fa fa-fw fa-caret-square-o-down' onClick={() => this.setColumn()} style={{cursor: 'pointer'}} />
          </div>
          {this.renderSort()}
          <ColumnActions
            columnTitle={this.props.columnTitle}
            dataKey={this.props.dataKey}
            isVisible={this.props.dataKey === this.props.activeColumn}

            onClose={this.props.onSelect}
            onFilterDistinct={this.props.onFilterDistinct}
            onSort={this.props.onSort}
            searchable={this.props.searchable}
            uniqueValues={this.props.uniqueValues}
          />
        </th>
      );
    } else {
      result = (
        <th>
          {this.props.columnTitle}
        </th>
      );
    }

    return result;
  }

}

PowerColumn.displayName = 'PowerColumn';

PowerColumn.defaultProps = {
  dataType: 'text',
  searchable: false,
};

PowerColumn.propTypes = {
  activeColumn: React.PropTypes.string,
  columnTitle: React.PropTypes.string.isRequired,
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.oneOf(['numeric', 'text', 'date']),
  filters: React.PropTypes.object,
  formatter: React.PropTypes.func,
  onFilterDistinct: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onSetColumn: React.PropTypes.func,
  onSort: React.PropTypes.func,
  searchable: React.PropTypes.bool,
  sorts: React.PropTypes.object,
  uniqueValues: React.PropTypes.any,
};

export default PowerColumn;

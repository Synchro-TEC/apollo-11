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

    if(this.props.dataKey ) {
      if(this.props.filters[this.props.dataKey] || this.props.filtersByConditions[this.props.dataKey]){
        result = (<div className='sv-pull-right'><i className='fa fa-filter fa-fw' title={this.props.filters[this.props.dataKey]} /></div>);
      }
    }

    return result;
  }

  renderSort() {
    let rendered = '';

    let cssClass = 'fa fa-fw';
    if(this.props.dataKey && this.props.sorts.hasOwnProperty(this.props.dataKey)){
      if(this.props.dataType === 'text') {
        cssClass += this.props.sorts[this.props.dataKey] ? ' fa-sort-alpha-desc' : ' fa-sort-alpha-asc';
      } else {
        cssClass += this.props.sorts[this.props.dataKey] ? ' fa-sort-numeric-desc' : ' fa-sort-numeric-asc';
      }
      rendered = (<div className='sv-pull-right'><i className={cssClass} /></div>);
    }
    return rendered;
  }

  render() {

    let result;

    if(this.props.dataKey) {
      result = (
        <th>
          {this.props.columnTitle}
          <div className='sv-pull-right'>
            <i className='fa fa-fw fa-caret-square-o-down' onClick={() => this.setColumn()} style={{cursor: 'pointer'}} />
          </div>
          {this.renderSort()}
          {this.renderFilter()}
          <ColumnActions
            columnTitle={this.props.columnTitle}
            dataKey={this.props.dataKey}
            dataType={this.props.dataType}
            distinctFilters={this.props.distinctFilters}
            isVisible={this.props.dataKey === this.props.activeColumn}
            onAddToFilterDistinct={this.props.onAddToFilterDistinct}
            onApplyFilter={this.props.onApplyFilter}
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
  distinctFilters: React.PropTypes.object,
  filters: React.PropTypes.object,
  filtersByConditions: React.PropTypes.object,
  formatter: React.PropTypes.func,
  onAddToFilterDistinct: React.PropTypes.func,
  onApplyFilter: React.PropTypes.func,
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

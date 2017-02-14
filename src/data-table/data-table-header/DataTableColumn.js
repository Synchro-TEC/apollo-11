import React from 'react';
import ReactDOM from 'react-dom';
import _isObject from 'lodash/isObject';
import _isUndefined from 'lodash/isUndefined';
import _uniqueId from 'lodash/uniqueId';
import _eq from 'lodash/eq';

class DataTableColumn extends React.Component {

  constructor(props) {
    super(props);
  }

  onSort() {
    this.props.setSortColumn(this.props.dataKey);
  }

  render() {
    let {children, sortable, direction} = this.props;
    let dataColumnLabel = '';
    let directionOfSortClassName;
    let sortIcon = '';

    switch (direction) {
      case 'asc':
        directionOfSortClassName = 'fa fa-sort-asc sv-sort is--active';
        break;

      case 'desc':
        directionOfSortClassName = 'fa fa-sort-desc sv-sort is--active';
        break;

      default:
        directionOfSortClassName = 'fa fa-sort sv-sort';
    }

    if(!_isUndefined(children)) {
      for(let i = 0; i<children.length; i++) {
        if(!_isObject(children[i])) {
          dataColumnLabel = children;
        }
      }
    }

    if(sortable) {
      sortIcon = <i className={directionOfSortClassName}/>
    }

    return (
      <th onClick={(e) => this.onSort(e)}>
        {sortIcon}
        {dataColumnLabel}
      </th>
    );
  }
}

DataTableColumn.propTypes = {
  dataKey: React.PropTypes.string.isRequired,
  sortable: React.PropTypes.bool,
};

export default DataTableColumn;

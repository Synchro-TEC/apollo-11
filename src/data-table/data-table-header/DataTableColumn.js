import React from 'react';
import _isObject from 'lodash/isObject';
import _isUndefined from 'lodash/isUndefined';
import classNames from 'classnames';

class DataTableColumn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {direction: ''};
  }

  onSort() {
    let executeSort;
    
    if(this.props.onSort) {
      executeSort = () => {
        let sortInfo = {};
        sortInfo.columnKey = this.props.dataKey;
        sortInfo.direction = this.state.direction;
        this.props.onSort(sortInfo);
      }
    }

    if(this.state.direction === 'desc' || this.state.direction === '') {
      this.setState({direction: 'asc'}, executeSort);
    } else {
      this.setState({direction: 'desc'}, executeSort);
    }
  }

  render() {
    let {children, sortable} = this.props;
    let dataColumnLabel = '';
    let directionOfSortClassName;
    let sortIcon = '';

    if(this.state.direction === 'asc') {
      directionOfSortClassName = 'fa fa-sort-asc sv-sort is--active';
    } else if (this.state.direction === 'desc'){
      directionOfSortClassName = 'fa fa-sort-desc sv-sort is--active';
    } else {
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
      sortIcon = <i onClick={() => this.onSort()} className={directionOfSortClassName}/>
    }

    return (
      <th>
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

import React from 'react';
import _isObject from 'lodash/isObject';
import _isUndefined from 'lodash/isUndefined';

class DataTableColumn extends React.Component {
  render() {
    let {children, sortable} = this.props;
    let dataColumnLabel = '';
    let sortIcon = '';

    if(!_isUndefined(children)) {
      for(let i = 0; i<children.length; i++) {
        if(!_isObject(children[i])) {
          dataColumnLabel = children;
        }
      }
    }

    if(sortable) {
      sortIcon = <i onClick={() => this.onSort()} className='fa fa-sort sv-sort'/>
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
  dataKey: React.PropTypes.string.isRequired
};

export default DataTableColumn;

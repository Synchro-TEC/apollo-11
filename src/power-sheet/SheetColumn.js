import React from 'react';
import PropTypes from 'prop-types';

class SheetColumn extends React.Component {

  constructor(props) {
    super(props);

    this.renderFilter = this.renderFilter.bind(this);
    this.renderSort = this.renderSort.bind(this);
    this.setColumn = this.setColumn.bind(this);
  }


  setColumn(e) {
    this.props.onSelect(this.props.dataKey, this.props.dataType, this.props.columnTitle, e);
  }

  renderFilter() {
    let result = '';
    if(this.props.filterKeys.includes(this.props.dataKey)) {
      result = (<i className='fa fa-filter fa-fw' />);
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
      rendered = (<i className={cssClass} />);
    }
    return rendered;
  }

  render() {
    let result;
    let style = {};

    if(this.props.width) {
      style.flex = `0 0 ${this.props.width}px`;
    }

    if(this.props.dataKey) {
      result = (
        <div className='pw-table-header-cell' style={style}>
          {this.props.columnTitle}
          {this.renderSort()}
          {this.renderFilter()}
          <i
            className='fa fa-fw fa-caret-square-o-down'
            onClick={(e) => this.setColumn(e)}
            style={{cursor: 'pointer', marginLeft: '8px'}}
          />
        </div>
      );
    } else {
      result = (
        <div className='pw-table-header-cell' style={style}>
          {this.props.columnTitle}
        </div>
      );
    }

    return result;
  }

}

SheetColumn.displayName = 'SheetColumn';

SheetColumn.defaultProps = {
  dataType: 'text',
  searchable: false,
  groupBy: false
};

SheetColumn.propTypes = {
  activeColumn: PropTypes.string,
  columnTitle: PropTypes.string.isRequired,
  dataKey: PropTypes.string,
  dataType: PropTypes.oneOf(['numeric', 'text', 'date']),
  filterKeys: PropTypes.array,
  filtersByConditions: PropTypes.object,
  formatterOnFilter: PropTypes.func,
  onSelect: PropTypes.func,
  selectedDistinctFilters: PropTypes.array,
  sorts: PropTypes.object,
  width: PropTypes.number,
};

export default SheetColumn;

import React from 'react';
import PropTypes from 'prop-types';
import ColumnActions from './ColumnActions';

class SheetColumn extends React.Component {

  constructor(props) {
    super(props);

    this.renderFilter = this.renderFilter.bind(this);
    this.renderSort = this.renderSort.bind(this);
    this.setColumn = this.setColumn.bind(this);

    this.propsToSend = this._preparePropsToSend(props);
  }

  componentWillReceiveProps(nextProps) {
    this.propsToSend = this._preparePropsToSend(nextProps);
  }

  setColumn(e) {
    this.props.onSelect(this.props.dataKey, this.props.dataType, this.props.columnTitle, e);
  }

  renderFilter() {
    let result = '';

    // if(this.props.dataKey ) {
    //   if(this.props.filters[this.props.dataKey] || this.props.filtersByConditions[this.props.dataKey]){
    //     result = (<i className='fa fa-filter fa-fw' title={this.props.filters[this.props.dataKey]} />);
    //   }
    // }

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

  _preparePropsToSend(props) {
    let theProps = Object.assign({}, props);

    theProps.isVisible = props.dataKey === props.activeColumn;

    delete theProps.activeColumn;
    delete theProps.filters;
    delete theProps.filtersByConditions;
    delete theProps.formatter;
    delete theProps.sorts;
    delete theProps.onSetColumn;

    return theProps;
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

          {/*<ColumnActions {...this.propsToSend}  />*/}
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
  distinctFilters: PropTypes.object,
  filters: PropTypes.object,
  filtersByConditions: PropTypes.object,
  formatter: PropTypes.func,
  formatterOnFilter: PropTypes.func,
  groupBy: PropTypes.bool,
  onAddToFilterDistinct: PropTypes.func,
  onApplyFilter: PropTypes.func,
  onFilterDistinct: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  onSetColumn: PropTypes.func,
  onSort: PropTypes.func,
  searchable: PropTypes.bool,
  sorts: PropTypes.object,
  distinctsLimited: PropTypes.any,
  distinctFiltersValue: PropTypes.any,
  width: PropTypes.number,
};

export default SheetColumn;

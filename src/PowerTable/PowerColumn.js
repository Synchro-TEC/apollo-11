import React from 'react';

class PowerColumn extends React.Component {

  constructor(props) {
    super(props);

    this.renderFilter = this.renderFilter.bind(this);
    this.renderSort = this.renderSort.bind(this);
    this.state = {actionIsVisible: false};
  }

  toggle(e) {
    this.props.onSelect(e, this.props.dataKey);
    // let otherActions = [].slice.call(
    //                       this
    //                       .props
    //                       .container
    //                       .querySelectorAll(`th:not([data-title="${this.props.columnTitle}"]) .pwt-actions`));
    //
    // for (let i = 0; i < otherActions.length; i++ ) {
    //   otherActions[i].style.display = 'none';
    // }
    //
    // this.setState({actionIsVisible: !this.state.actionIsVisible});
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
      <th data-key={this.props.dataKey} data-title={this.props.columnTitle} onClick={(e) => this.toggle(e)}>
        {this.props.columnTitle}
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
  container: React.PropTypes.any,
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.oneOf(['numeric', 'text', 'date']),
  filters: React.PropTypes.object,
  formatter: React.PropTypes.func,
  onSearch: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onSort: React.PropTypes.func,
  searchable: React.PropTypes.bool,
  sorts: React.PropTypes.object,
  uniqueValues: React.PropTypes.any,

};

export default PowerColumn;

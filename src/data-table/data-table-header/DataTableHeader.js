import React from 'react';
import _uniqueId from 'lodash/uniqueId';

class DataTableHeader extends React.Component {

  constructor(props){
    super(props);
    this.state = {beingSorted: {columnKey: '', direction: ''}};
    this.setSortColumn = this.setSortColumn.bind(this);
    this.renderWithProps = this.renderWithProps.bind(this);
  }

  setSortColumn(dataKey) {
    let newState = {columnKey: dataKey, direction: ''};

    if(this.state.beingSorted.columnKey === '' || this.state.beingSorted.columnKey !== dataKey) {
      newState.direction = 'asc';
    } else if(this.state.beingSorted.columnKey === dataKey) {
      if(this.state.beingSorted.direction === 'asc') {
        newState.direction = 'desc';
      } else {
        newState.direction = 'asc';
      }
    }

    this.setState({beingSorted: newState}, () => {
      if(this.props.onSort) {
        this.props.onSort(this.state.beingSorted)
      } else {
        console.warn('When a column is sortable you need to pass a callback function to DataTable component.');
      }
    });
  }

  /**
   * renderWithProps - description
   * Renderiza os filhos do DataTableHeader, que são DataTableColumns
   * configurados pelo usuário, recuperando a função onSort recebida como prop
   * para que cada filho possa executá-la, essa propriedade (onSort) é uma exposição da
   * função onSort do componente DataTable
   * @return {object}
   */
  renderWithProps() {
    if(Array.isArray(this.props.children)) {
      return this.props.children.map((child, i) => {
        if(child.props.dataKey === this.state.beingSorted.columnKey) {
          return React.cloneElement(child,
            {onSort: this.props.onSort,
             key: `headerCell-${i}`,
             setSortColumn: this.setSortColumn,
             direction: this.state.beingSorted.direction}
          );
        } else {
          return React.cloneElement(child,
            {onSort: this.props.onSort,
             key: `headerCell-${i}`,
             setSortColumn: this.setSortColumn}
          );
        }
      });
    } else {
      return React.cloneElement(this.props.children,
        {onSort: this.props.onSort,
         key: _uniqueId('headerCell-'),
         setSortColumn: this.setSortColumn,
         direction: this.state.beingSorted.direction}
      );
    }
  }

  render() {
    return (
      <thead>
        <tr>{this.renderWithProps()}</tr>
      </thead>
    );
  }
}

export default DataTableHeader;

import React from 'react';
import _uniqueId from 'lodash/uniqueId';

class DataTableHeader extends React.Component {

  constructor(props){
    super(props);
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
        let clone = React.cloneElement(
          child, {onSort: this.props.onSort, key: `headerCell-${i}`}
        );
        return clone;
      });
    } else {
      return React.cloneElement(
        this.props.children, {onSort: this.props.onSort, key: _uniqueId('headerCell-')}
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

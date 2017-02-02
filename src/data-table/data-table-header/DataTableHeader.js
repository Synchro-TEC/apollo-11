import React from 'react';

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
    return this.props.children.map((child, i) => {
      let clone = React.cloneElement(
        child, {onSort: this.props.onSort, key: `headerCell-${i}`}
      );
      return clone;
    });
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

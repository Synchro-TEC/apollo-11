import React from 'react';

class Paginate extends React.Component {

  constructor(props) {
    super(props);
    this.numberOfRecordsForPage = 10;
    this.state = {
      currentPage: 1,
      totalOfPieces: Math.ceil(this.props.gridData.length/this.numberOfRecordsForPage)
    };
  }

  nextPage() {
    if(this.state.currentPage < this.state.totalOfPieces) {
      this.setState({ currentPage: this.state.currentPage + 1 });
    }
    let startOfSlice = this.state.currentPage * this.numberOfRecordsForPage;
    let endOfSlice = this.state.totalOfPieces * this.numberOfRecordsForPage;
    this.props.onNextPage(
      this.props.gridData.slice(startOfSlice, endOfSlice)
    );
  }

  previousPage() {
    if(this.state.currentPage > 1) {
      this.setState({ currentPage: this.state.currentPage - 1 });
    }
  }

  render() {
    return (
      <tfoot>
        <tr>
          <td className='sv-text-center' colSpan='8'>
            <button className='sv-button link link-info'>
              <i className='fa fa-angle-double-left fa-fw' />
              Primeiro
            </button>
            <button className='sv-button link link-info' onClick={() => this.previousPage()}>
              <i className='fa fa-angle-left fa-fw'/>
              Anterior
            </button>
            <span>
              {this.state.currentPage} de
              {' ' + this.state.totalOfPieces}
              {this.state.totalOfPieces > 1 ? ' páginas': ' página'}
            </span>
            <button className='sv-button link link-info' onClick={() => this.nextPage()}>
              Próximo
              <i className='fa fa-angle-right fa-fw'/>
            </button>
            <button className='sv-button link link-info'>
              Último
              <i className='fa fa-angle-double-right fa-fw' />
            </button>
          </td>
        </tr>
      </tfoot>
    );
  }
}

Paginate.propTypes = {
  gridData: React.PropTypes.array.isRequired,
  onNextPage: React.PropTypes.func
};

export default Paginate;
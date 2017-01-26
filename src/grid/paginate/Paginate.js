import React from 'react';

class Paginate extends React.Component {

  constructor(props) {
    super(props);
    this.numberOfRecordsForPage = 10;
    this.currentPage = 1;
    this.totalOfPieces = Math.ceil(this.props.totalSizeOfData/this.numberOfRecordsForPage);
  }

  /**
   * Monta um objeto com informações do paginate que são importantes para quem o usa
   * @returns {{}}
   */
  mountPaginateInformation() {
    let paginateInformation = {};
    paginateInformation.currentPage = this.currentPage;
    paginateInformation.totalOfPieces = this.totalOfPieces;
    paginateInformation.numberOfRecordsForPage = this.numberOfRecordsForPage;
    return paginateInformation;
  }

  nextPage() {
    if(this.currentPage < this.totalOfPieces) {
      this.currentPage += 1;
    }
    this.props.onNextPage(this.mountPaginateInformation());
  }

  previousPage() {
    if(this.currentPage > 1) {
      this.currentPage -= 1;
    }
    this.props.onPreviousPage(this.mountPaginateInformation());
  }

  lastPage() {
    if(this.currentPage < this.totalOfPieces) {
      this.currentPage = this.totalOfPieces;
    }
    this.props.onLastPage(this.mountPaginateInformation());
  }

  firstPage() {
    if(this.currentPage > 1) {
      this.currentPage = 1;
    }
    this.props.onFirstPage(this.mountPaginateInformation());
  }

  render() {
    return (
      <tfoot>
        <tr>
          <td className='sv-text-center' colSpan='8'>
            <button className='sv-button link link-info' onClick={() => this.firstPage()}>
              <i className='fa fa-angle-double-left fa-fw' />
              Primeiro
            </button>
            <button className='sv-button link link-info' onClick={() => this.previousPage()}>
              <i className='fa fa-angle-left fa-fw'/>
              Anterior
            </button>
            <span>
              {this.currentPage} de
              {' ' + this.totalOfPieces}
              {this.totalOfPieces > 1 ? ' páginas': ' página'}
            </span>
            <button className='sv-button link link-info' onClick={() => this.nextPage()}>
              Próximo
              <i className='fa fa-angle-right fa-fw'/>
            </button>
            <button className='sv-button link link-info' onClick={() => this.lastPage()}>
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
  onFirstPage: React.PropTypes.func,
  onLastPage: React.PropTypes.func,
  onNextPage: React.PropTypes.func,
  onPreviousPage: React.PropTypes.func,
  totalSizeOfData: React.PropTypes.number
};

export default Paginate;
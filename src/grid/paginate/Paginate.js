import React from 'react';
import PaginateStyles from './PaginateStyles';
import _uniqueId from 'lodash/uniqueId';

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

  specifPage(e) {
    this.currentPage = parseInt(e.target.textContent);
    this.props.onChooseASpecifPage(this.mountPaginateInformation());
  }

  colorPaginationOptionIfNeeded(i) {
    let option = {};
    if(this.currentPage === i) {
      option = (
        <li key={i} style={PaginateStyles.options}>
          <button className='sv-button link link-info'
                  onClick={(e) => this.specifPage(e)}
                  style={{fontWeight: 'bold', color: '#455a64'}}> {i} </button>
        </li>
      );
    } else {
      option = (
        <li key={i} style={PaginateStyles.options}>
          <button
            className='sv-button link link-info'
            onClick={(e) => this.specifPage(e)}> {i} </button>
        </li>
      );
    }
    return option;
  }

  colorPaginationOptionAndPutGapIfNeeded(i) {
    let option = {};

    if(i === '...') {
      option = (
        <li key={_uniqueId()} style={PaginateStyles.gapOption}>
          <span style={PaginateStyles.gap}>{i}</span>
        </li>
      );
    } else {
      if(this.currentPage === i) {
        option = (
          <li key={i} style={PaginateStyles.options}>
            <button className='sv-button link link-info'
                    onClick={(e) => this.specifPage(e)}
                    style={{fontWeight: 'bold', color: '#455a64'}}> {i} </button>
          </li>
        );
      } else {
        option = (
          <li key={i} style={PaginateStyles.options}>
            <button
              className='sv-button link link-info'
              onClick={(e) => this.specifPage(e)}> {i} </button>
          </li>
        );
      }
    }

    return option;
  }

  render() {
    let paginationOptions = [];

    if(this.totalOfPieces <= 10) {
      for(let i = this.totalOfPieces - 2; i>=1; i--) {
        paginationOptions.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
    } else if((this.totalOfPieces - this.currentPage) <= 2) {
      debugger;
      for(let i = 1; i<=2; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      for(let i = this.totalOfPieces - 4; i<= this.totalOfPieces - 2; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
    } else if((this.totalOfPieces - this.currentPage) <= 5) {
      for(let i = 1; i<=2; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      for(let i = this.currentPage - 2; i<= this.totalOfPieces - 2; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
    } else if(this.currentPage - 1 >= 6) {
      for(let i = 1; i<=2; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      for(let i = 2; i>=-2; i--) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(this.currentPage -i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
    } else if(this.currentPage <= 6 && this.currentPage >= 3) {
      for(let i = this.currentPage + 2; i>=1; i--) {
        paginationOptions.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
    } else if (this.currentPage <= 2){
      for(let i = 1; i<=5; i++) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
    }

    //Sempre coloca as duas ultimas paginas no array de opções
    for(let i = 1; i>=0; i--) {
      paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces-i));
    }

    return (
      <ul style={PaginateStyles.list}>
        <li style={PaginateStyles.options}>
          <button className='sv-button link link-info' onClick={() => this.firstPage()}>
            <i className='fa fa-angle-double-left fa-fw' />
            Primeiro
          </button>
        </li>
        <li style={PaginateStyles.options}>
          <button className='sv-button link link-info' onClick={() => this.previousPage()}>
            Anterior
          </button>
        </li>
        {paginationOptions}
        <li style={PaginateStyles.options}>
          <button className='sv-button link link-info' onClick={() => this.nextPage()}>
            Próximo
          </button>
        </li>
        <li style={PaginateStyles.options}>
          <button className='sv-button link link-info' onClick={() => this.lastPage()}>
            Último
            <i className='fa fa-angle-double-right fa-fw' />
          </button>
        </li>
      </ul>
    );
  }
}

Paginate.propTypes = {
  gridData: React.PropTypes.array.isRequired,
  onChooseASpecifPage:React.PropTypes.func,
  onFirstPage: React.PropTypes.func,
  onLastPage: React.PropTypes.func,
  onNextPage: React.PropTypes.func,
  onPreviousPage: React.PropTypes.func,
  totalSizeOfData: React.PropTypes.number
};

export default Paginate;
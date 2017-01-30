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
   * Monta um objeto com informações do paginate que são importantes para quem usa
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
          <li key={_uniqueId()} style={PaginateStyles.options}>
            <button className='sv-button link link-info'
                    onClick={(e) => this.specifPage(e)}
                    style={PaginateStyles.optionSelected}> {i} </button>
          </li>
        );
      } else {
        option = (
          <li key={_uniqueId()} style={PaginateStyles.options}>
            <button
              className='sv-button link link-info'
              onClick={(e) => this.specifPage(e)}> {i} </button>
          </li>
        );
      }
    }

    return option;
  }

  getGap() {
    return this.colorPaginationOptionAndPutGapIfNeeded('...')
  }

  createInitialOptionPages() {
    let initialPages = [];

    if(this.totalOfPieces >= 2) {
      for(let i = 1; i<=2; i++) {
        initialPages.push(
          this.colorPaginationOptionAndPutGapIfNeeded(i)
        );
      }
    } else {
      initialPages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces));
    }

    return initialPages;
  }

  createMiddleOptionPages() {
    let middlePages = [];

    if(this.totalOfPieces <= 10) {
  	  for(let i = this.totalOfPieces - 2; i>=3; i--) {
  	    middlePages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
  	  }
    } else if((this.totalOfPieces - this.currentPage) <= 2) {
      // Se faltam apenas 2 a frente, é preciso manter o terceiro numero atrás
      // (let i = this.totalOfPieces - 4)
      middlePages.push(this.getGap());
      for(let i = this.totalOfPieces - 4; i<= this.totalOfPieces - 2; i++) {
         middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
	  } else if((this.totalOfPieces-this.currentPage) <= 5) {
	   // Se ainda faltam mais de dois numeros a frente nao e
     // preciso manter 3 numeros atras (let i = this.currentPage - 2)
	   for(let i = this.currentPage - 2; i<=this.totalOfPieces-2; i++) {
	     middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
	   }
	   middlePages.unshift(this.getGap());
	 } else if (this.currentPage <= 2) {
	   // Sempre entra aqui ao carregar a pagina, ou quando o usuario volta
	   // para a primeira pagina, gera as 4 opcoes a frente
	   for(let i = 3; i<=5; i++) {
	     middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
	   }
     middlePages.push(this.getGap());
	  } else if(this.currentPage <= 6 && this.currentPage >= 3) {
	    //Mantem as opcoes de paginacao, sempre duas a frente da selecionada
	    for(let i = this.currentPage + 2; i>=3; i--) {
        middlePages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
	    }
	    middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
	  } else if(this.currentPage - 1 >= 6) {
	      // Parte do meio, que mantem as retissencias dos dois lados
	    middlePages.push(this.getGap());
	    for(let i = 2; i>=-2; i--) {
		  middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.currentPage -i));
	    }
      middlePages.push(this.getGap());
	  }

    return middlePages;
  }

  createLastOptionPages() {
    let lastPages = [];

    if(this.totalOfPieces >= 4) {
      for(let i = this.totalOfPieces; i>this.totalOfPieces-2; i--) {
        lastPages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
      }
    } else if(this.totalOfPieces === 3) {
      lastPages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces));
    }

    return lastPages;
  }

  render() {
    let paginationOptions = [];

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
        {this.createInitialOptionPages()}
        {this.createMiddleOptionPages()}
        {this.createLastOptionPages()}
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

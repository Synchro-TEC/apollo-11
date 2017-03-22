import React from 'react';
import _uniqueId from 'lodash/uniqueId';

class Paginate extends React.Component {

  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.totalOfPieces = Math.ceil(this.props.totalSizeOfData/this.props.recordsByPage);
  }

  componentWillReceiveProps(nextProps) {
    this.totalOfPieces = Math.ceil(nextProps.totalSizeOfData/nextProps.recordsByPage);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props;
  }

  /**
   * Monta um objeto com informações do paginate
   * @returns {{}}
   */
  mountPaginateInfo() {
    let {recordsByPage} = this.props;
    let paginateInfo = {};
    paginateInfo.limit = recordsByPage;
    paginateInfo.offset = (recordsByPage*this.currentPage)-recordsByPage;
    paginateInfo.currentPage = this.currentPage;

    return paginateInfo;
  }

  nextPage() {
    if(this.props.onNextPage && this.currentPage < this.totalOfPieces) {
      this.currentPage += 1;
      this.props.onNextPage(this.mountPaginateInfo());
    }
  }

  previousPage() {
    if(this.currentPage > 1) {
      this.currentPage -= 1;
    }
    this.props.onPreviousPage(this.mountPaginateInfo());
  }

  specifPage(e) {
    this.currentPage = parseInt(e.target.textContent);
    this.props.onSelectASpecifPage(this.mountPaginateInfo());
  }

  colorPaginationOptionAndPutGapIfNeeded(i) {
    let option = {};

    if(i === '...') {
      option = <span key={_uniqueId()}>{i}</span>;
    } else {
      if(this.currentPage === i) {
        option = <em key={_uniqueId()}> {i} </em>;
      } else {
        option = <a key={_uniqueId()} onClick={(e) => this.specifPage(e)}> {i} </a>;
      }
    }

    return option;
  }

  getGap() {
    return this.colorPaginationOptionAndPutGapIfNeeded('...');
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
    let paginateOptions = [];

    if(this.props.onSelectASpecifPage) {
      paginateOptions.push(this.createInitialOptionPages());
      paginateOptions.push(this.createMiddleOptionPages());
      paginateOptions.push(this.createLastOptionPages());
    }

    return (
      <div className='sv-paginate'>
        <button
          className='sv-button link link-info'
          disabled={this.currentPage === 1}
          onClick={() => this.previousPage()}>
          <i className='fa fa-chevron-left'/>
          Anterior
        </button>
          {paginateOptions}
        <button
          className='sv-button link link-info'
          disabled={this.currentPage === this.totalOfPieces}
          onClick={() => this.nextPage()}>
          Próximo
          <i className='fa fa-chevron-right'/>
        </button>
      </div>
    );
  }
}

Paginate.displayName = 'Paginate';

Paginate.defaultProps = {
  recordsByPage: 10
};

Paginate.propTypes = {
  onNextPage: React.PropTypes.func,
  onPreviousPage: React.PropTypes.func,
  onSelectASpecifPage: React.PropTypes.func,
  recordsByPage: React.PropTypes.number,
  totalSizeOfData: React.PropTypes.number,
};

export default Paginate;

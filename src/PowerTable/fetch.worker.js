
/*eslint no-undef: 0, no-inner-declarations: 0, no-console: 0 */

const worker = function () {

  this.itensPerPage = 16;

  this.collection = null;
  this.perPage = this.itensPerPage * 3;
  this.offSet = 0;
  this.sort = null;
  this.sortDesc = false;
  this.distincts = {};

  const bytesToSize = (bytes) => {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const decoratedReturn = (type, message = '', data = [], count = 0) => {
    return {type, itens: data, message, count};
  };

  this.addEventListener('message', (e) => {

    if(e.data.action === 'LOAD') {

      try {
        importScripts(e.data.url);
      } catch (err) {
        console.error(`POWER TABLE: Não foi possível carregar o arquivo DataColecction na url: ${e.data.url}`);
        throw new Error(err);
      }

      const request = new XMLHttpRequest();
      request.open(e.data.fetchMethod, e.data.dataUrl);
      request.responseType = 'json';

      request.onprogress = (progessEvent) => {
        this.postMessage(decoratedReturn('LOADING', `${bytesToSize(progessEvent.loaded)} carregados...`));
      };

      request.onload = () => {
        this.collection = new DataCollection(request.response);
        this.collection.defineIndex('id');
        let itens = this.collection.query().filter();

        this.postMessage(
          decoratedReturn('LOADED', 'Dados carregados', itens.limit(this.offSet, this.perPage).values(), itens.count())
        );

        for (let i = 0; i < e.data.cols.length; i++) {
          let col = e.data.cols[i];
          if(col && col.searchable) {
            this.distincts[col.key] = this.collection.query().distinct(col.key);
          }
        }

        setTimeout(() => {
          this.postMessage(decoratedReturn('DISTINCT', '', this.distincts));
        }, 100);

      };

      request.onerror = () => {
        this.postMessage(decoratedReturn('LOADING_ERROR', 'Erro ao carregar os dados'));
      };

      request.send();
      this.postMessage(decoratedReturn('LOADING_INIT', 'Iniciando o carregamento dos registros...'));
    }

    if(e.data.action === 'PAGINATE') {
      let newOffset = e.data.offset;

      let direction = newOffset > this.offSet ? 'NEXT' : 'PREV';
      this.offSet = (e.data.page > 0 && newOffset > this.itensPerPage) ? (newOffset - this.itensPerPage) : newOffset;
      debugger;
      let itens = this.collection.query().filter();
      let decoreateReturn = decoratedReturn('PAGINATE', '', itens.limit(this.offSet, this.perPage).values(), itens.count());
      decoreateReturn.direction = direction;
      decoreateReturn.page = e.data.page;
      decoreateReturn.offSet = this.offSet;
      this.postMessage(decoreateReturn);
    }

    if(e.data.action === 'SORT') {

      this.offSet = 0;

      if(this.sort === e.data.value) {
        this.sortDesc = !this.sortDesc;
      } else {
        this.sortDesc = false;
      }

      this.sort = e.data.value;
      let itens = this.collection.query().filter().sort(this.sort, this.sortDesc);
      this.postMessage(decoratedReturn('SORT', '', itens.limit(this.offSet, this.perPage).values(), itens.count()));
    }

  }, false);

};

export default worker;

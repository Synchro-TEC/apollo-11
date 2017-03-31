
/*eslint no-undef: 0, no-inner-declarations: 0, no-console: 0 */

const worker = function () {

  this.collection = null;
  this.perPage = 16;
  this.offSet = 0;
  this.sort = null;
  this.sortDesc = false;
  this.distinctsLimited = {};
  this.distincts = {};
  this.filters = {};
  this.sorts = {};

  const bytesToSize = (bytes) => {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const decoratedReturn = (type, message = '', data = [], count = 0) => {
    return {type, itens: data, message, count, filters: this.filters, sorts: this.sorts};
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
            this.distinctsLimited[col.key] = this.collection.query().limit(0, 100).distinct(col.key);
            this.distincts[col.key] = this.collection.query().distinct(col.key);
          }
        }

        setTimeout(() => {
          this.postMessage(decoratedReturn('DISTINCT', '', this.distinctsLimited));
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
      this.offSet = newOffset;

      let itens = this.collection.query().filter(this.filters);

      if(this.sorts) {
        let key = Object.keys(this.sorts)[0];
        itens = itens.sort(key, this.sorts[key]);
      }

      let decoreateReturn = decoratedReturn('PAGINATE', '', itens.limit(this.offSet, this.perPage).values(), itens.count());
      decoreateReturn.direction = direction;
      decoreateReturn.page = e.data.page;
      decoreateReturn.offSet = this.offSet;
      this.postMessage(decoreateReturn);
    }

    if(e.data.action === 'SORT') {

      this.offSet = 0;
      this.sortDesc = e.data.direction !== 'ASC';
      this.sort = e.data.dataKey;
      this.sorts = {};
      this.sorts[e.data.dataKey] = this.sortDesc;

      let itens = this.collection.query().filter(this.filters);
      this.postMessage(decoratedReturn('SORT', '', itens.sort(this.sort, this.sortDesc).limit(this.offSet, this.perPage).values(), itens.count()));
    }

    if(e.data.action === 'FILTER') {
      const {dataKey, value, dataType} = e.data.filterProps;

      if(!value) {
        dataType === 'numeric' ? delete this.filters[dataKey] : delete this.filters[`${dataKey}__icontains`];
      } else {
        if(dataType === 'numeric') {
          this.filters[`${dataKey}`] = parseInt(value, 10);
        } else {
          this.filters[`${dataKey}__icontains`] = value;
        }
      }
      this.offSet = 0;

      let itens = this.collection.query().filter(this.filters);

      if(this.sorts) {
        let key = Object.keys(this.sorts)[0];
        itens = itens.sort(key, this.sorts[key]);
      }

      this.postMessage(decoratedReturn('FILTER', '', itens.limit(this.offSet, this.perPage).values(), itens.count()));
    }

    if(e.data.action === 'FILTER_DISTINCT') {
      // debugger;

      if(!e.data.filterProps.value) {
        this.postMessage(decoratedReturn('FILTER_DISTINCT', '', this.distinctsLimited));
      } else {

        function contains(value) {
          return value.toString().toLowerCase().indexOf(e.data.filterProps.value.toLowerCase()) > -1;
        }

        let itens = this.distincts[e.data.filterProps.dataKey].filter(contains);

        let objectToReturn = decoratedReturn('FILTER_DISTINCT', '', itens.slice(0, 199), itens.length);
        objectToReturn.dataKey = e.data.filterProps.dataKey;
        this.postMessage(objectToReturn);
      }
    }


  }, false);

};

export default worker;

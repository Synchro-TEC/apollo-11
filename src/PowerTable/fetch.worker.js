
/*eslint no-undef: 0, no-inner-declarations: 0, no-console: 0 */

const worker = function () {

  this.collection = null;
  this.perPage = 300;
  this.offSet = 0;
  this.sort = null;

  this.addEventListener('message', (e) => {


    if(e.data.action === 'LOAD') {

      importScripts(e.data.url);

      function bytesToSize(bytes) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      }

      const request = new XMLHttpRequest();
      request.open(e.data.fetchMethod, e.data.dataUrl);
      request.responseType = 'json';

      request.onprogress = (progessEvent) => {
        this.postMessage(`${bytesToSize(progessEvent.loaded)} carregados...`);
      };

      request.onload = () => {
        console.time('collectionRequest');
        this.collection = new DataCollection(request.response);
        console.timeEnd('collectionRequest');

        console.time('query');
        let itens = this.collection.query().filter();
        console.timeEnd('query');
        this.postMessage({itens: itens.limit(this.offSet, this.perPage).values(), count: itens.count()});
      };

      request.onerror = () => {
        this.postMessage('Erro ao carregar os dados');
      };

      request.send();

      this.postMessage('Carregando os registros...');
    }

    if(e.data.action === 'PAGINATE_NEXT') {
      this.offSet += this.perPage;
      console.time('query');
      let itens = this.collection.query().filter();
      console.timeEnd('query');
      this.postMessage({itens: itens.limit(this.offSet, this.perPage).values(), count: itens.count()});
    }

    if(e.data.action === 'PAGINATE_PREV') {
      this.offSet -= this.perPage;
      console.time('query');
      let itens = this.collection.query().filter();
      console.timeEnd('query');
      this.postMessage({itens: itens.limit(this.offSet, this.perPage).values(), count: itens.count()});
    }

    if(e.data.action === 'SORT') {
      this.offSet = 0;
      this.sort = 'firstName';
      let itens = this.collection.query().filter();
      this.postMessage({itens: itens.limit(this.offSet, this.perPage).values(), count: itens.count()});
    }

  }, false);

};

export default worker;

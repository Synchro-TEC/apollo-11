

const worker = function () {

  this.collection = null;
  this.perPage = 200;
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
        this.collection = new DataCollection(request.response);

        this.postMessage(this.collection.query().filter().limit(this.offSet, this.perPage).values());
      };

      request.onerror = () => {
        this.postMessage('Erro ao carregar os dados');
      };

      request.send();

      this.postMessage('Carregando os registros...');
    }

    if(e.data.action === 'PAGINATE_NEXT') {
      this.offSet += this.perPage;
      this.postMessage(this.collection.query().filter().sort(this.sort).limit(this.offSet, this.perPage).values());
    }

    if(e.data.action === 'PAGINATE_PREV') {
      this.offSet -= this.perPage;
      this.postMessage(this.collection.query().filter().sort(this.sort).limit(this.offSet, this.perPage).values());
    }

    if(e.data.action === 'SORT') {
      this.offSet = 0;
      this.sort = 'firstName';
      this.postMessage(this.collection.query().sort(this.sort).limit(this.offSet, this.perPage).values());
    }





  }, false);

};

export default worker;

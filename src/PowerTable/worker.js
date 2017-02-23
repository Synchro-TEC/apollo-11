const worker = function () {

  this.addEventListener('message', (e) => {
    debugger;

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
      console.log(`${bytesToSize(progessEvent.loaded)} carregados...`);
    };

    request.onload = () => {
      let resultSet = e.data.db.addCollection('resultSet');
      resultSet.insert(request.response);

      this.postMessage('Adicionado');
    };

    request.send();

    this.postMessage('Carregando os registros...');


  }, false);

};

export default worker;

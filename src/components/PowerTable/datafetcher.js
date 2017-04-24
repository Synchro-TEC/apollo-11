import _get from 'lodash.get';

const _shoudRemotelyFetch = (fetchSpec) => {
    return fetchSpec.collection === undefined || fetchSpec.collection.length === 0;
}

const _doRemotelyFetch = (fetchSpec, _onProgress) => {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();
        request.open(fetchSpec.fetchMethod, fetchSpec.fetchUrl);
        request.setRequestHeader("Content-Type", "application/json");
        request.responseType = 'json';

        request.onload = () => {
            let collection = _responseExtractor(fetchSpec.responseCollectionPath, request.response);
            resolve(collection);
        };

        request.onerror = () => {
            reject('Erro ao carregar os dados');
        };

        request.onprogress = _onProgress;
        request.send(JSON.stringify(fetchSpec.fetchParams || {}));
    })
}

const _responseExtractor = (responseCollectionPath, response) => {
      if(responseCollectionPath){
        return _get(response, responseCollectionPath);
      } else {
        return response;
      }
}


module.exports.fetch = (fetchSpec, _onProgress) => {
    if(_shoudRemotelyFetch(fetchSpec, _onProgress)){
        return _doRemotelyFetch(fetchSpec, _onProgress);
    } else {
        return new Promise(function (resolve, reject){
            resolve(fetchSpec.collection);
        });
    }
}

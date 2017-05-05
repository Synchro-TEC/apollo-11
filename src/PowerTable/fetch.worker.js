/*eslint no-unused-vars: 0, no-undef: 0, no-inner-declarations: 0, no-console: 0 */

import sift from 'sift';
import DataFetcher from './datafetcher.js';
import '../helpers/polyfills';


const DEFAULT_PER_PAGE = 20;

let collection = null;
let currentCollection = null;
let perPage = DEFAULT_PER_PAGE;
let offSet = 0;
let sort = null;
let sortDesc = false;
let distinctsLimited = {};
let distincts = {};
let filters = {};
let filtersByConditions = {};
let sorts = {};

/**
 * Retorna o valor baixado
 *
 * @param bytes
 * @return {*}
 */
const bytesToSize = (bytes) => {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


/**
 * Decora o retorno dos métodos para que sempre haja um objeto consiste trafegango entre o worker e o componente
 *
 * @param type
 * @param message
 * @param data
 * @param count
 * @return {{type: *, itens: Array, message: string, count: number, filters: {}, sorts: {}}}
 */
const decoratedReturn = (type, message = '', data = [], count = 0) => {
  return {type, itens: data, message, count, filters, sorts, filtersByConditions};
};


/**
 * Sort
 *
 * @param field
 * @param reverse
 * @param primer
 * @return {function(*=, *=)}
 */
const sortBy = (field, reverse, primer) => {
  let key = primer ?
    (x) => primer(x[field]) :
    (x) => x[field];

  reverse = !reverse ? 1 : -1;

  return (a, b) => {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  };
};

/**
 * Check empty objects
 * @param obj
 */
const isEmpty = (obj) => !Object.keys(obj).length;


/**
 * Apply filter.
 */
const applyFilter = () => {

  let perValueFilter = {};
  Object.keys(filters).forEach(key => {
    perValueFilter[key] = {$in: filters[key]};
  });

  let itens = sift(perValueFilter, collection);

  let perConditionsFilter = {};
  let $andConditions = [];

  Object.keys(filtersByConditions).forEach(key => {
    let conditions = {};
    let condition = filtersByConditions[key].condition;

    if(condition !== '$bet') {

      let value = filtersByConditions[key].value.only;

      if (condition === '$in' || condition === '$nin') {
        if(condition === '$in') {
          value = new RegExp(`${value.toString()}`, 'gi');
        } else {
          value = new RegExp(`[^${value.toString()}]`, 'gi');
        }
        condition = '$regex';
      } else {
        value = parseInt(value, 10);
      }
      conditions[condition] = value;
      perConditionsFilter[key] = conditions;
    } else {

      let {start, end} = filtersByConditions[key].value;
      let startCondition = {};
      let endCondition = {};

      startCondition[key] = {$gte: parseInt(start, 10)};
      endCondition[key] = {$lte: parseInt(end, 10)};

      if(start.length > 0 && end.length > 0) {
        $andConditions.push(startCondition, endCondition);
      }

      perConditionsFilter = { $and: $andConditions};
    }
  });

  itens = sift(perConditionsFilter, itens);

  if(sorts) {
    let key = Object.keys(sorts)[0];
    itens = itens.sort(sortBy(key, sorts[key]));
  }

  offSet = 0;
  currentCollection = itens;
};


const _fillDistincts = (columns) => {
  for (let i = 0; i < columns.length; i++) {
    let col = columns[i];
    if (col && col.searchable) {
      distinctsLimited[col.key] = [...new Set(collection.slice(0, 100).map(item => item[col.key]))];
      distincts[col.key] = [...new Set(collection.map(item => item[col.key]))];
    }
  }

  setTimeout(() => {
    self.postMessage(decoratedReturn('DISTINCT', '', distinctsLimited));
  }, 100);
};

const _onProgress = (progessEvent) => {
  self.postMessage(decoratedReturn('LOADING', `${bytesToSize(progessEvent.loaded)} carregados...`));
};

self.addEventListener('message', (e) => {

  /**
   * LOADING DATA ACTION
   */
  if (e.data.action === 'LOAD') {
    let fetch = DataFetcher.fetch(e.data.fetch, _onProgress);

    fetch.then((data) => {
      collection = currentCollection = data;
      perPage = e.data.pageSize;
      let sliced = currentCollection.slice(offSet, perPage);
      self.postMessage(decoratedReturn('LOADED', 'Dados carregados', sliced, collection.length));

      _fillDistincts(e.data.cols);
    });

    fetch.catch((message) => {
      self.postMessage(decoratedReturn('LOADING_ERROR', message));
    });

    self.postMessage(decoratedReturn('LOADING_INIT', 'Iniciando o carregamento dos registros...'));
  }


  /**
   * PAGINATE ACTION
   */
  if (e.data.action === 'PAGINATE') {
    let newOffset = e.data.offset;

    let direction = newOffset > offSet ? 'NEXT' : 'PREV';
    offSet = newOffset;

    let decoreateReturn = decoratedReturn('PAGINATE', '', currentCollection.slice(offSet, (offSet + perPage)), currentCollection.length);
    decoreateReturn.direction = direction;
    decoreateReturn.page = e.data.page;
    decoreateReturn.offSet = offSet;
    self.postMessage(decoreateReturn);
  }


  /**
   * SORT ACTION
   */
  if (e.data.action === 'SORT') {

    offSet = 0;
    sortDesc = e.data.direction !== 'ASC';
    sort = e.data.dataKey;
    sorts = {};
    sorts[e.data.dataKey] = sortDesc;

    applyFilter();

    self.postMessage(decoratedReturn('SORT', '', currentCollection.slice(offSet, perPage), currentCollection.length));
  }

  /**
   * FILTER ACTION
   */
  if (e.data.action === 'FILTER') {

    const {perValue, perConditions} = e.data;
    const {dataKey} = e.data.dataInfo;

    if(!perValue || perValue.length === 0) {
      delete filters[dataKey];
    } else {
      filters[dataKey] = perValue;
    }

    if(isEmpty(perConditions.filter)) {
      delete filtersByConditions[dataKey];
    } else {
      filtersByConditions[dataKey] = { condition: perConditions.condition, value: perConditions.filter };
    }

    applyFilter();

    self.postMessage(decoratedReturn('FILTER', '', currentCollection.slice(offSet, perPage), currentCollection.length));
  }

  /**
   * FILTER DISTINCTS ACTION
   */
  if (e.data.action === 'FILTER_DISTINCT') {

    if (!e.data.filterProps.value) {
      self.postMessage(decoratedReturn('FILTER_DISTINCT', '', distinctsLimited));
    } else {

      const contains = (value) => {
        return value.toString().toLowerCase().indexOf(e.data.filterProps.value.toLowerCase()) > -1;
      };

      let itens = distincts[e.data.filterProps.dataKey].filter(contains);

      let objectToReturn = decoratedReturn('FILTER_DISTINCT', '', itens.slice(0, 199), itens.length);
      objectToReturn.dataKey = e.data.filterProps.dataKey;
      self.postMessage(objectToReturn);
    }
  }


}, false);
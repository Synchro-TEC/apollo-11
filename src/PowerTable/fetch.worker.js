/*eslint no-undef: 0, no-inner-declarations: 0, no-console: 0 */

/*
 * Sift 3.x
 *
 * Copryright 2015, Craig Condon
 * Licensed under MIT
 *
 * Filter JavaScript objects with mongodb queries
 */


  'use strict';

  /**
   */

  function isFunction(value) {
    return typeof value === 'function';
  }

  /**
   */

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  /**
   */

  function comparable(value) {
    if (value instanceof Date) {
      return value.getTime();
    } else if (value instanceof Array) {
      return value.map(comparable);
    } else {
      return value;
    }
  }

  function get(obj, key) {
    if (obj.get) return obj.get(key);
    return obj[key];
  }

  /**
   */

  function or(validator) {
    return function(a, b) {
      if (!isArray(b) || !b.length) return validator(a, b);
      for (var i = 0, n = b.length; i < n; i++) if (validator(a, get(b,i))) return true;
      return false;
    }
  }

  /**
   */

  function and(validator) {
    return function(a, b) {
      if (!isArray(b) || !b.length) return validator(a, b);
      for (var i = 0, n = b.length; i < n; i++) if (!validator(a, get(b, i))) return false;
      return true;
    };
  }

  function validate(validator, b) {
    return validator.v(validator.a, b);
  }

  var operator = {

    /**
     */

    $eq: or(function(a, b) {
      return a(b);
    }),

    /**
     */

    $ne: and(function(a, b) {
      return !a(b);
    }),

    /**
     */

    $or: function(a, b) {
      for (var i = 0, n = a.length; i < n; i++) if (validate(get(a, i), b)) return true;
      return false;
    },

    /**
     */

    $gt: or(function(a, b) {
      return sift.compare(comparable(b), a) > 0;
    }),

    /**
     */

    $gte: or(function(a, b) {
      return sift.compare(comparable(b), a) >= 0;
    }),

    /**
     */

    $lt: or(function(a, b) {
      return sift.compare(comparable(b), a) < 0;
    }),

    /**
     */

    $lte: or(function(a, b) {
      return sift.compare(comparable(b), a) <= 0;
    }),

    /**
     */

    $mod: or(function(a, b) {
      return b % a[0] == a[1];
    }),

    /**
     */

    $in: function(a, b) {

      if (b instanceof Array) {
        for (var i = b.length; i--;) {
          if (~a.indexOf(comparable(get(b, i)))) return true;
        }
      } else {
        return !!~a.indexOf(comparable(b));
      }

      return false;
    },

    /**
     */

    $nin: function(a, b) {
      return !operator.$in(a, b);
    },

    /**
     */

    $not: function(a, b) {
      return !validate(a, b);
    },

    /**
     */

    $type: function(a, b) {
      return b != void 0 ? b instanceof a || b.constructor == a : false;
    },

    /**
     */

    $all: function(a, b) {
      return operator.$and(a, b);
    },

    /**
     */

    $size: function(a, b) {
      return b ? a === b.length : false;
    },

    /**
     */

    $nor: function(a, b) {
      // todo - this suffice? return !operator.$in(a)
      for (var i = 0, n = a.length; i < n; i++) if (validate(get(a, i), b)) return false;
      return true;
    },

    /**
     */

    $and: function(a, b) {
      if (!b) b = [];
      for (var i = 0, n = a.length; i < n; i++) if (!validate(get(a, i), b)) return false;
      return true;
    },

    /**
     */

    $regex: or(function(a, b) {
      return typeof b === 'string' && a.test(b);
    }),

    /**
     */

    $where: function(a, b) {
      return a.call(b, b);
    },

    /**
     */

    $elemMatch: function(a, b) {
      if (isArray(b)) return !!~search(b, a);
      return validate(a, b);
    },

    /**
     */

    $exists: function(a, b) {
      return (b != void 0) === a;
    }
  };

  /**
   */

  var prepare = {

    /**
     */

    $eq: function(a) {

      if (a instanceof RegExp) {
        return function(b) {
          return typeof b === 'string' && a.test(b);
        };
      } else if (a instanceof Function) {
        return a;
      } else if (isArray(a) && !a.length) {
        // Special case of a == []
        return function(b) {
          return (isArray(b) && !b.length);
        };
      } else if (a === null){
        return function(b){
          //will match both null and undefined
          return b == null;
        }
      }

      return function(b) {
        return sift.compare(comparable(b), a) === 0;
      };
    },

    /**
     */

    $ne: function(a) {
      return prepare.$eq(a);
    },

    /**
     */

    $and: function(a) {
      return a.map(parse);
    },

    /**
     */

    $all: function(a) {
      return prepare.$and(a);
    },

    /**
     */

    $or: function(a) {
      return a.map(parse);
    },

    /**
     */

    $nor: function(a) {
      return a.map(parse);
    },

    /**
     */

    $not: function(a) {
      return parse(a);
    },

    /**
     */

    $regex: function(a, query) {
      return new RegExp(a, query.$options);
    },

    /**
     */

    $where: function(a) {
      return typeof a === 'string' ? new Function('obj', 'return ' + a) : a;
    },

    /**
     */

    $elemMatch: function(a) {
      return parse(a);
    },

    /**
     */

    $exists: function(a) {
      return !!a;
    }
  };

  /**
   */

  function search(array, validator) {

    for (var i = 0; i < array.length; i++) {
      if (validate(validator, get(array, i))) {
        return i;
      }
    }

    return -1;
  }

  /**
   */

  function createValidator(a, validate) {
    return { a: a, v: validate };
  }

  /**
   */

  function nestedValidator(a, b) {
    var values  = [];
    findValues(b, a.k, 0, values);

    if (values.length === 1) {
      return validate(a.nv, values[0]);
    }

    return !!~search(values, a.nv);
  }

  /**
   */

  function findValues(current, keypath, index, values) {

    if (index === keypath.length || current == void 0) {
      values.push(current);
      return;
    }

    var k = get(keypath, index);

    // ensure that if current is an array, that the current key
    // is NOT an array index. This sort of thing needs to work:
    // sift({'foo.0':42}, [{foo: [42]}]);
    if (isArray(current) && isNaN(Number(k))) {
      for (var i = 0, n = current.length; i < n; i++) {
        findValues(get(current, i), keypath, index, values);
      }
    } else {
      findValues(get(current, k), keypath, index + 1, values);
    }
  }

  /**
   */

  function createNestedValidator(keypath, a) {
    return { a: { k: keypath, nv: a }, v: nestedValidator };
  }

  /**
   * flatten the query
   */

  function parse(query) {
    query = comparable(query);

    if (!query || (query.constructor.toString() !== 'Object' &&
      query.constructor.toString().replace(/\n/g,'').replace(/ /g, '') !== 'functionObject(){[nativecode]}')) { // cross browser support
      query = { $eq: query };
    }

    var validators = [];

    for (var key in query) {
      var a = query[key];

      if (key === '$options') continue;

      if (operator[key]) {
        if (prepare[key]) a = prepare[key](a, query);
        validators.push(createValidator(comparable(a), operator[key]));
      } else {

        if (key.charCodeAt(0) === 36) {
          throw new Error('Unknown operation ' + key);
        }

        validators.push(createNestedValidator(key.split('.'), parse(a)));
      }
    }

    return validators.length === 1 ? validators[0] : createValidator(validators, operator.$and);
  }

  /**
   */

  function createRootValidator(query, getter) {
    var validator = parse(query);
    if (getter) {
      validator = {
        a: validator,
        v: function(a, b) {
          return validate(a, getter(b));
        }
      };
    }
    return validator;
  }

  /**
   */

  function sift(query, array, getter) {

    if (isFunction(array)) {
      getter = array;
      array  = void 0;
    }

    var validator = createRootValidator(query, getter);

    function filter(b) {
      return validate(validator, b);
    }

    if (array) {
      return array.filter(filter);
    }

    return filter;
  }

  /**
   */

  sift.use = function(plugin) {
    if (isFunction(plugin)) return plugin(sift);
    for (var key in plugin) {
      if (key.charCodeAt(0) === 36) operator[key] = plugin[key];
    }
  };

  /**
   */

  sift.indexOf = function(query, array, getter) {
    return search(array, createRootValidator(query, getter));
  };

  /**
   */

  sift.compare = function(a, b) {
    if(a===b) return 0;
    if(typeof a === typeof b) {
      if (a > b) return 1;
      if (a < b) return -1;
    }
  };




let collection = null;
let currentCollection = null;
let perPage = 16;
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
  }
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
        condition = '$regex'
      } else {
        value = parseInt(value, 10);
      }
      conditions[condition] = value;
      perConditionsFilter[key] = conditions;
    } else {
      debugger;
      let {start, end} = filtersByConditions[key].value;
      let startCondition = {};
      let endCondition = {};

      startCondition[key] = {$gte: parseInt(start, 10)};
      endCondition[key] = {$lte: parseInt(end, 10)};

      perConditionsFilter = { $and: [ startCondition, endCondition ]};
      debugger;
    }


  });
  debugger;
  itens = sift(perConditionsFilter, itens);
  debugger;
  if(sorts) {
    let key = Object.keys(sorts)[0];
    itens = itens.sort(sortBy(key, sorts[key]));
  }

  offSet = 0;
  currentCollection = itens;
};

self.addEventListener('message', (e) => {

  /**
   * LOADING DATA ACTION
   */
  if (e.data.action === 'LOAD') {

    const request = new XMLHttpRequest();
    request.open(e.data.fetchMethod, e.data.dataUrl);
    request.responseType = 'json';

    request.onprogress = (progessEvent) => {
      self.postMessage(decoratedReturn('LOADING', `${bytesToSize(progessEvent.loaded)} carregados...`));
    };

    request.onload = () => {
      collection = request.response;
      currentCollection = request.response;

      self.postMessage(
        decoratedReturn('LOADED', 'Dados carregados', currentCollection.slice(offSet, perPage), currentCollection.length)
      );

      for (let i = 0; i < e.data.cols.length; i++) {
        let col = e.data.cols[i];
        if (col && col.searchable) {
          distinctsLimited[col.key] = [...new Set(collection.slice(0, 100).map(item => item[col.key]))];
          distincts[col.key] = [...new Set(collection.map(item => item[col.key]))];
        }
      }

      setTimeout(() => {
        self.postMessage(decoratedReturn('DISTINCT', '', distinctsLimited));
      }, 100);

    };

    request.onerror = () => {
      self.postMessage(decoratedReturn('LOADING_ERROR', 'Erro ao carregar os dados'));
    };

    request.send();
    self.postMessage(decoratedReturn('LOADING_INIT', 'Iniciando o carregamento dos registros...'));
  }


  /**
   * PAGINATE ACTION
   */
  if (e.data.action === 'PAGINATE') {
    let newOffset = e.data.offset;

    let direction = newOffset > offSet ? 'NEXT' : 'PREV';
    offSet = newOffset;

    debugger;

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
    const {dataKey, dataType} = e.data.dataInfo;

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
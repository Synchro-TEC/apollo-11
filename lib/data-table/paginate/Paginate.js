'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uniqueId2 = require('lodash/uniqueId');

var _uniqueId3 = _interopRequireDefault(_uniqueId2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Paginate = function (_React$Component) {
  _inherits(Paginate, _React$Component);

  function Paginate(props) {
    _classCallCheck(this, Paginate);

    var _this = _possibleConstructorReturn(this, (Paginate.__proto__ || Object.getPrototypeOf(Paginate)).call(this, props));

    _this.numberOfRecordsForPage = 10;
    _this.currentPage = 1;
    _this.totalOfPieces = Math.ceil(_this.props.totalSizeOfData / _this.numberOfRecordsForPage);
    return _this;
  }

  /**
   * Monta um objeto com informações do paginate que são importantes para quem usa
   * @returns {{}}
   */


  _createClass(Paginate, [{
    key: 'mountPaginateInformation',
    value: function mountPaginateInformation() {
      var paginateInformation = {};
      paginateInformation.currentPage = this.currentPage;
      paginateInformation.totalOfPieces = this.totalOfPieces;
      paginateInformation.numberOfRecordsForPage = this.numberOfRecordsForPage;
      return paginateInformation;
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      if (this.currentPage < this.totalOfPieces) {
        this.currentPage += 1;
      }
      this.props.onNextPage(this.mountPaginateInformation());
    }
  }, {
    key: 'previousPage',
    value: function previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
      this.props.onPreviousPage(this.mountPaginateInformation());
    }
  }, {
    key: 'specifPage',
    value: function specifPage(e) {
      this.currentPage = parseInt(e.target.textContent);
      this.props.onChooseASpecifPage(this.mountPaginateInformation());
    }
  }, {
    key: 'colorPaginationOptionAndPutGapIfNeeded',
    value: function colorPaginationOptionAndPutGapIfNeeded(i) {
      var _this2 = this;

      var option = {};

      if (i === '...') {
        option = _react2.default.createElement(
          'span',
          { key: (0, _uniqueId3.default)() },
          i
        );
      } else {
        if (this.currentPage === i) {
          option = _react2.default.createElement(
            'em',
            { key: i },
            ' ',
            i,
            ' '
          );
        } else {
          option = _react2.default.createElement(
            'a',
            { onClick: function onClick(e) {
                return _this2.specifPage(e);
              }, key: i },
            ' ',
            i,
            ' '
          );
        }
      }

      return option;
    }
  }, {
    key: 'getGap',
    value: function getGap() {
      return this.colorPaginationOptionAndPutGapIfNeeded('...');
    }
  }, {
    key: 'createInitialOptionPages',
    value: function createInitialOptionPages() {
      var initialPages = [];

      if (this.totalOfPieces >= 2) {
        for (var i = 1; i <= 2; i++) {
          initialPages.push(this.colorPaginationOptionAndPutGapIfNeeded(i));
        }
      } else {
        initialPages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces));
      }

      return initialPages;
    }
  }, {
    key: 'createMiddleOptionPages',
    value: function createMiddleOptionPages() {
      var middlePages = [];

      if (this.totalOfPieces <= 10) {
        for (var i = this.totalOfPieces - 2; i >= 3; i--) {
          middlePages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
        }
      } else if (this.totalOfPieces - this.currentPage <= 2) {
        // Se faltam apenas 2 a frente, é preciso manter o terceiro numero atrás
        // (let i = this.totalOfPieces - 4)
        middlePages.push(this.getGap());
        for (var _i = this.totalOfPieces - 4; _i <= this.totalOfPieces - 2; _i++) {
          middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(_i));
        }
      } else if (this.totalOfPieces - this.currentPage <= 5) {
        // Se ainda faltam mais de dois numeros a frente nao e
        // preciso manter 3 numeros atras (let i = this.currentPage - 2)
        for (var _i2 = this.currentPage - 2; _i2 <= this.totalOfPieces - 2; _i2++) {
          middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(_i2));
        }
        middlePages.unshift(this.getGap());
      } else if (this.currentPage <= 2) {
        // Sempre entra aqui ao carregar a pagina, ou quando o usuario volta
        // para a primeira pagina, gera as 4 opcoes a frente
        for (var _i3 = 3; _i3 <= 5; _i3++) {
          middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(_i3));
        }
        middlePages.push(this.getGap());
      } else if (this.currentPage <= 6 && this.currentPage >= 3) {
        //Mantem as opcoes de paginacao, sempre duas a frente da selecionada
        for (var _i4 = this.currentPage + 2; _i4 >= 3; _i4--) {
          middlePages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(_i4));
        }
        middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      } else if (this.currentPage - 1 >= 6) {
        // Parte do meio, que mantem as retissencias dos dois lados
        middlePages.push(this.getGap());
        for (var _i5 = 2; _i5 >= -2; _i5--) {
          middlePages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.currentPage - _i5));
        }
        middlePages.push(this.getGap());
      }

      return middlePages;
    }
  }, {
    key: 'createLastOptionPages',
    value: function createLastOptionPages() {
      var lastPages = [];

      if (this.totalOfPieces >= 4) {
        for (var i = this.totalOfPieces; i > this.totalOfPieces - 2; i--) {
          lastPages.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
        }
      } else if (this.totalOfPieces === 3) {
        lastPages.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces));
      }

      return lastPages;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'sv-paginate' },
        _react2.default.createElement(
          'button',
          {
            className: 'sv-button link link-info',
            disabled: this.currentPage === 1,
            onClick: function onClick() {
              return _this3.previousPage();
            } },
          _react2.default.createElement('i', { className: 'fa fa-chevron-left' }),
          'Anterior'
        ),
        this.createInitialOptionPages(),
        this.createMiddleOptionPages(),
        this.createLastOptionPages(),
        _react2.default.createElement(
          'button',
          {
            className: 'sv-button link link-info',
            disabled: this.currentPage === this.totalOfPieces,
            onClick: function onClick() {
              return _this3.nextPage();
            } },
          'Pr\xF3ximo',
          _react2.default.createElement('i', { className: 'fa fa-chevron-right' })
        )
      );
    }
  }]);

  return Paginate;
}(_react2.default.Component);

Paginate.propTypes = {
  onChooseASpecifPage: _react2.default.PropTypes.func,
  onNextPage: _react2.default.PropTypes.func,
  onPreviousPage: _react2.default.PropTypes.func,
  totalSizeOfData: _react2.default.PropTypes.number
};

exports.default = Paginate;
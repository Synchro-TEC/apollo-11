'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PaginateStyles = require('./PaginateStyles');

var _PaginateStyles2 = _interopRequireDefault(_PaginateStyles);

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
   * Monta um objeto com informações do paginate que são importantes para quem o usa
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
    key: 'lastPage',
    value: function lastPage() {
      if (this.currentPage < this.totalOfPieces) {
        this.currentPage = this.totalOfPieces;
      }
      this.props.onLastPage(this.mountPaginateInformation());
    }
  }, {
    key: 'firstPage',
    value: function firstPage() {
      if (this.currentPage > 1) {
        this.currentPage = 1;
      }
      this.props.onFirstPage(this.mountPaginateInformation());
    }
  }, {
    key: 'specifPage',
    value: function specifPage(e) {
      this.currentPage = parseInt(e.target.textContent);
      this.props.onChooseASpecifPage(this.mountPaginateInformation());
    }
  }, {
    key: 'colorPaginationOptionIfNeeded',
    value: function colorPaginationOptionIfNeeded(i) {
      var _this2 = this;

      var option = {};
      if (this.currentPage === i) {
        option = _react2.default.createElement(
          'li',
          { key: i, style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            { className: 'sv-button link link-info',
              onClick: function onClick(e) {
                return _this2.specifPage(e);
              },
              style: { fontWeight: 'bold', color: '#455a64' } },
            ' ',
            i,
            ' '
          )
        );
      } else {
        option = _react2.default.createElement(
          'li',
          { key: i, style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            {
              className: 'sv-button link link-info',
              onClick: function onClick(e) {
                return _this2.specifPage(e);
              } },
            ' ',
            i,
            ' '
          )
        );
      }
      return option;
    }
  }, {
    key: 'colorPaginationOptionAndPutGapIfNeeded',
    value: function colorPaginationOptionAndPutGapIfNeeded(i) {
      var _this3 = this;

      var option = {};

      if (i === '...') {
        option = _react2.default.createElement(
          'li',
          { key: (0, _uniqueId3.default)(), style: _PaginateStyles2.default.gapOption },
          _react2.default.createElement(
            'span',
            { style: _PaginateStyles2.default.gap },
            i
          )
        );
      } else {
        if (this.currentPage === i) {
          option = _react2.default.createElement(
            'li',
            { key: i, style: _PaginateStyles2.default.options },
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info',
                onClick: function onClick(e) {
                  return _this3.specifPage(e);
                },
                style: { fontWeight: 'bold', color: '#455a64' } },
              ' ',
              i,
              ' '
            )
          );
        } else {
          option = _react2.default.createElement(
            'li',
            { key: i, style: _PaginateStyles2.default.options },
            _react2.default.createElement(
              'button',
              {
                className: 'sv-button link link-info',
                onClick: function onClick(e) {
                  return _this3.specifPage(e);
                } },
              ' ',
              i,
              ' '
            )
          );
        }
      }

      return option;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var paginationOptions = [];

      if (this.totalOfPieces <= 10) {
        for (var i = this.totalOfPieces; i >= 1; i--) {
          paginationOptions.unshift(this.colorPaginationOptionAndPutGapIfNeeded(i));
        }
      } else if (this.totalOfPieces - this.currentPage <= 2) {
        for (var _i = 1; _i <= 2; _i++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
        for (var _i2 = this.totalOfPieces - 4; _i2 <= this.totalOfPieces; _i2++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i2));
        }
      } else if (this.totalOfPieces - this.currentPage <= 5) {
        for (var _i3 = 1; _i3 <= 2; _i3++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i3));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
        for (var _i4 = this.currentPage - 2; _i4 <= this.totalOfPieces; _i4++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i4));
        }
      } else if (this.currentPage - 1 >= 6) {
        for (var _i5 = 1; _i5 <= 2; _i5++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i5));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
        for (var _i6 = 2; _i6 >= -2; _i6--) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(this.currentPage - _i6));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      } else if (this.currentPage <= 6 && this.currentPage >= 3) {
        for (var _i7 = this.currentPage + 2; _i7 >= 1; _i7--) {
          paginationOptions.unshift(this.colorPaginationOptionAndPutGapIfNeeded(_i7));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      } else if (this.currentPage <= 2) {
        for (var _i8 = 1; _i8 <= 5; _i8++) {
          paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(_i8));
        }
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded('...'));
      }

      for (var _i9 = 1; _i9 >= 0; _i9--) {
        paginationOptions.push(this.colorPaginationOptionAndPutGapIfNeeded(this.totalOfPieces - _i9));
      }

      return _react2.default.createElement(
        'ul',
        { style: _PaginateStyles2.default.list },
        _react2.default.createElement(
          'li',
          { style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            { className: 'sv-button link link-info', onClick: function onClick() {
                return _this4.firstPage();
              } },
            _react2.default.createElement('i', { className: 'fa fa-angle-double-left fa-fw' }),
            'Primeiro'
          )
        ),
        _react2.default.createElement(
          'li',
          { style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            { className: 'sv-button link link-info', onClick: function onClick() {
                return _this4.previousPage();
              } },
            'Anterior'
          )
        ),
        paginationOptions,
        _react2.default.createElement(
          'li',
          { style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            { className: 'sv-button link link-info', onClick: function onClick() {
                return _this4.nextPage();
              } },
            'Pr\xF3ximo'
          )
        ),
        _react2.default.createElement(
          'li',
          { style: _PaginateStyles2.default.options },
          _react2.default.createElement(
            'button',
            { className: 'sv-button link link-info', onClick: function onClick() {
                return _this4.lastPage();
              } },
            '\xDAltimo',
            _react2.default.createElement('i', { className: 'fa fa-angle-double-right fa-fw' })
          )
        )
      );
    }
  }]);

  return Paginate;
}(_react2.default.Component);

Paginate.propTypes = {
  gridData: _react2.default.PropTypes.array.isRequired,
  onChooseASpecifPage: _react2.default.PropTypes.func,
  onFirstPage: _react2.default.PropTypes.func,
  onLastPage: _react2.default.PropTypes.func,
  onNextPage: _react2.default.PropTypes.func,
  onPreviousPage: _react2.default.PropTypes.func,
  totalSizeOfData: _react2.default.PropTypes.number
};

exports.default = Paginate;
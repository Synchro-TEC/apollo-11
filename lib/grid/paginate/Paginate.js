'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
    _this.state = {
      currentPage: 1,
      totalOfPieces: Math.ceil(_this.props.gridData.length / _this.numberOfRecordsForPage)
    };
    return _this;
  }

  _createClass(Paginate, [{
    key: 'nextPage',
    value: function nextPage() {
      if (this.state.currentPage < this.state.totalOfPieces) {
        this.setState({ currentPage: this.state.currentPage + 1 });
      }
      var startOfSlice = this.state.currentPage * this.numberOfRecordsForPage;
      var endOfSlice = this.state.totalOfPieces * this.numberOfRecordsForPage;
      this.props.onNextPage(this.props.gridData.slice(startOfSlice, endOfSlice));
    }
  }, {
    key: 'previousPage',
    value: function previousPage() {
      if (this.state.currentPage > 1) {
        this.setState({ currentPage: this.state.currentPage - 1 });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'tfoot',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'td',
            { className: 'sv-text-center', colSpan: '8' },
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info' },
              _react2.default.createElement('i', { className: 'fa fa-angle-double-left fa-fw' }),
              'Primeiro'
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info', onClick: function onClick() {
                  return _this2.previousPage();
                } },
              _react2.default.createElement('i', { className: 'fa fa-angle-left fa-fw' }),
              'Anterior'
            ),
            _react2.default.createElement(
              'span',
              null,
              this.state.currentPage,
              ' de',
              ' ' + this.state.totalOfPieces,
              this.state.totalOfPieces > 1 ? ' páginas' : ' página'
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info', onClick: function onClick() {
                  return _this2.nextPage();
                } },
              'Pr\xF3ximo',
              _react2.default.createElement('i', { className: 'fa fa-angle-right fa-fw' })
            ),
            _react2.default.createElement(
              'button',
              { className: 'sv-button link link-info' },
              '\xDAltimo',
              _react2.default.createElement('i', { className: 'fa fa-angle-double-right fa-fw' })
            )
          )
        )
      );
    }
  }]);

  return Paginate;
}(_react2.default.Component);

Paginate.propTypes = {
  gridData: _react2.default.PropTypes.array.isRequired,
  onNextPage: _react2.default.PropTypes.func
};

exports.default = Paginate;
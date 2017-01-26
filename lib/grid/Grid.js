'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridTitles = require('./GridTitles');

var _GridTitles2 = _interopRequireDefault(_GridTitles);

var _GridRows = require('./GridRows');

var _GridRows2 = _interopRequireDefault(_GridRows);

var _Paginate = require('./paginate/Paginate');

var _Paginate2 = _interopRequireDefault(_Paginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Grid = function (_React$Component) {
  _inherits(Grid, _React$Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

    _this.initialData = _this.props.data;
    _this.state = { data: _this.initialData };
    return _this;
  }

  _createClass(Grid, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var oldData = this.state.data;
      var newData = oldData.slice(0, 10);
      this.setState({ data: newData });
    }
  }, {
    key: 'paginateAction',
    value: function paginateAction(paginateInformation) {
      var startOfSlice = paginateInformation.currentPage * paginateInformation.numberOfRecordsForPage - paginateInformation.numberOfRecordsForPage;
      var endOfSlice = startOfSlice + paginateInformation.numberOfRecordsForPage;
      var newData = this.initialData.slice(startOfSlice, endOfSlice);
      this.setState({ data: newData });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          className = _props.className,
          titles = _props.titles;


      return _react2.default.createElement(
        'div',
        { className: 'sv-table-responsive-vertical' },
        _react2.default.createElement(
          'table',
          { className: className },
          _react2.default.createElement(_GridTitles2.default, { gridTitles: titles }),
          _react2.default.createElement(_GridRows2.default, { gridRows: this.state.data })
        ),
        _react2.default.createElement(
          'div',
          { className: 'sv-text-center' },
          _react2.default.createElement(_Paginate2.default, { gridData: this.state.data,
            onChooseASpecifPage: function onChooseASpecifPage(paginateInformation) {
              return _this2.paginateAction(paginateInformation);
            },
            onFirstPage: function onFirstPage(paginateInformation) {
              return _this2.paginateAction(paginateInformation);
            },
            onLastPage: function onLastPage(paginateInformation) {
              return _this2.paginateAction(paginateInformation);
            },
            onNextPage: function onNextPage(paginateInformation) {
              return _this2.paginateAction(paginateInformation);
            },
            onPreviousPage: function onPreviousPage(paginateInformation) {
              return _this2.paginateAction(paginateInformation);
            },
            totalSizeOfData: this.props.data.length
          })
        )
      );
    }
  }]);

  return Grid;
}(_react2.default.Component);

Grid.defaultProps = {
  className: 'sv-table with--hover with--borders'
};

Grid.propTypes = {
  className: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.array.isRequired,
  titles: _react2.default.PropTypes.array.isRequired
};

exports.default = Grid;
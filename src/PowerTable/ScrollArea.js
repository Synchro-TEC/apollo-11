import React from 'react';
import _throttle from 'lodash.throttle';
import _times from 'lodash.times';

class ScrollArea extends React.Component {

  constructor(props) {
    super(props);

    this.style = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    this.recordsContainer = null;
    this.before = null;
    this.after = null;
    this.totalHeight = null;
    this.viewPortHeight = null;


    this.fixScrollBarDiff = this.fixScrollBarDiff.bind(this);
    this.handlerScroll = this.handlerScroll.bind(this);
  }

  componentDidMount() {
    this.recordsContainer = this.props.container.querySelector('.PWT-Scroll');
    this.totalHeight = this.props.rowHeight * this.props.totalRecords;
    this.viewPortHeight = this.props.rowHeight * this.props.itensInViewPort;

    this.recordsContainer.addEventListener('scroll', _throttle(this.handlerScroll, 100, {leading: false, trailing: false}));
    this.fixScrollBarDiff();
  }

  fixScrollBarDiff() {
    let scrollAreaWidth = this.props.container.querySelector('.PWT-Scroll').offsetWidth;
    let tableWidth = this.props.container.querySelector('.PWT-Scroll table').offsetWidth;
    let header = this.props.container.querySelector('.PWT-TableHeader');
    header.style.paddingRight = `${scrollAreaWidth - tableWidth}px`;
  }

  handlerScroll(e) {
    let nPages = Math.ceil(this.viewPortHeight);
    let pages = [];

    _times(this.totalHeight, (n) => {
      if((n % nPages) === 0) {
        pages.push(n);
      }
    });

    const closestValue = (array, value) => {
      let result = null;
      let lastDelta;

      array.some((item) => {
        let delta = Math.abs(value - item);
        if (delta >= lastDelta) {
          return true;
        }
        result = item;
        lastDelta = delta;
      });

      return array.indexOf(result);
    };

    const calculateOffset = (scrollTop) => {
      return Math.floor(scrollTop / this.props.rowHeight);
    };


    let scrollTop = e.target.scrollTop;
    let page = closestValue(pages, scrollTop);
    let offset = calculateOffset(scrollTop);

    this.props.onScroll(page, offset, scrollTop);

    console.log('SCROLLTOP ', scrollTop);
    console.log('PAGE ', page);
    console.log('OFFSET ', offset);

    // this.before.style.height = `${e.target.scrollTop}px`;
    // this.after.style.height = `${this.totalHeight - this.viewPortHeight - e.target.scrollTop}px`;

  }

  render() {

    let result = this.props.collection.map((row, i) => {
      return (
        <tr key={i}>
          { this.props.columns.map((col, j) => {
            let rendered = col.formatter ? col.formatter(row) : row[col.key];
            return (<td key={`${i}${j}`} style={this.style}>{rendered}</td>); })
          }
        </tr>
      );
    });

    let firstTr = (<tr><td colSpan={this.props.columns.length} style={{height: `${this.props.beforeHeight}px`, padding: '0px'}} /></tr>);
    let lastTr = (<tr><td colSpan={this.props.columns.length} style={{height: `${this.props.afterHeight - this.props.beforeHeight}px`, padding: '0px'}} /></tr>);

    return (
      <div
          className='PWT-Scroll'
          style={{
            display: 'block',
            height: ((this.props.itensInViewPort - 1) * this.props.rowHeight),
            overflow: 'auto',
            marginTop: '-31px',
            position: 'relative',
            borderBottom: '1px solid #dadada',
          }}
        >
          <table className='sv-table with--grid' style={{tableLayout: 'fixed', marginBottom: '0px'}}>
            <tbody style={{pointerEvents: 'auto'}}>
            {firstTr}
            {result}
            {lastTr}
            </tbody>
          </table>
      </div>

    );
  }
}

ScrollArea.displayName = 'ScrollArea';

ScrollArea.propTypes = {
  afterHeight: React.PropTypes.number,
  beforeHeight: React.PropTypes.number,
  collection: React.PropTypes.array.isRequired,
  columns: React.PropTypes.array.isRequired,
  container: React.PropTypes.any,
  itensInViewPort: React.PropTypes.number.isRequired,
  onScroll: React.PropTypes.func,
  rowHeight: React.PropTypes.number.isRequired,
  totalRecords: React.PropTypes.number,

};

export default ScrollArea;

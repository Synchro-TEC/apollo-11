import React from 'react';

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

    this.scrollTimer = null;
    this.scrollDuration = 150;
    this.isScrolling= false;

    this.fixScrollBarDiff = this.fixScrollBarDiff.bind(this);
  }

  componentDidMount() {
    this.recordsContainer = this.props.container.querySelector('.PWT-Scroll');
    this.totalHeight = this.props.rowHeight * this.props.totalRecords;
    this.viewPortHeight = this.props.rowHeight * this.props.itensInViewPort;

    this.fixScrollBarDiff();
  }

  fixScrollBarDiff() {
    let scrollAreaWidth = this.props.container.querySelector('.PWT-Scroll').offsetWidth;
    let tableWidth = this.props.container.querySelector('.PWT-Scroll table').offsetWidth;
    let header = this.props.container.querySelector('.PWT-TableHeader');
    header.style.paddingRight = `${scrollAreaWidth - tableWidth}px`;
  }

  render() {

    let result = this.props.collection.map((row, i) => {
      return (
        <tr key={i} style={{height: '40px'}}>
          { this.props.columns.map((col, j) => {
            let rendered = col.formatter ? col.formatter(row) : row[col.key];
            return (<td key={`${i}${j}`} style={this.style}>{rendered}</td>); })
          }
        </tr>
      );
    });

    return (
      <div
          className='PWT-Scroll'
          style={{
            display: 'block',
            overflow: 'auto',
            marginTop: '-31px',
            position: 'relative',
            borderBottom: '1px solid #dadada',
          }}
        >
          <table className='sv-table with--grid' style={{tableLayout: 'fixed', marginBottom: '0px'}}>
            <tbody>
            {result}
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

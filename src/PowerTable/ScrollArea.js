import React from 'react';

class ScrollArea extends React.Component {

  constructor(props) {
    super(props);

    this.style = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    this.fixScrollBarDiff = this.fixScrollBarDiff.bind(this);
  }

  componentDidMount() {
    let recordsContainer = this.props.container.querySelector('.PWT-Scroll');

    recordsContainer.addEventListener('scroll', (e) => {
      console.log('Total rodado', e.target.scrollTop + e.target.offsetHeight);
      if(e.target.scrollTop > ((this.props.rowHeight * this.props.itensInViewPort) * 2)) {
        this.props.onScroll();
      }
    });

    window.addEventListener('resize', () => {
      this.fixScrollBarDiff();
    });

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
        <tr key={i}>
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
          height: (this.props.itensInViewPort * this.props.rowHeight),
          overflow: 'auto',
          marginTop: '-31px',
        }}
      >
        <table className='sv-table with--hover with--grid' style={{tableLayout: 'fixed', marginBottom: '0px'}}>
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
  collection: React.PropTypes.array.isRequired,
  columns: React.PropTypes.array.isRequired,
  container: React.PropTypes.any,
  itensInViewPort: React.PropTypes.number.isRequired,
  onScroll: React.PropTypes.func,
  rowHeight: React.PropTypes.number.isRequired,
};

export default ScrollArea;

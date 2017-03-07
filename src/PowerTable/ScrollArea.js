import React from 'react';

class ScrollArea extends React.Component {

  constructor(props) {
    super(props);

    this.style = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

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
        id='scroll'
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
  itensInViewPort: React.PropTypes.number.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};

export default ScrollArea;

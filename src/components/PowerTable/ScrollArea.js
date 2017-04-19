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

  componentDidMount() {

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
          <table className='sv-table with--borders with--hover' style={{tableLayout: 'fixed', marginBottom: '0px'}}>
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
  pageSize: React.PropTypes.number.isRequired,
  onScroll: React.PropTypes.func,
  rowHeight: React.PropTypes.number.isRequired,
  totalRecords: React.PropTypes.number,
};

export default ScrollArea;

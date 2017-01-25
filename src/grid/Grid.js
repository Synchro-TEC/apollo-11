import React from 'react';
import GridTitles from './GridTitles';
import GridRows from './GridRows';

class Grid extends React.Component {
  render() {

    let {className, titles, data} = this.props;

    return (
      <table className={className}>
        <GridTitles gridTitles={titles}/>
        <GridRows gridRows={data}/>
      </table>
    );
  }
}

Grid.defaultProps = {
  className: 'sv-table with--stripes'
};

Grid.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array.isRequired,
  titles: React.PropTypes.array.isRequired,
};

export default Grid;
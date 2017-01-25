import React from 'react';
import GridTitle from './GridTitle';

class GridTitles extends React.Component {
  render() {

    let titles = this.props.gridTitles.map((title, i) => {
      return (
        <GridTitle key={i} title={title}/>
      );
    });

    return (
      <thead>
        <tr>{titles}</tr>
      </thead>
    );
  }
}

GridTitles.propTypes = {
  gridTitles: React.PropTypes.array.isRequired,
};

export default GridTitles;
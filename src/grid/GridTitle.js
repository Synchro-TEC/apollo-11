import React from 'react';

class GridTitle extends React.Component {
  render() {
    return (
      <th>{this.props.title.label}</th>
    );
  }
}

GridTitle.propTypes = {
  title: React.PropTypes.object.isRequired,
};

export default GridTitle;
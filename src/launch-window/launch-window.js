import React from 'react';


class LaunchWindow extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {}


  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h5>Launch Window Component</h5>
      </div>
    );
  }
}

LaunchWindow.propTypes = {};

LaunchWindow.displayName = 'LaunchWindow';

export default LaunchWindow;

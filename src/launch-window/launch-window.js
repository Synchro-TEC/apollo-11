import React from 'react';
import PropTypes from 'prop-types';
import styles from './launch-window-styles';

class LaunchWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isVisible && !this.state.isVisible && this.props.beforeOpen) {
      this.props.beforeOpen();
    }

    if (!nextState.isVisible && this.state.isVisible && this.props.beforeClose) {
      this.props.beforeClose();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isVisible && this.state.isVisible && this.props.afterOpen) {
      this.props.afterOpen();
    }

    if (prevState.isVisible && !this.state.isVisible && this.props.afterClose) {
      this.props.afterClose();
    }
  }

  show() {
    this.setState({ isVisible: true });
  }

  hide() {
    this.setState({ isVisible: false });
  }

  onOverlayClicked() {
    if (this.props.hideOnOverlayClicked) {
      this.hide();
    }

    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
  }

  render() {
    var overlay;

    var dialogStyles = Object.assign(styles.dialogStyles, this.props.dialogStyles);
    var overlayStyles = Object.assign(styles.overlayStyles, this.props.overlayStyles);
    var closeButtonStyle = Object.assign(styles.closeButtonStyle, this.props.closeButtonStyle);

    if (this.state.isVisible) {
      overlayStyles.display = 'block';
      dialogStyles.display = 'block';
    } else {
      overlayStyles.display = 'none';
      dialogStyles.display = 'none';
    }

    if (this.props.showOverlay) {
      overlay = <div onClick={() => this.onOverlayClicked()} style={overlayStyles} />;
    }

    return (
      <section className="launchWindow-wrapper">
        {overlay}
        <div style={dialogStyles}>
          <a onClick={() => this.hide()} role="button" style={closeButtonStyle}>
            &times;
          </a>
          <h2>
            {this.props.title}
          </h2>
          {this.props.children}
        </div>
      </section>
    );
  }
}

LaunchWindow.displayName = 'LaunchWindow';

LaunchWindow.propTypes = {
  afterClose: PropTypes.func,
  afterOpen: PropTypes.func,
  beforeClose: PropTypes.func,
  beforeOpen: PropTypes.func,
  closeButtonStyle: PropTypes.object,
  dialogStyles: PropTypes.object,
  hideOnOverlayClicked: PropTypes.bool,
  onOverlayClicked: PropTypes.func,
  overlayStyles: PropTypes.object,
  showOverlay: PropTypes.bool,
  title: PropTypes.string,
};

LaunchWindow.defaultProps = {
  title: '',
  showOverlay: true,
  overlayStyles: styles.overlayStyles,
  dialogStyles: styles.dialogStyles,
  closeButtonStyle: styles.closeButtonStyle,
  hideOnOverlayClicked: false,
};

export default LaunchWindow;

import React from 'react';


const optionSelectorStyles = {
  container: {
    display: 'inline',
    position: 'relative'
  },
  options: {
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 0 5px #d1d1d1',
    display: 'none',
    position: 'absolute',
    listStyle: 'none',
    zIndex: '99'
  }
}

class OptionSelector extends React.Component {

  constructor(props){
    super(props);

    this.state = {label: this.props.initialValue, isVisible: false};
  }

  onSelect(opt) {
    this.setState({label: opt[this.props.labelKey], isVisible: false});
    this.props.onSelectCallBack(opt);
  }

  showOptions() {
    this.setState({label: this.state.label, isVisible: !this.state.isVisible});
  }

  render() {
    let options = this.props.options.map((opt, i) => {
      return <li key={`opt-${i}`} onClick={() => this.onSelect(opt)} style={{cursor: 'pointer'}}>{opt[this.props.labelKey]}</li>;
    });

    var display = this.state.isVisible ? {display: 'block'} : {display: 'none'};
    var optsStyles = Object.assign({}, optionSelectorStyles.options, display);

    return (
      <div style={optionSelectorStyles.container}>
        <button className="sv-button small default" onClick={()=>this.showOptions()}>{this.state.label}</button>
        <ul style={optsStyles}>
          {options}
        </ul>
      </div>
    )
  }
}

OptionSelector.displayName = 'OptionSelector';

OptionSelector.propTypes = {
  initialValue: React.PropTypes.string,
  labelKey: React.PropTypes.string,
  onSelectCallBack: React.PropTypes.func,
  options: React.PropTypes.array
};

OptionSelector.defaultProps = {
  initialValue: '?'
}

export default OptionSelector;

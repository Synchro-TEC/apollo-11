import React from 'react';

class ColumnActions extends React.Component {
  constructor(props){
    super(props);
  }

  render() {

    let dialogStyles = {
      position: 'absolute',
      top: '135px',
      right: '0',
      width: '200px',
      height: '300px',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid rgba(0,0,0,.2)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    if (this.props.isVisible) {
      dialogStyles.display = 'block';
    } else {
      dialogStyles.display = 'none';
    }

    return (
      <div style={dialogStyles}>
        <p>
          <button className='sv-button default small marged'><i className='fa fa-sort-amount-asc'/></button>
          <button className='sv-button default small'><i className='fa fa-sort-amount-desc'/></button>
        </p>



      </div>
    );
  }
}

ColumnActions.displayName = 'ColumnActions';

ColumnActions.propTypes = {
  distinctData: React.PropTypes.array,
  isVisible: React.PropTypes.bool,
  key: React.PropTypes.string,
  onSearch: React.PropTypes.func,
  onSort: React.PropTypes.func,
  position: React.PropTypes.object,

};

export default ColumnActions;

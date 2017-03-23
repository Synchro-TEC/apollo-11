import React from 'react';

class ColumnActions extends React.Component {
  constructor(props){
    super(props);

    this.filterChange = this.filterChange.bind(this);
    this.sort = this.sort.bind(this);
  }

  filterChange(e) {
    let queryText = e.target.value.trim();

    // if(queryText.length >= 3) {
    this.props.onSearch({dataKey: this.props.dataKey, value: queryText, dataType: this.props.dataType});
    // } else {
    //   this.props.onSearch({dataKey: this.props.dataKey, value: '', dataType: this.props.dataType});
    // }
  }

  sort(direction) {
    if(this.props.dataKey) {
      this.props.onSort(direction, this.props.dataKey);
    }
  }


  render() {

    let dialogStyles = {
      position: 'absolute',
      top: '35px',
      right: '0',
      width: '200px',
      height: '300px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, .9)',
      border: '1px solid rgba(0,0,0,.2)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: '99',
    };

    if (this.props.isVisible) {
      dialogStyles.display = 'block';
    } else {
      dialogStyles.display = 'none';
    }

    return (
      <div onClick={(e) => e.stopPropagation()} style={dialogStyles}>
        <p>
          <button className='sv-button default small marged' onClick={() => this.sort('ASC')}><i className='fa fa-sort-amount-asc'/></button>
          <button className='sv-button default small' onClick={() => this.sort('DESC')}><i className='fa fa-sort-amount-desc'/></button>
        </p>

        <div>
          <form className='sv-form' onSubmit={(e) => e.preventDefault()}>
            <input onChange={(e) => this.filterChange(e)} placeholder='Filtrar por' type='text' />
          </form>
        </div>

      </div>
    );
  }
}

ColumnActions.displayName = 'ColumnActions';

ColumnActions.propTypes = {
  dataKey: React.PropTypes.string,
  dataType: React.PropTypes.string,
  isVisible: React.PropTypes.bool,
  onSearch: React.PropTypes.func,
  onSort: React.PropTypes.func,
  position: React.PropTypes.object,
};

export default ColumnActions;

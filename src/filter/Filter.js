/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import FilterOptions from './FilterOptions';

class Filter extends React.Component {

  constructor(props) {
    super(props);
  }

  _onSearchWhenTyping(e) {
    if(this.props.onSearchWhenTyping && this.props.minimalSearchDelimiter < e.target.value.length) {
      this.props.onSearchWhenTyping();
    }
  }

  _onSearchWhenKeyDown(e) {
    if(this.props.onSearchWhenKeyDown && e.keyCode === 13) {
      this.props.onSearchWhenKeyDown(e.target.value);
    }
  }

  render() {

    const { placeholder } = this.props;
    let overlay = { display: this.props.children ? 'block': 'none'};

    return (
      <form className='sv-form'>
        <div className='sv-input-group'>
          <span className='label at-first'>
            <i className='fa fa-search fa-fw'/>
          </span>
          <input className='on-center'
                 onChange={(e) => this._onSearchWhenTyping(e)}
                 onKeyDown={(e) => this._onSearchWhenKeyDown(e)}
                 placeholder={placeholder}
                 type='search'/>
          <span className='label-action at-last' style={overlay}> Filter
            <i className='fa fa-sliders fa-fw'/>
          </span>
          <FilterOptions>
            {this.props.children}
          </FilterOptions>
        </div>
      </form>
    );
  }
}

Filter.defaultProps = {
  placeholder: 'Type to search!',
  minimalSearchDelimiter: 0
};

Filter.propTypes = {
  placeholder: React.PropTypes.string,
  minimalSearchDelimiter: React.PropTypes.number,
  onSearch: React.PropTypes.func,
  dataToFilter: React.PropTypes.array
};

Filter.displayName = 'Filter';

export default Filter;
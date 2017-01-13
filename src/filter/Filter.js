/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import FilterOptions from './FilterOptions';

class Filter extends React.Component {

  constructor(props) {
    super(props);
  }

  _onSearch(values) {
    values.searchValue = document.getElementById('query').value;
    if(this.props.onSearch) {
      this.props.onSearch(values);
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
          <input className='on-center' id='query' placeholder={placeholder} type='search'/>
          <span className='label-action at-last' style={overlay}> Filter
            <i className='fa fa-sliders fa-fw'/>
          </span>
          <FilterOptions onSearch={(values) => this._onSearch(values)}>
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
/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _assign from 'lodash/assign';

class FilterOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.namesOfFields = [];
    this.fields = [];
    this.filterValues = {};
    this.mountFilterOptionsObject = this.mountFilterOptionsObject.bind(this);
  }

  componentDidMount() {
    for(let i = 0; i<this.namesOfFields.length; i++) {
      // Nomes iguais, nao podem ser colocados no formFields
      if(this.namesOfFields[i] !== this.namesOfFields[i+1]) {
        //[].slice.call converte o NodeList para um array Javascript normal
        let formFields = [].slice.call(document.getElementsByName(this.namesOfFields[i]));
        formFields.map((formField) => this.fields.push(formField));
      }
    }
  }

  clearAll() {
    if(this.props.onClearAll) {
      this.setState({isOpen: false}, this.props.onClearAll());
    } else {
      for(let i = 0; i<this.fields.length; i++) {
        if(this.fields[i].type === 'radio' || this.fields[i].type === 'checkbox') {
          if(this.fields[i].checked) {
            this.fields[i].checked = false;
          }
        } else if(this.fields[i] !== '') {
          this.fields[i].value = '';
        }
      }
      this.setState({isOpen: false},
        this.props.addSearchValueToFilterValues(this.filterValues)
      );
    }
  }

  mountFilterOptionsObject() {
    this.fields.map((field) => {
      if(field.type === 'text' || field.type === 'select-one') {
        if(field.value !== '') {
          this.filterValues[field.name] = field.value;
        }
      } else if(field.type === 'radio' && field.checked) {
        this.filterValues[field.name] = field.value;
      } else if(field.type === 'checkbox' && field.checked) {
        if(this.filterValues[field.name]) {
          this.filterValues[field.name].push(field.value);
        } else {
          this.filterValues[field.name] = [field.value];
        }
      }
    });
    this.setState({isOpen: false}, this.props.addSearchValueToFilterValues(this.filterValues));
    this.filterValues = {};
  }

  toggleVisibility() {
    this.setState({isOpen: !this.state.isOpen});
  }

  close() {
    this.setState({isOpen: false});
  }

  verifyTypesAndGetNames(child) {
    if(child.type === 'input') {
      if(child.props.type === 'text' ||
         child.props.type === 'radio' ||
         child.props.type === 'checkbox') {
        this.namesOfFields.push(child.props.name);
      }
    } else if(child.type === 'select') {
      this.namesOfFields.push(child.props.name);
    }
  }

  renderChildren(children) {
    return (
      React.Children.map(children, (child) => {
        if(Array.isArray(children)) {
          this.verifyTypesAndGetNames(child);
          if(typeof child !== 'string') {
            this.renderChildren(child.props.children);
          }
          return child;
        } else {
          if(!_isEmpty(children.props)) {
            this.verifyTypesAndGetNames(child);
            this.renderChildren(child.props.children);
            return child;
          }
        }
      })
    );
  }

  render() {

    let {
      applyFilterButtonLabel,
      cancelButtonLabel,
      clearFilterOptionsButtonLabel,
      filterButtonLabel,
    } = this.props;

    let filterSpanStyles = _assign(
      {display: this.props.hasFilterOptions ? 'block': 'none'},
      {color: this.state.isOpen ? '#2196f3': '#455a64'}
    );

    return (
      <div>
        <span
          className='label-action at-last'
          onClick={() => this.toggleVisibility()}
          style={filterSpanStyles}>
          {filterButtonLabel}
          <i className='fa fa-sliders fa-fw'/>
        </span>
        <section className='action-container' style={{display: this.state.isOpen ? 'block': 'none'}}>
          <div className='sv-triangle on-right'/>
          <section className='action-container--content'>
            {this.renderChildren(this.props.children)}
            <footer>
              <input
                className='sv-button link link-danger'
                onClick={() => this.clearAll()}
                type='button'
                value={clearFilterOptionsButtonLabel}
              />
              <input
                className='sv-button link link-info sv-pull-right'
                onClick={() => this.mountFilterOptionsObject()}
                type='button'
                value={applyFilterButtonLabel}
              />
              <input
                className='sv-button link link-cancel sv-pull-right'
                onClick={() => this.close()}
                type='button'
                value={cancelButtonLabel}
              />
            </footer>
          </section>
        </section>
      </div>
    );
  }
}

FilterOptions.propTypes = {
  addSearchValueToFilterValues: PropTypes.func,
  applyFilterButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  clearFilterOptionsButtonLabel: PropTypes.string,
  filterButtonLabel: PropTypes.string,
  hasFilterOptions: PropTypes.bool,
  onClearAll: PropTypes.func,
  onFilter: PropTypes.func,
};

FilterOptions.displayName = 'FilterOptions';

export default FilterOptions;

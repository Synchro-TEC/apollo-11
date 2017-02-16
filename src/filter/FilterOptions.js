/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import _assign from 'lodash/assign';

class FilterOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.namesOfFields = [];
    this.fields = [];
    this.filtervalues = {};
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
      this.props.onClearAll();
    } else {
      for(let i = 0; i<this.fields.length; i++) {
        if(this.fields[i].type === 'radio' || this.fields[i].type === 'checkbox') {
          this.fields[i].checked = false;
        } else {
          this.fields[i].value = '';
        }
      }
    }
  }

  applyFilter() {
    this.fields.map((field) => {
      if(field.type === 'select-one' && field.value !== '') {
        this.filtervalues[field.name] = field.value;
      } else {
        if(field.type === 'radio' && field.checked) {
          this.filtervalues[field.name] = field.value;
        } else {
          if (field.type === 'checkbox' && field.checked) {
            if(this.filtervalues[field.name]) {
              this.filtervalues[field.name].push(field.value);
            } else {
              this.filtervalues[field.name] = [field.value];
            }
          }
        }
      }
    });
    this.props.onApplyFilter(this.filtervalues);
    this.filtervalues = {};
  }

  toggleVisibility() {
    this.setState({isOpen: !this.state.isOpen});
  }

  close() {
    this.setState({isOpen: false});
  }

  renderChildrenAndGetFieldNames(children) {
    return (
      React.Children.map(children, (child) => {
        if(Array.isArray(children)) {
          if(child.type === 'select') {
            this.namesOfFields.push(child.props.name);
          }
          if(typeof child !== 'string') {
            if(child.props.type === 'checkbox') {
              this.namesOfFields.push(child.props.name);
            }
            if(child.props.type === 'radio') {
              this.namesOfFields.push(child.props.name);
            }
            this.renderChildrenAndGetFieldNames(child.props.children);
          }
          return child;
        } else {
          if(!_isEmpty(children.props)) {
            if(children.props.type === 'radio') {
              this.namesOfFields(children.props.name);
            }
            this.renderChildrenAndGetFieldNames(child.props.children);
            return child;
          }
        }
      })
    );
  }

  render() {

    let filterOptionsStyles = _assign({width: '100%'}, {display: this.state.isOpen ? 'block': 'none'});

    let filterSpanStyles = _assign(
      {display: this.props.hasFilterOptions ? 'block': 'none'},
      {color: this.state.isOpen ? '#2196f3': '#455a64'}
    );

    return (
      <div>
        <span className='label-action at-last'
          onClick={() => this.toggleVisibility()}
          style={filterSpanStyles}> Filter
            <i className='fa fa-sliders fa-fw'/>
        </span>
        <section className='action-container' style={filterOptionsStyles}>
          <div className='sv-triangle on-right'/>
          <section className='action-container--content'>
            {this.renderChildrenAndGetFieldNames(this.props.children)}
            <footer>
              <button
                className='sv-button link link-danger sv-pull-left'
                onClick={(e) => { e.preventDefault(); this.clearAll();}}>
                  Clear All
              </button>
              <button
                className='sv-button link link-info sv-pull-right'
                onClick={(e) => { e.preventDefault(); this.applyFilter();}}>
                  Apply Filter
              </button>
              <button
                className='sv-button link link-cancel sv-pull-right'
                onClick={(e) => {  e.preventDefault(); this.close();}}>
                  Cancel
              </button>
            </footer>
          </section>
        </section>
      </div>
    );
  }
}

FilterOptions.propTypes = {
  hasFilterOptions: React.PropTypes.bool,
  onApplyFilter: React.PropTypes.func,
  onClearAll: React.PropTypes.func,
};

FilterOptions.displayName = 'FilterOptions';

export default FilterOptions;

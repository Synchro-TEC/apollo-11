/**
 * Created by gnf on 11/01/17.
 */
import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import _includes from 'lodash/includes';

class FilterOptions extends React.Component {

  constructor(props) {
    super(props);

    this.namesOfFields = [];
    this.fields = [];
    this.values = {};
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

  onChangeMaster() {
    this.fields.map((field) => {
      if(field.type === 'select-one' && !_isEmpty(field.value)) {
        this.values[field.name] = field.value;
      } else {
        if(field.type === 'radio' && field.checked) {
          this.values[field.name] = field.value;
        } else {
          if (field.type === 'checkbox' && field.checked) {
            if(this.values[field.name]) {
              this.values[field.name].push(field.value);
            } else {
              this.values[field.name] = [field.value];
            }
          }
        }
      }
    });
    this.values = {};
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
            if(children.props.type === 'checkbox') {
              console.log(children.props.name);
            }
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
    return (
      <section className='action-container'>
        <div className='sv-triangle on-right'/>
        <section className='action-container--content'>
          {this.renderChildrenAndGetFieldNames(this.props.children)}
          <footer>
            <button className='sv-button link link-danger sv-pull-left'>
              Clear All
            </button>
            <button className='sv-button link link-info sv-pull-right'
                    onClick={(e) => { e.preventDefault(); this.onChangeMaster(e)}}>Apply Filter
            </button>
            <button className='sv-button link link-cancel sv-pull-right'>Cancel</button>
          </footer>
        </section>
      </section>
    );
  }
}

FilterOptions.displayName = 'FilterOptions';

export default FilterOptions;

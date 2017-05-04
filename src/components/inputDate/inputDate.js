import React from 'react';
import PropTypes from 'prop-types';
import isDate from 'date-fns/is_date';
import format from 'date-fns/format';

import { convertBrazlianStringDateToDate, isValidKeyCode, validateStringBrazilianDate } from './inputDateUtils';

class InputDate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dateFormated: this._showDate(this.props.value)
    };
    this._charSlash = '/';
  }

  _onBlur(e) {
    if(this.props.clearDateWithError && !validateStringBrazilianDate(this.state.dateFormated)) {
      this.setState({dateFormated: ''});
      this.props.onChange({ dateInstance: null,
        name: e.target.name,
        userInput: ''});
    }
  }

  _onChange(e) {
    let stringDateFormated = this._showDate(e.target.value);

    this.setState({dateFormated: stringDateFormated});
    if(validateStringBrazilianDate(stringDateFormated)) {
      this.props.onChange({
        dateInstance: convertBrazlianStringDateToDate(stringDateFormated),
        name: e.target.name,
        userInput: stringDateFormated
      });
    } else {
      this.props.onChange({
        dateInstance: null,
        name: e.target.name,
        userInput: stringDateFormated
      });
    }
  }

  _showDate(date) {
    if(isDate(date)){
      return format(date, 'DD/MM/YYYY');
    } else if(date.length > 0) {
      let match = date.match(/^\d{2}([.-])\d{2}\1\d{4}$/);

      // trata se é uma string ISO como: "2015-01-01T02:00:00.000Z"
      if(date.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)) {
        return format(new Date(date), 'DD/MM/YYYY');
      }
      // trata string com a data completa como: "01.01.2015" ou "01-01-2015"
      else if (match !== null) {
        return match.input.split(match[1]).join('/');
      }
      // trata se a string esta incompleta e adiciona máscara se necessário
      else if (date.match(/^\d{2}$/) !== null  || date.match(/^\d{2}\/\d{2}$/) !== null) {
        return `${date}${this._charSlash}`;
      }
      else {
        return date;
      }
    }

    return '';
  }

  _onKeyDown(e) {
    let boolKeyCodeEsc = (e.keyCode === 27);

    if (isValidKeyCode(e)) {
      this._charSlash = e.keyCode === 8 ? '' : '/';
    } else if(boolKeyCodeEsc) {
      e.target.blur();
    } else {
      e.preventDefault();
    }
  }

  render() {
    return (
      <input className={this.props.className}
             disabled={this.props.disabled}
             maxLength='10'
             name={this.props.name}
             onBlur={(e) => { this._onBlur(e); }}
             onChange={(e) => { this._onChange(e); }}
             onKeyDown={(e) => { this._onKeyDown(e); }}
             placeholder={this.props.placeholder}
             type='text'
             value={this.state.dateFormated}
        />
    );
  }
}

InputDate.defaultProps = {
  clearDateWithError: true,
  disabled: false,
  placeholder: 'Insira uma data'
};

InputDate.propTypes = {
  className: PropTypes.string,
  clearDateWithError: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any
};

InputDate.displayName = 'InputDate';

export default InputDate;

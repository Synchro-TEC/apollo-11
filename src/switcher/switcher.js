import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import nanoid from 'nanoid';

const SwitchField = styled.div`
  overflow: hidden;
  margin: 0 0 10px 0;

  input {
    position: absolute !important;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    border: 0;
    overflow: hidden;
  }

  label {
    float: left;
    displsay: inline-block;
    background-color: #e4e4e4;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    text-shadow: none;
    padding: 6px 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    -webkit-transition: all 0.1s ease-in-out;
    -moz-transition: all 0.1s ease-in-out;
    -ms-transition: all 0.1s ease-in-out;
    -o-transition: all 0.1s ease-in-out;
    transition: all 0.1s ease-in-out;
    flex: 1 1 auto;
    margin-bottom: 0px;
  }

  label:hover {
    cursor: pointer;
  }

  input:checked + label {
    background-color: #a5dc86;
    background-color: #bad7ff;
  }

  label:first-of-type {
    border-radius: 2px 0 0 2px;
  }

  label:last-of-type {
    border-radius: 0 2px 2px 0;
  }
`;

const SwitchFieldTitle = styled.div`
  margin-bottom: 0px;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height: 32px;
`;

const Switcher = props => {
  const name = nanoid();

  const fields = props.fields.map(field => {
    const id = nanoid();
    return (
      <React.Fragment key={nanoid()}>
        <input
          type="radio"
          name={name}
          value={field.value}
          checked={field.value === props.currentValue}
          id={id}
          onChange={e => {
            props.changeHandler(e.target.value);
          }}
        />
        <label htmlFor={id}>{field.label}</label>
      </React.Fragment>
    );
  });

  return (
    <SwitchField>
      <SwitchFieldTitle>{props.title}</SwitchFieldTitle>
      <FlexContainer>{fields}</FlexContainer>
    </SwitchField>
  );
};

Switcher.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  currentValue: PropTypes.any,
  changeHandler: PropTypes.func.isRequired,
};

export default Switcher;

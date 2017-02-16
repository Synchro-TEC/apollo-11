import React from 'react';
import HermesAPI from './HermesApi';
import HermesStyles from './HermesStyles';
import classNames from 'classnames';

const HermesMessageItem = ({message}) => {

  const classButtonMap = {
    info: 'link-info',
    error: 'link-danger',
    success: 'link-primary',
    warning: 'link-warning'
  };

  let classes = classNames('sv-button link', classButtonMap[HermesAPI.context]);

  let deleteButton = message.isDeletable ?
    <button className={classes} onClick={() => HermesAPI.removeMessage(message.id)}>&times;</button> :
    '';

  return (
    <li style={HermesStyles.msgStyle}>
      {deleteButton}
      {message.text}
    </li>
  );
};

HermesMessageItem.propTypes = {
  message: React.PropTypes.object,
};

HermesMessageItem.displayName = 'HermesMessageItem';

export default HermesMessageItem;

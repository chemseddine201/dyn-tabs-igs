import React from 'react';
import PropTypes from 'prop-types';
const DefaulTabInner = function DefaulTabInner(props) {
  return (
    <div {...props.tabProps}>
      {props.children}
      {Object.prototype.hasOwnProperty.call(props, 'iconProps') && <span {...props.iconProps}></span>}
    </div>
  );
};
DefaulTabInner.propTypes /* remove-proptypes */ = {
  tabProps: PropTypes.object,
  children: PropTypes.node,
  iconProps: PropTypes.object,
};
export default DefaulTabInner;

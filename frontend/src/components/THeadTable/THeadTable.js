import React from 'react';
import PropTypes from 'prop-types';

import CleanButton from '../cleanButton/CleanButton';

function THeadTable(props) {
  const { title, sortMethod } = props;
  return (
    <th>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <p style={{ marginRight: '3px' }}>{title}</p>
        <CleanButton onClick={sortMethod}>
          <img alt="add button" src="/assets/images/filter_list.png" />
        </CleanButton>
      </div>
    </th>
  );
}

THeadTable.propTypes = {
  title: PropTypes.string.isRequired,
  sortMethod: PropTypes.func.isRequired,
};

export default THeadTable;

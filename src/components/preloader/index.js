/* eslint-disable import/no-anonymous-default-export */

import React from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';

export default props => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? '' : 'show'
      }`}>
      <Preloader
        use={ThreeDots}
        size={60}
        strokeWidth={6}
        strokeColor="#262626"
        duration={2000}
        className="loader-element"
      />
    </div>
  );
};

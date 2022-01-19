/* eslint-disable import/no-anonymous-default-export */

import React from 'react';
import { Preloader as Loader, ThreeDots } from 'react-preloader-icon';

const Preloader = props => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? '' : 'show'
      }`}>
      <Loader
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

export default Preloader;

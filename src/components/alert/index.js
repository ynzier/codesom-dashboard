import React from 'react';
import InfoIcon from './icons/InfoIcon';
import SuccessIcon from './icons/SuccessIcon';
import ErrorIcon from './icons/ErrorIcon';
import CloseIcon from './icons/CloseIcon';
import AuthService from 'services/auth.service';

const warningStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Prompt',
  width: '400px',
  boxSizing: 'border-box',
};
const errorStyle = {
  backgroundColor: '#E53455',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Prompt',
  width: '400px',
  boxSizing: 'border-box',
};
const successStyle = {
  backgroundColor: '#151515',
  color: 'white',
  padding: '10px',
  textTransform: 'uppercase',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Prompt',
  width: '400px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF',
};

const AlertTemplate = ({ message, options, style, close }) => {
  if (
    message == 'เซสชันหมดอายุ กรุณาล็อคอินใหม่อีกครั้ง' ||
    message == 'ไม่พบเซสชันโทเคนในระบบ!'
  ) {
    setTimeout(() => {
      AuthService.logoutDashboard();
    }, 3000);
  }
  return (
    <>
      {options.type === 'info' && (
        <div style={{ ...warningStyle, ...style }}>
          <InfoIcon />
          <span style={{ flex: 2 }}>{message}</span>
          <button onClick={close} style={buttonStyle}>
            <CloseIcon />
          </button>
        </div>
      )}
      {options.type === 'success' && (
        <div style={{ ...successStyle, ...style }}>
          <SuccessIcon />
          <span style={{ flex: 2 }}>{message}</span>
          <button onClick={close} style={buttonStyle}>
            <CloseIcon />
          </button>
        </div>
      )}
      {options.type === 'error' && (
        <div style={{ ...errorStyle, ...style }}>
          <ErrorIcon />
          <span style={{ flex: 2 }}>{message}</span>
          <button onClick={close} style={buttonStyle}>
            <CloseIcon />
          </button>
        </div>
      )}
    </>
  );
};

export default AlertTemplate;

import React, { memo, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Icon } from '@iconify/react';
import { Button } from 'antd';
const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({
  marker,
  zoom,
  center,
  onCenterChanged,
  setMapCenter,
  editable,
}) => {
  const { isLoaded, hasError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDVQ7VpCG8QO7OYtIFDZVGzQCmNld4bdm8', // ,
  });
  const mapRef = useRef(null);

  const handleOnLoad = useCallback(map => {
    mapRef.current = map;
  }, []);

  const handleOnUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleCenterChanged = useCallback(() => {
    if (mapRef.current !== undefined && mapRef.current !== null) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter !== undefined && onCenterChanged !== undefined) {
        onCenterChanged({
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        });
      }
    }
  }, [mapRef, onCenterChanged]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      onCenterChanged({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };
  if (!isLoaded) {
    return <div>{'loading'}</div>;
  }

  if (hasError) {
    return <div>{'errorMap'}</div>;
  }

  return (
    <GoogleMap
      onCenterChanged={() => {
        if (mapRef.current !== null) {
          handleCenterChanged();
        }
      }}
      onLoad={handleOnLoad}
      onUnmount={handleOnUnmount}
      mapContainerStyle={containerStyle}
      center={center}
      options={{ streetViewControl: false, draggable: editable ? true : false }}
      zoom={zoom}>
      <Marker position={marker} />
      <Button
        style={{
          bottom: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          width: 160,
          justifyContent: 'center',
          alignItems: 'center',
          height: '2rem',
        }}
        className="get-current-location"
        onClick={getCurrentLocation}>
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon icon="ic:baseline-gps-fixed" style={{ marginTop: 4 }} />
        </div>
        <div style={{ flex: 1 }}>ตำแหน่งปัจจุบัน</div>
      </Button>
    </GoogleMap>
  );
};

const memoMap = memo(MapComponent);
export { memoMap as Map };

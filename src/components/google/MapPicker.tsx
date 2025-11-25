// src/components/google/MapPicker.tsx
import React, { useState, useEffect } from 'react';
import { Map, Marker, GoogleApiWrapper, IProvidedProps } from 'google-maps-react';

interface MapPickerProps extends IProvidedProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = (props) => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: props.initialLat || 24.7136, // إحداثيات افتراضية (الرياض)
    lng: props.initialLng || 46.6753
  });

  // تحديث الموقع عند تغير القيم الأولية
  useEffect(() => {
    if (props.initialLat && props.initialLng) {
      setSelectedLocation({ lat: props.initialLat, lng: props.initialLng });
    }
  }, [props.initialLat, props.initialLng]);

  const handleMapClick = (_props: any, _map: any, clickEvent: any) => {
    const lat = clickEvent.latLng.lat();
    const lng = clickEvent.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    props.onLocationSelect(lat, lng);
  };

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <Map
        google={props.google}
        zoom={14}
        initialCenter={{ lat: 24.7136, lng: 46.6753 }}
        center={selectedLocation}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker position={selectedLocation} />
      </Map>
    </div>
  );
};

// تغليف المكون بـ GoogleApiWrapper
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBS8dQA1D-ZlPdC8AWIWm1LmRNrkdJb_Yg', // 🔴 ضع مفتاحك هنا
  language: 'ar'
})(MapPicker);
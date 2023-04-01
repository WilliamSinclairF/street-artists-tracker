import { GoogleMap, useLoadScript } from '@react-google-maps/api';

type Props = {
  children?: React.ReactNode;
  height: number;
  width: number;
  mapCenter: google.maps.LatLngLiteral | google.maps.LatLng;
  onClick: (e: google.maps.MapMouseEvent) => void;
};

const mapLibs: 'places'[] = ['places'];

const CustomizedGoogleMap = ({ children, mapCenter, width, height, onClick }: Props) => {
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: true,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: mapLibs,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (loadError) {
    return <p>Error loading map</p>;
  }

  return (
    <GoogleMap
      options={mapOptions}
      onClick={onClick}
      zoom={10}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ height, width }}>
      {children}
    </GoogleMap>
  );
};

export default CustomizedGoogleMap;

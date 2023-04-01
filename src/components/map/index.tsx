import { GoogleMap, useLoadScript } from '@react-google-maps/api';

type Props = {
  children?: React.ReactNode;
  height: number;
  width: number;
  mapCenter: google.maps.LatLngLiteral | google.maps.LatLng;
};

const Map = ({ children, mapCenter, width, height }: Props) => {
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: true,
    scrollwheel: true,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
    libraries: ['places'],
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
      zoom={12}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapContainerStyle={{ height, width }}
      mapContainerClassName="m-auto">
      {children}
    </GoogleMap>
  );
};

export default Map;

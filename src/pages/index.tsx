import { type NextPage } from 'next';

import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { api } from '@sat/utils/api';
import { Nav } from '@sat/components/nav/Nav';

const Home: NextPage = () => {
  /*   START OF MAP STUFF FOR TESTING
  stuff to get the map to show up to test the google API key, feel free to move it to a separate file or do whatever with it*/
  // const mapOptions: google.maps.MapOptions = {
  //   disableDefaultUI: true,
  //   clickableIcons: true,
  //   scrollwheel: true,
  // };

  // id rather be in vancouver
  // const mapCenter = { lat: 49.246292, lng: -123.116226 };

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  //   libraries: ['places'],
  // });

  // if (!isLoaded) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      <Nav />

      {/* <GoogleMap
        onClick={() => void true}
        options={mapOptions}
        zoom={12}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', flex: 1, height: '100vh', marginTop: '1em' }}>
        <MarkerF position={mapCenter} animation={google.maps.Animation.DROP} />
      </GoogleMap> */}
    </>
  );

  /* END OF MAP STUFF for testing */
};

export default Home;


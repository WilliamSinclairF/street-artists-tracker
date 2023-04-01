import { Nav } from '@sat/components/nav/Nav';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Map from '@sat/components/map';
import MapTabs from '../../components/map/MapTabs';
import { addDaysToDate } from '@sat/utils/addDaysToDate';

function map() {
  const session = useSession();
  const router = useRouter();

  const mapCenter = { lat: 49.246292, lng: -123.116226 };

  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, router]);

  const datesOfNextSevenDays = Array.from({ length: 7 }).map((_, i) => ({
    humanFriendlyDate: addDaysToDate(i).toLocaleString('en-us', { weekday: 'short', day: 'numeric', month: 'short' }),
    date: addDaysToDate(i),
  }));

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <div className="container m-auto grid h-full grid-cols-3">
          <div className="col-span-full">
            <MapTabs
              tabs={datesOfNextSevenDays}
              onValueChange={(e) => {
                console.log(e);
              }}
            />
          </div>

          <div className="col-span-2"></div>
          <div className="">
            <Map mapCenter={mapCenter} />
          </div>
        </div>
      </>
    )
  );
}
export default map;

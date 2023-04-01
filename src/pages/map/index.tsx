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
  const { data: sessionData } = useSession();

  const mapCenter = { lat: 49.246292, lng: -123.116226 };

  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
    }
  }, [session, router]);

  const currentDate = new Date();

  const datesOfNextSevenDays = Array.from({ length: 7 }).map((_, i) =>
    addDaysToDate(i).toLocaleString('en-us', { weekday: 'long', day: 'numeric', month: 'long' })
  );

  console.log(datesOfNextSevenDays);

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <div className="container m-auto grid h-full grid-cols-3">
          <div className="col-span-full">
            <MapTabs tabs={datesOfNextSevenDays} />
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

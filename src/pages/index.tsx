import { type NextPage } from 'next';

import { HomepageBanner } from '@sat/components/homepage/HomepageBanner';
import { Nav } from '@sat/components/nav/Nav';

const Home: NextPage = () => {
  return (
    <>
      <Nav position="" />
      <HomepageBanner />
    </>
  );
};

export default Home;

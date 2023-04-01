import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '@sat/utils/api';

import '@sat/styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss;

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

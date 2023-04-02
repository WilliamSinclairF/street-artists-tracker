import AuthButton from '../auth/AuthButton';
import { useSession } from 'next-auth/react';
import { api } from '@sat/utils/api';
import { useEffect } from 'react';

export const HomepageBanner = () => {
  const { data: sessionData } = useSession();

  const mutation = api.profileRouter.createOrUpdateProfile.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (data) => console.log(data),
  });

  useEffect(() => {
    const isArtist = localStorage.getItem('isArtist') === 'true';
    console.log('Stored isArtist value:', isArtist);

    mutation.mutate({
      isArtist,
      firstName: undefined,
      lastName: undefined,
      description: undefined,
    });
  }, []);

  return (
    <main
      className={`flex h-[100vh] items-center justify-center bg-slate-300 ${
        sessionData ? 'bg-[url("/images/banner-1-min.jpg")]' : 'bg-[url("/images/banner-3-min.jpg")]'
      } bg-cover bg-center`}>
      <div
        className="flex h-full w-full  items-center justify-center 
        bg-[#0c0d42]/75">
        <div className="content px-[10vw] text-center">
          {sessionData ? (
            <>
              <h2 className="text-5xl font-semibold text-white">
                Welcome back <span className="text-[#C84449]">{sessionData.user?.name}</span> 🚀!
              </h2>
              <h3 className="pt-2 text-2xl text-white">Check out some awesome artists in your City today!</h3>
              <a href={'/events'}>
                <button className="mt-5 rounded-full bg-orange-400 px-8 py-3 font-semibold text-white hover:bg-orange-500">
                  Explore Artists
                </button>
              </a>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-semibold text-white">
                Welcome to <span className="text-[#C84449]">Street Artist</span> Tracker!
              </h2>{' '}
              <h3 className="pt-2 text-2xl text-white">A place to find local artists performing daily in your city</h3>
            </>
          )}

          {!sessionData && (
            <>
              <p className="py-5 text-xl text-white">
                Sign up as an <span className="font-semibold text-orange-400">Artist</span> or an{' '}
                <span className="font-semibold text-blue-500">Art Lover</span> 👇
              </p>
              <div className="auth flex justify-center gap-3 pt-1">
                <AuthButton
                  colour="bg-orange-500"
                  hoverColour="bg-orange-400"
                  signInText="Artist"
                  signOutText="SignOut"
                  isArtist={true}
                />
                <AuthButton
                  colour="bg-blue-700"
                  hoverColour="bg-blue-600"
                  signInText="Art Lover"
                  signOutText="SignOut"
                  isArtist={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

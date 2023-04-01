import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AuthButtonProps {
  colour: string;
  hoverColour: string;
  signInText: string;
  signOutText: string;
  isArtist: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ colour, hoverColour, signInText, signOutText, isArtist }) => {
  const { data: sessionData } = useSession();
  const [localIsArtist, setLocalIsArtist] = useState<boolean | null>(null);

  useEffect(() => {
    const storedIsArtist = localStorage.getItem('isArtist');
    if (storedIsArtist !== null) {
      setLocalIsArtist(Boolean(storedIsArtist));
    }
  }, []);

  const handleButtonClick = () => {
    if (sessionData) {
      void signOut();
      localStorage.removeItem('isArtist');
      setLocalIsArtist(null);
    } else {
      void signIn();
      localStorage.setItem('isArtist', String(isArtist));
      setLocalIsArtist(isArtist);
    }
  };

  return (
    <div>
      <button
        className={`rounded-full ${colour} px-8 py-3 text-white no-underline transition hover:${hoverColour}`}
        onClick={handleButtonClick}>
        {sessionData ? signOutText : signInText}
      </button>
    </div>
  );
};

export default AuthButton;

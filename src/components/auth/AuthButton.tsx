import { signIn, signOut, useSession } from 'next-auth/react';

interface AuthButtonProps {
  colour: string;
  hoverColour: string;
  signInText: string;
  signOutText: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ colour, hoverColour, signInText, signOutText }) => {
  const { data: sessionData } = useSession();

  return (
    <div>
      <button
        className={`rounded-full ${colour} px-8 py-3 text-white no-underline transition hover:${hoverColour}`}
        onClick={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? signOutText : signInText}
      </button>
    </div>
  );
};

export default AuthButton;

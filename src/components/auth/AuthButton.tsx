import { signIn, signOut, useSession } from 'next-auth/react';

const AuthButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div>
      <button
        className="rounded-full bg-slate-800 px-8 py-3 text-white no-underline transition hover:bg-slate-600"
        onClick={sessionData ? () => void signOut() : () => void signIn()}>
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};

export default AuthButton;

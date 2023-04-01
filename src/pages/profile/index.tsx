import { Nav } from '@sat/components/nav/Nav';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { api } from '@sat/utils/api';

function Profile() {
  const session = useSession();
  const router = useRouter();
  const { data: sessionData } = useSession();

  // Retrieve profileData from the API
  const { data: profileData } = api.profileRouter.getOne.useQuery();
  const [firstName, setFirstName] = useState(profileData?.firstName);
  const [lastName, setLastName] = useState(profileData?.lastName);
  const [description, setDescription] = useState(profileData?.description);
  const [editing, setEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const mutation = api.profileRouter.createOrUpdateProfile.useMutation({
    onError: (error) => console.log(error),
    onSuccess: (data) => console.log(data),
  });

  // Update the firstName state when the profileData changes
  useEffect(() => {
    setFirstName(profileData?.firstName);
    setLastName(profileData?.lastName);
    setDescription(profileData?.description);
  }, [profileData]);

  // Navigating to Home is not authenticated
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router
        .push('/')
        .then(() => null)
        .catch(() => null);
    }
  }, [session, router]);

  function editHandler() {
    setEditing(true);
  }

  function saveHandler() {
    setEditing(false);

    if (firstNameInput.length) {
      setFirstName(firstNameInput);
    }

    if (lastNameInput.length) {
      setLastName(lastNameInput);
    }

    if (descriptionInput.length) {
      setDescription(descriptionInput);
    }

    const isArtist = localStorage.getItem('isArtist') === 'true';
    console.log('Stored isArtist value:', isArtist);

    mutation.mutate({
      description: descriptionInput.length > 0 ? descriptionInput : description,
      firstName: firstNameInput.length > 0 ? firstNameInput : firstName,
      lastName: lastNameInput.length > 0 ? lastNameInput : lastName,
      isArtist,
    });
  }

  const getEventsByUser = api.eventRouter.getEventsCreatedByCurrentUser.useQuery();

  console.log(getEventsByUser.data);

  return (
    session.status === 'authenticated' && (
      <>
        <Nav position="relative" />
        <main>
          <div className="banner h-[25vh] bg-slate-400 bg-[url('/images/banner-4-min.jpg')] bg-cover bg-[center_bottom_-3rem]"></div>
          <div className="panel flex h-[71.5vh]">
            <div className="left h-full bg-slate-300 px-8">
              <div className="-mt-16 flex flex-col items-center">
                {sessionData?.user?.image && (
                  <>
                    <div
                      className="h-[128px] w-[128px] rounded-full bg-slate-200"
                      style={{
                        backgroundImage: `url(${sessionData?.user?.image || ''})`,
                        backgroundSize: 'cover',
                        outline: '3px solid rgb(125 211 252)',
                      }}></div>
                    <div className="mt-2">
                      {localStorage.getItem('isArtist') === 'true' ? (
                        <div className="badge rounded-md bg-orange-500 px-3 py-0.5 text-white">Artist</div>
                      ) : (
                        <div className="badge rounded-md bg-blue-500 px-3 py-0.5 text-white">Art Lover</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="right flex w-full flex-wrap content-baseline gap-12 pl-8 pr-[10vw] pt-4">
              <div className="min-w-[325px] self-start rounded-md bg-slate-100 p-3">
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold">Profile Information</h1>
                  <div className="edit float-right">
                    {editing ? (
                      <button className="rounded-md bg-green-600 px-2 py-1 text-white" onClick={saveHandler}>
                        Save
                      </button>
                    ) : (
                      <button className="rounded-md bg-blue-500 px-2 py-1 text-white" onClick={editHandler}>
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-3">
                  <p className="pb-2">
                    First name:{' '}
                    {editing ? (
                      <input
                        className="ml-2 border-2 border-indigo-600 px-1"
                        placeholder={firstName}
                        value={firstNameInput}
                        onChange={(e) => setFirstNameInput(e.target.value)}
                      />
                    ) : (
                      firstName
                    )}
                  </p>
                  <p className="pb-2">
                    Last name:{' '}
                    {editing ? (
                      <input
                        className="ml-2 border-2 border-indigo-600 px-1"
                        placeholder={lastName}
                        value={lastNameInput}
                        onChange={(e) => setLastNameInput(e.target.value)}
                      />
                    ) : (
                      lastName
                    )}
                  </p>
                  <p className="pb-2">
                    Description:{' '}
                    {editing ? (
                      <input
                        className="border-2 border-indigo-600 px-1"
                        placeholder={description}
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                      />
                    ) : (
                      description
                    )}
                  </p>
                </div>
              </div>
              <div className="w-[40vw] min-w-[325px] max-w-[600px] self-start rounded-md bg-slate-100 p-4 py-2">
                <h2 className="text-2xl font-semibold">Your Upcoming Events</h2>
                <div className="events">
                  <ul className="grid grid-cols-2 gap-4">
                    {getEventsByUser.data?.map((event) => (
                      <li className="my-2 rounded-md bg-slate-400 p-2">
                        <p className="text-xl font-semibold">{event.title}</p>
                        <p className="font-semibold text-sm">{event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)(st|nd|rd|th)/, '$1<span>$2</span>')}</p>

                        <p className="text-md">{event.description}</p>
                        <p className="text-md">Attendees: {event.attendees.length}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  );
}

export default Profile;

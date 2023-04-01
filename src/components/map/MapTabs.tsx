import React from 'react';

type Props = {
  tabs: string[];
};

const MapTabs = ({ tabs }: Props) => {
  return (
    <ul className="flex flex-wrap border-b text-center text-sm font-medium" role="tablist">
      {tabs.map((tab) => (
        <li className="mr-2" key={tab}>
          <div role="tab" className="inline-block cursor-pointer select-none rounded-t-lg bg-gray-100 p-4 text-black">
            {tab}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MapTabs;

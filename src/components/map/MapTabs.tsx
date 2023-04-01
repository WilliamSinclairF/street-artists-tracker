import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

type Props = {
  tabs: { humanFriendlyDate: string; date: Date }[];
  onValueChange: (tabData: { humanFriendlyDate: string; date: Date }) => void;
};

const activeTabBorderClasses = 'data-[state=active]:border-x-2 data-[state=active]:border-t-2';
const inactiveTabBorderClasses = 'data-[state=inactive]:border-b-2';

const MapTabs = ({ tabs, onValueChange }: Props) => {
  const handleValueChange = (tabIndex: string) => {
    const parsedIndex = parseInt(tabIndex);
    if (isNaN(parsedIndex)) {
      console.error('Tab index is not a number');
      return;
    }

    const newActiveTab = tabs?.[parsedIndex];

    if (!newActiveTab) {
      console.error('Tab index is out of bounds');
      return;
    }

    onValueChange(newActiveTab);
  };

  return (
    <Tabs.Root onValueChange={handleValueChange} defaultValue="0" className="flex flex-col p-2">
      <Tabs.List className="flex flex-shrink-0">
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            key={tab.humanFriendlyDate}
            value={String(index)}
            className={`flex h-11  flex-1 select-none items-center justify-center bg-white p-10 text-sm leading-none ${activeTabBorderClasses} ${inactiveTabBorderClasses}`}>
            {tab.humanFriendlyDate}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab, index) => (
        <Tabs.Content key={tab.humanFriendlyDate} value={String(index)}>
          {tab.humanFriendlyDate}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default MapTabs;

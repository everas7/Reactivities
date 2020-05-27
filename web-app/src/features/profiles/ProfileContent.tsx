import React, { useEffect } from 'react';
import { Tab } from 'semantic-ui-react';
import { ProfilePhotos } from './ProfilePhotos';
import { ProfileDescription } from './ProfileDescription';
import { ProfileFollowings } from './ProfileFollowings';

const panes = [
  { menuItem: 'About', render: () => <ProfileDescription /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  {
    menuItem: 'Activities',
    render: () => <Tab.Pane>Activities content</Tab.Pane>
  },
  { menuItem: 'Followers', render: () => <ProfileFollowings /> },
  { menuItem: 'Following', render: () => <ProfileFollowings /> }
];

interface IProps {
  setActiveTab: (tabIndex: number) => void;
}

export const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
  useEffect(() => {
    return () => setActiveTab(1);
  }, [setActiveTab]);
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      defaultActiveIndex={1}
      onTabChange={(e, data) => setActiveTab(Number(data.activeIndex))}
    />
  );
};

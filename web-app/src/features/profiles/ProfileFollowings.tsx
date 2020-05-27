import React, { useContext, useEffect } from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { observer } from 'mobx-react-lite';

export const ProfileFollowings = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    followings,
    loading,
    activeTab,
  } = rootStore.profileStore;

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map(following => (
              <ProfileCard key={following.username} profile={following} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileContent } from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import {ProfilePagePlaceholder} from './ProfilePagePlaceholder';

export const ProfilePage = observer(() => {
  const params = useParams<{ username: string }>();
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    loadProfile,
    loadingProfile,
    loading,
    followProfile,
    unfollowProfile,
    isCurrentUser,
    setActiveTab
  } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(params.username);
  }, [loadProfile, params.username]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {loadingProfile ? (
          <ProfilePagePlaceholder />
        ) : (
          <>
            <ProfileHeader
              profile={profile!}
              loading={loading}
              follow={followProfile}
              isCurrentUser={isCurrentUser}
              unfollow={unfollowProfile}
            />
            <ProfileContent
              key={profile!.username}
              setActiveTab={setActiveTab}
            />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});

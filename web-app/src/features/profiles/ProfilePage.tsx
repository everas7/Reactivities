import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileContent } from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useParams } from 'react-router';
import { LoadingComponent } from '../../app/common/loader/LoadingComponent';
import { observer } from 'mobx-react-lite';

export const ProfilePage = observer(() => {
  const params = useParams<{ username: string }>();
  const rootStore = useContext(RootStoreContext);
  const { profile, loadProfile, loadingProfile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(params.username);
  }, [loadProfile, params.username]);
  
    if (loadingProfile)
      return <LoadingComponent content="Loading profile..." />;


    return (
      <Grid>
        <Grid.Column width={16}>
          <ProfileHeader profile={profile!} />
          <ProfileContent />
        </Grid.Column>
      </Grid>
    );
});


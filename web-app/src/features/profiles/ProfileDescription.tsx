import React, { useContext, useState } from 'react';
import { Header, Icon, Tab, Grid, Button, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ProfileEditForm } from './ProfileEditForm';
import { IProfileFormValues } from '../../app/models/profile';

export const ProfileDescription = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { profile, updateProfile, updatingProfile } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);

  const handleUpdateProfile = (values: IProfileFormValues) => {
    updateProfile(values).then(() => setEditMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header as="h2" floated="left">
            <Icon name="user" />
            <Header.Content>About {profile!.displayName}</Header.Content>
          </Header>
          <Button
            content={editMode ? 'Cancel' : 'Edit profile'}
            basic
            disabled={updatingProfile}
            onClick={() => setEditMode(!editMode)}
            floated="right"
          />
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm handleSubmit={handleUpdateProfile} />
          ) : (
            profile!.bio
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});

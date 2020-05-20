import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useParams, } from 'react-router-dom';
import { LoadingComponent } from '../../../app/common/loader/LoadingComponent';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import {ActivityDetailsChat } from './ActivityDetailsChat';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';
import { RootStoreContext } from '../../../app/stores/rootStore';

function ActivityDetails() {
  const rootStore = useContext(RootStoreContext);
  const params = useParams<{id: string}>();
  const {
    activity,
    loadActivity,
    loadingActivities
  } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(params.id);
  }, [loadActivity, params.id]);

  if (loadingActivities) return <LoadingComponent content="Loading activity..."/>

  if (!activity) return <h1>Oops something went wrong...</h1>
  return (
    <Grid>
      <Grid.Column width={10}>
      <ActivityDetailsHeader activity={activity} />
      <ActivityDetailsInfo activity={activity} />
      <ActivityDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSidebar attendees={activity.attendees}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);

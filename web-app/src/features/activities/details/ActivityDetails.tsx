import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { useParams, } from 'react-router-dom';
import { LoadingComponent } from '../../../app/components/loader/LoadingComponent';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import {ActivityDetailsChat } from './ActivityDetailsChat';
import {ActivityDetailsSidebar } from './ActivityDetailsSidebar';

function ActivityDetails() {
  const activityStore = useContext(ActivityStore);
  const params = useParams<{id: string}>();
  const {
    activity,
    loadActivity,
    loadingActivities
  } = activityStore;

  useEffect(() => {
    loadActivity(params.id);
  }, [loadActivity, params.id]);

  if (loadingActivities || !activity) return <LoadingComponent content="Loading activity..."/>

  return (
    <Grid>
      <Grid.Column width={10}>
      <ActivityDetailsHeader activity={activity} />
      <ActivityDetailsInfo activity={activity} />
      <ActivityDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSidebar/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);

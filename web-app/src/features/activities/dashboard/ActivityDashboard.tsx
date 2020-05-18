import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import {RootStoreContext} from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/common/loader/LoadingComponent';

function ActivityDashboard() {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingActivities} =rootStore.activityStore;
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingActivities)
    return <LoadingComponent content="Loading activities..." />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);

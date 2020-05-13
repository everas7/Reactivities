import React, { useEffect, useState, SyntheticEvent, useContext, } from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import { LoadingComponent } from '../components/loader/LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

function App() {

  const activityStore = useContext(ActivityStore);
  const [selectedActivity, setSelectedActivity] = useState<IActivity| null>(null);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleUpdateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        activityStore.loadActivities();
        setSelectedActivity(activity);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id)
      .then(() => {
        activityStore.loadActivities();  
      })
      .then(() => setSubmitting(false));
  }
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingActivities) return <LoadingComponent content="Loading activities..."/>;

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          setSelectedActivity={setSelectedActivity}
          setEditMode={setEditMode}
          updateActivity={handleUpdateActivity}
          deleteActivity={handleDeleteActivity}
          target={target}
        />
      </Container>
    </>
  );
}

export default observer(App);

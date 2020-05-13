import React from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { ActivityList } from './ActivityList';
import { ActivityDetails } from '../details/ActivityDetails';
import { ActivityForm } from '../form/ActivityForm';

interface IProps {
  activities: IActivity[];
  selectedActivity: IActivity | null;
  selectActivity: (id: string) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (selectedActivity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  updateActivity: (activity: IActivity) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectedActivity,
  selectActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  updateActivity,
  deleteActivity,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList 
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity} 
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            setEditMode={setEditMode}
          />
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}
            activity={selectedActivity}
            createActivity={createActivity}
            updateActivity={updateActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};
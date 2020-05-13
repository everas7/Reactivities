import React, { SyntheticEvent, useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import { ActivityDetails } from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (selectedActivity: IActivity | null) => void;
  updateActivity: (activity: IActivity) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  setEditMode,
  setSelectedActivity,
  updateActivity,
  deleteActivity,
  target,
}) => {
  const activityStore = useContext(ActivityStore);
  const {selectedActivity, editMode} = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList 
          deleteActivity={deleteActivity} 
          target={target}          
        />
      </Grid.Column>
      <Grid.Column width={6}>
        { selectedActivity && !editMode && (
          <ActivityDetails
            setSelectedActivity={setSelectedActivity}
            setEditMode={setEditMode}
          />
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}
            updateActivity={updateActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);

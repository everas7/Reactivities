import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import ActivityListItem from './ActivityListItem';

function ActivityList() {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;
  console.log(activitiesByDate, 'actividades');
  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <>
          <Label key={group} size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {activities.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </>
      ))}
    </>
  );
}

export default observer(ActivityList);

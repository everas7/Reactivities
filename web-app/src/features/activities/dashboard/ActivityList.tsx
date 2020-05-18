import React, { useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {RootStoreContext} from '../../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';
import { format } from 'date-fns';

function ActivityList() {
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore;

  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <>
          <Label key={group} size="large" color="blue">
            {format(group, 'eeee do MMMM')}
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

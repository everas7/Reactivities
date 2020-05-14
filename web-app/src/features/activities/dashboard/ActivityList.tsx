import React, { useContext } from 'react';
import { Item, Button, Segment, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { NavLink } from 'react-router-dom';

function ActivityList() {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate: activities,
    submitting,
    target,
    deleteActivity
  } = activityStore;
  
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  name={activity.id}
                  loading={submitting && target === activity.id}
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={e => deleteActivity(e, activity.id)}
                />
                <Button
                  as={NavLink} to={`/activities/${activity.id}`}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}

export default observer(ActivityList);

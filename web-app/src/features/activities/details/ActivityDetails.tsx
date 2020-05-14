import React, { useContext, useEffect } from 'react';
import { Card, Image, ButtonGroup, Button } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory, } from 'react-router-dom';
import { LoadingComponent } from '../../../app/components/loader/LoadingComponent';

function ActivityDetails() {
  const activityStore = useContext(ActivityStore);
  const params = useParams<{id: string}>();
  const history = useHistory();
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
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <ButtonGroup widths={2}>
          <Button
            onClick={() => history.push(`/activities/manage/${activity!.id}`)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => history.push('/activities')}
            basic
            color="grey"
            content="Cancel"
          />
        </ButtonGroup>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);

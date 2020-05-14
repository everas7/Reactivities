import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { useParams, useHistory } from 'react-router';

function ActivityForm() {
  const activityStore = useContext(ActivityStore);
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const {
    activity: baseActivity,
    createActivity,
    editActivity,
    submitting,
    loadActivity,
    clearActivity
  } = activityStore;

  const [activity, setActivity] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    category: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (params.id && activity.id.length === 0) {
      loadActivity(params.id).then(
        () => baseActivity && setActivity(baseActivity)
      );
    }
    return clearActivity;
  }, [
    loadActivity,
    clearActivity,
    params.id,
    baseActivity,
    activity.id.length
  ]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleFormSubmission = () => {
    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleFormSubmission}>
            <Form.Input
              placeholder="Title"
              value={activity.title}
              name="title"
              onChange={handleInputChange}
            />
            <Form.TextArea
              placeholder="Description"
              rows={2}
              value={activity.description}
              name="description"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Category"
              value={activity.category}
              name="category"
              onChange={handleInputChange}
            />
            <Form.Input
              type="datetime-local"
              placeholder="Date"
              value={activity.date}
              name="date"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="City"
              value={activity.city}
              name="city"
              onChange={handleInputChange}
            />
            <Form.Input
              placeholder="Venue"
              value={activity.venue}
              name="venue"
              onChange={handleInputChange}
            />
            <Button
              loading={submitting}
              floated="right"
              type="submit"
              positive
              content="Submit"
            />
            <Button
              onClick={() => history.push(`/activities/${activity.id}`)}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityForm);

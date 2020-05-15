import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { useParams, useHistory } from 'react-router';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { DateInput } from '../../../app/common/form/DateInput';
import { category } from './constants';
import {
  ActivityFormValues
} from '../../../app/models/activity';
import { combineDateAndTime } from '../../../app/common/util/util';
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';

const validate = combineValidators({
  title: isRequired({message: 'The activity title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
});

function ActivityForm() {
  const activityStore = useContext(ActivityStore);
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      loadActivity(params.id)
        .then(activity => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, params.id]);


  const handleFinalFormSubmit = (values: any) => {
    const datetime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = datetime;
    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  console.log(activity.title, 'title');

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            validate={validate}
            initialValues={activity}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field placeholder="Title" name="title" component={TextInput} />
                <Field
                  placeholder="Description"
                  name="description"
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  name="category"
                  component={SelectInput}
                  options={category}
                />
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    name="date"
                    date
                    component={DateInput}
                  />
                  <Field
                    placeholder="Time"
                    time
                    name="time"
                    component={DateInput}
                  />
                </Form.Group>
                <Field placeholder="City" name="city" component={TextInput} />
                <Field placeholder="Venue" name="venue" component={TextInput} />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated="right"
                  type="submit"
                  positive
                  content="Submit"
                />
                <Button
                  disabled={loading}
                  onClick={() => history.push(`/activities/${activity.id}`)}
                  floated="right"
                  type="button"
                  content="Cancel"
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityForm);

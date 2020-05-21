import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { DateInput } from '../../../app/common/form/DateInput';
import { category } from './constants';
import { ActivityFormValues } from '../../../app/models/activity';
import { combineDateAndTime } from '../../../app/common/util/util';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Wizard } from '../../../app/common/wizard/Wizard';
import { WizardPage } from '../../../app/common/wizard/WizardPage';

const validatePage1 = combineValidators({
  title: isRequired({ message: 'The activity title is required' }),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )()
});

const validatePage2 = combineValidators({
  category: isRequired('Category'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

const validatePage3 = combineValidators({
  city: isRequired('City'),
  venue: isRequired('Venue')
});

function ActivityForm() {
  const rootStore = useContext(RootStoreContext);
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = rootStore.activityStore;

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

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
            <Wizard
              initialValues={activity}
              loading={loading}
              submitting={submitting}
              onSubmit={handleFinalFormSubmit}
            >
              <WizardPage validate={validatePage1}>
                <Field placeholder="Title" name="title" component={TextInput} />
                <Field
                  placeholder="Description"
                  name="description"
                  rows={3}
                  component={TextAreaInput}
                />
              </WizardPage>
              <WizardPage validate={validatePage2}>
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
              </WizardPage>
              <WizardPage validate={validatePage3}>
                <Field placeholder="City" name="city" component={TextInput} />
                <Field placeholder="Venue" name="venue" component={TextInput} />
              </WizardPage>
            </Wizard>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityForm);

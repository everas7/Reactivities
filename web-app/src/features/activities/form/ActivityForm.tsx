import React, { useState, FormEvent } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity | null;
  createActivity: (activity: IActivity) => void;
  updateActivity: (activity: IActivity) => void;
  submitting: boolean;
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: baseActivity,
  createActivity,
  updateActivity,
  submitting
}) => {
  const initializeForm = (): IActivity => {
    return (
      baseActivity || {
        id: '',
        title: '',
        description: '',
        date: '',
        category: '',
        city: '',
        venue: ''
      }
    );
  };

  const [activity, setActivity] = useState(initializeForm);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleFormSubmission = () => {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity);
    } else {
      updateActivity(activity);
    }
  };

  return (
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
          onClick={() => setEditMode(false)}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

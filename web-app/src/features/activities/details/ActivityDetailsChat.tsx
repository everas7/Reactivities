import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Link } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { formatDistance } from 'date-fns';

export const ActivityDetailsChat = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);
    return stopHubConnection;
  }, [createHubConnection, stopHubConnection, activity]);

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments &&
            activity.comments.map(comment => (
              <Comment>
                <Comment.Avatar src={comment.image || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form
                reply
                onSubmit={() => handleSubmit()!.then(() => form.reset())}
              >
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={2}
                  placeholder="Add your comment"
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
});

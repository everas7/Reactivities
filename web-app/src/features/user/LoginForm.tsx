import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Label, Header } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { combineValidators, isRequired } from 'revalidate';
import { FORM_ERROR } from 'final-form';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password')
});

export const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch(error => ({
          [FORM_ERROR]: error
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        invalid,
        pristine,
        submitError,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header color="teal" textAlign="center">
            <h2>Log into Reactivities</h2>
          </Header>
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {(submitError && submitError.status === 401) && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} text="Email or password is incorrect" />
          )}
          <Button
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            fluid
            color="teal"
            content="Login"
          />
        </Form>
      )}
    />
  );
};

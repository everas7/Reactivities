import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import { Form, Button } from 'semantic-ui-react';
import { Form as FinalForm, Field } from 'react-final-form';
import { IProfileFormValues } from '../../app/models/profile';
import { TextInput } from '../../app/common/form/TextInput';
import { TextAreaInput } from '../../app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';

interface IProps {
  handleSubmit: (values: IProfileFormValues) => void;
}

const validate = combineValidators({
  displayName: isRequired('Display name'),
});

export const ProfileEditForm: React.FC<IProps> = observer(
  ({ handleSubmit }) => {
    const rootStore = useContext(RootStoreContext);
    const { profile, updatingProfile } = rootStore.profileStore;
    return (
      <FinalForm
        onSubmit={handleSubmit}
        initialValues={profile!}
        validate={validate}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="displayName"
              placeholder="Display Name"
              component={TextInput}
            />
            <Field
              name="bio"
              placeholder="Bio"
              rows={3}
              component={TextAreaInput}
            />
            <Button
              positive
              disabled={invalid || pristine}
              loading={updatingProfile}
              content="Update profile"
              floated="right"
            />
          </Form>
        )}
      />
    );
  }
);

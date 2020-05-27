import React, { useState, ReactElement } from 'react';
import { Form  as FinalForm} from 'react-final-form';
import { Button, Form } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

interface IProps {
  onSubmit: (values: {}) => void;
  loading: boolean;
  submitting: boolean;
  initialValues: {};
}

export const Wizard: React.FC<IProps> = observer(({
  onSubmit,
  initialValues,
  loading,
  submitting,
  children
}) => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState(initialValues);

  const next = (values: {}) => {
    setValues(values);
    setPage(Math.min(page + 1, (children! as []).length - 1));
  };

  const previous = () => {
    setPage(Math.max(page - 1, 0));
  };

  /**
   * NOTE: Both validate and handleSubmit switching are implemented
   * here because 🏁 Redux Final Form does not accept changes to those
   * functions once the form has been defined.
   */

  const validate = (values: {}) => {
    const activePage = React.Children.toArray(children)[page];
    return (activePage as ReactElement).props.validate
      ? (activePage as ReactElement).props.validate(values)
      : {};
  };

  const handleSubmit = (values: {}) => {
    const isLastPage = page === React.Children.count(children) - 1;
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next(values);
    }
  };

  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;
  return (
    <FinalForm
      initialValues={values}
      validate={validate}
      onSubmit={handleSubmit}
      render={({ handleSubmit, invalid }) => (
        <Form onSubmit={handleSubmit} loading={loading}>
          {activePage}
          <div className="buttons">
            {!isLastPage && (
              <Button
                floated="right"
                disabled={loading}
                type="submit"
                positive
                content="Next »"
              />
            )}
            {isLastPage && (
              <Button
                loading={submitting}
                disabled={loading || invalid}
                floated="right"
                type="submit"
                positive
                content="Submit"
              />
            )}
            {page > 0 && (
              <Button
                disabled={loading}
                floated="right"
                type="button"
                onClick={previous}
                color="grey"
                content="« Previous"
              />
            )}
          </div>
        </Form>
      )}
    />
  );
});

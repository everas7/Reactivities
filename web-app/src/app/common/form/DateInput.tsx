import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';
import {DateTimePicker } from 'react-widgets';

interface IProps
  extends FieldRenderProps<Date>,
    FormFieldProps {}

export const DateInput: React.FC<IProps> = ({
  id = null,
  input,
  width,
  date= false,
  time= false,
  placeholder,
  meta: { error, touched },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        date={date}
        time={time}
        {...rest}
      />
      {touched && !!error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

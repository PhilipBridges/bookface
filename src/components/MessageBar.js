import React from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import * as yup from 'yup'
import { withRouter } from 'react-router-dom'

import '../Style/Form.css';

const MessageBar = props => {
  const {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = props;
  return (
    <Form>
      <Form.Field >
        <Input
          id="target"
          type="hidden"
          autoComplete="off"
          onChange={handleChange}
          value={values.target}
          fluid
          transparent={true}
        />
      </Form.Field>
      <Form.Field>
        <Input
          id="text"
          onChange={handleChange}
          value={values.text}
          type="text"
          placeholder=""
          fluid
          autoComplete="off"
          autoFocus='true'
        />
      </Form.Field>
      <Button style={{ display: 'none' }} type="submit" size='mini' disabled={isSubmitting} onClick={handleSubmit}>Submit</Button>
    </Form>
  );
};

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($target: String!, $text: String!) {
    createMessage(target: $target, text: $text) {
      text
      target {
        id
      }
    }
  }
`

export default compose(
  withRouter,
  graphql(CREATE_MESSAGE_MUTATION),
  withFormik({
    mapPropsToValues: (props) => ({ target: props.target, text: '', error: '' }),
    validationSchema: yup.object().shape({
      target: yup.string()
        .required('Username is required.'),
      text: yup.string()
        .required('You must input a message.'),
    }),
    handleSubmit: async (
      values,
      { props: { target, text, errors, mutate, history }, setFieldValue, setSubmitting, setFieldError },
    ) => {
      const response = await mutate({
        variables: { target: values.target, text: values.text, error: values.error },
      })

      const valid = response.data.createMessage.target

      if (valid !== null) {
        setFieldValue('text', '')
        setSubmitting(false)
      } else {
        setSubmitting(false)
        setFieldError("error", { target: "User not found." })
      }
    },
    displayName: 'MessageBar', // helps with React DevTools
  }))(MessageBar);


import React from 'react';
import { Form, Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import * as yup from 'yup'
import { withFormik } from 'formik';

import { Link } from 'react-router-dom'

import '../Style/Form.css';

const Login = props => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = props;
  return (
    <Container className="pt4" text>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field >
          <Input
            id="email"
            type="text"
            autoComplete="email"
            onChange={handleChange}
            value={values.email}
            placeholder="Email"
            fluid
            className={errors.email && touched.email ? 'text-input error' : 'text-input'}
          />
        </Form.Field>

        {errors.email &&
          touched.email && <div className="input-feedback">{errors.email}</div>}

        <Form.Field>
          <Input
            id="password"
            onChange={handleChange}
            value={values.password}
            type="password"
            placeholder="Password"
            fluid
            autoComplete="current-password"
            className={errors.password && touched.password ? 'text-input error' : 'text-input'}
          />
        </Form.Field>
        <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>Submit</Button>
      </Form>
      {errors.password &&
        touched.password && <div className="input-feedback">{errors.password}</div>}
      {props.errors.error && <div>{props.errors.error.email}</div>}
      <div>
        ...or <Link to="/register">Register!</Link>
      </div>
    </Container>
  );
};

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(loginMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '', error: '' }),
    validationSchema: yup.object().shape({
      email: yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
      password: yup.string()
        .required('Invalid Password.'),
    }),
    handleSubmit: async (
      values,
      { props: { email, password, errors, mutate, history }, setSubmitting, setFieldError },
    ) => {
      const response = await mutate({
        variables: { password: values.password, email: values.email, error: values.errors, user: values.user },
      });
      const {
        token
      } = response.data.login;

      if (token !== null) {
        await localStorage.setItem('token', token);
        setSubmitting(false);
        window.location.reload()
      } else {
        setSubmitting(false)
        setFieldError("error", { email: "User not found." })
      }
    },
    displayName: 'LoginForm', // helps with React DevTools
  }))(Login);
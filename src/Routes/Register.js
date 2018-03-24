import React from 'react';
import { Form, Button, Input, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom'


class Register extends React.Component {
  state = {
    name: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onSubmit = async e => {
    const { name, email, password } = this.state
    await this.props.registerMutation({
      variables: { name, email, password },
    })
    this.props.history.replace('/feed')
  }
  render() {
    const {
      name, email, password, usernameError, emailError, passwordError,
    } = this.state;

    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container className="pt4" text>
        <Header as="h2">Register</Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Field >
            <Input
              autoFocus
              onChange={e => this.setState({ name: e.target.value })}
              placeholder="name"
              type="name"
              value={name}
              fluid
              autoComplete="name"
            />
          </Form.Field>
          <Form.Field >
            <Input
              autoFocus
              onChange={e => this.setState({ email: e.target.value })}
              placeholder="email"
              type='email'
              value={email}
              fluid
              autoComplete='email'
            />
          </Form.Field>
          <Form.Field >
            <Input
              autoFocus
              onChange={e => this.setState({ password: e.target.value })}
              placeholder="password"
              type="password"
              value={password}
              fluid
              autoComplete="current-password"
            />
          </Form.Field>
          <Button>Submit</Button>
        </Form>
      </Container>
    )
  }
}
const REGISTER_MUTATION = gql`
  mutation registerMutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      user {
        id
      }
      token
    }
  }
`;

const RegisterWithMutation = graphql(REGISTER_MUTATION, {
  name: 'registerMutation'
})(Register);

export default withRouter(RegisterWithMutation)
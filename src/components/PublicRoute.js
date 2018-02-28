import React from 'react';
import { Route } from 'react-router-dom';
import Header from './Header'
import decode from 'jwt-decode'

const Authed = () => {
  const token = localStorage.getItem("token") || null
  try {
    decode(token);
  } catch (err) {
    return false;
  }
  return true;
};

export const PublicRoute = ({
  component: Component,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props =>
        (
          <div className="fl w-100 pl4 pr4">
            <Header {...props } isAuthed={Authed()}/>
            <Component {...props} />
          </div>
        ) 
      )}
    />
  );

export default PublicRoute

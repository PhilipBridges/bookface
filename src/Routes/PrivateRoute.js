import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode'

const Authed = () => {
  const token = localStorage.getItem("token")
  try {
    decode(token);
  } catch (err) {
    return false;
  }
  return true;
};

export const PrivateRoute = ({
  component: Component,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props =>
        (Authed() ?
          (
            <React.Fragment>
              <div className="fl w-100 pl4 pr4">
                <Component {...props} />
              </div>
            </React.Fragment>
          )
          : (
            <Redirect
              to={{
                pathname: '/login',
              }}
            />
          ))
      )}
    />
  );

export default PrivateRoute

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode'

import 'tachyons'

const Authed = () => {
  const token = localStorage.getItem("token")
  try {
    decode(token);
  } catch (err) {
    return false;
  }
  return true;
};

export const FeedRoute = ({
  component: Component,
  ...rest
}) => (
    <Route
      {...rest}
      render={(props =>
        (Authed() ?
          (
            <div style={{marginTop: '4rem'}} className="fr w-100">
              <Component {...props} />
            </div>
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

export default FeedRoute

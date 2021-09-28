import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../tools';

export const RequiredLogin = withRouter(({ children, history }) => {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    getClient('backoffice')
      .then((c) => c.get('/auth'))
      .then(({ data }) => setUser(data.user))
      .catch(() => history.push('/auth/login'));
  };

  useEffect(loadUser, [history]);
  return <>{user && children}</>;
});

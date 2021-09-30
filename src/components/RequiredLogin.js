import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../tools';

export const RequiredLogin = withRouter(({ children, history }) => {
  const [admin, setAdmin] = useState(null);

  const loadAdmin = () => {
    getClient('backoffice')
      .then((c) => c.get('/auth'))
      .then(({ data }) => setAdmin(data.user))
      .catch(() => history.push('/auth/login'));
  };

  useEffect(loadAdmin, [history]);
  return <>{admin && children}</>;
});

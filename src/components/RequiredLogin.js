import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../tools';

export const RequiredLogin = withRouter(({ children, history }) => {
  const [admin, setAdmin] = useState(null);

  const loadAdmin = useCallback(() => {
    getClient('backoffice')
      .then((c) => c.get('/auth'))
      .then(({ data }) => setAdmin(data.user))
      .catch(() => history.push('/auth/login'));
  }, [history]);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);
  return <>{admin && children}</>;
});

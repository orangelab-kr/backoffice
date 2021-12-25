import { Link } from 'react-router-dom';
import { getClient } from '../../tools';
import { InfoProvider } from '../InfoProvider';

export const ProfileInfoProvider = ({ profileId }) => {
  const onRequest = (profileId) =>
    getClient('openapi-location').then((c) => c.get(`/profiles/${profileId}`));

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={profileId}
      dataSourceKey="profile"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ profileId, name }) => (
        <Link to={`/profiles/${profileId}`}>{name}</Link>
      )}
    />
  );
};

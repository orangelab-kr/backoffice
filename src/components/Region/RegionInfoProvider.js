import { Link } from 'react-router-dom';
import { getClient } from '../../tools';
import { InfoProvider } from '../InfoProvider';

export const RegionInfoProvider = ({ regionId }) => {
  const onRequest = (regionId) =>
    getClient('openapi-location', true).then((c) =>
      c.get(`/regions/${regionId}`)
    );

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={regionId}
      dataSourceKey="region"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ regionId, name }) => (
        <Link to={`/regions/${regionId}`}>{name}</Link>
      )}
    />
  );
};

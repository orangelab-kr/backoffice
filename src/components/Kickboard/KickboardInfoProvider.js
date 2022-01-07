import { Link } from 'react-router-dom';
import { getClient } from '../../tools';
import { InfoProvider } from '../InfoProvider';

export const KickboardInfoProvider = ({ kickboardCode, showKickboardId }) => {
  const onRequest = (kickboardCode) =>
    getClient('openapi-kickboard', true).then((c) =>
      c.get(`/kickboards/${kickboardCode}`)
    );

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={kickboardCode}
      dataSourceKey="kickboard"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ kickboardCode, kickboardId }) => (
        <Link to={`/kickboards/${kickboardCode}`}>
          {kickboardCode}
          {showKickboardId && ` (${kickboardId})`}
        </Link>
      )}
    />
  );
};

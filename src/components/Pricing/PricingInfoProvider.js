import { Link } from 'react-router-dom';
import { getClient } from '../../tools';
import { InfoProvider } from '../InfoProvider';

export const PricingInfoProvider = ({ pricingId }) => {
  const onRequest = (pricingId) =>
    getClient('openapi-location').then((c) => c.get(`/pricings/${pricingId}`));

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={pricingId}
      dataSourceKey="pricing"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ pricingId, name, standardPrice }) => (
        <Link to={`/pricings/${pricingId}`}>
          {name} ({standardPrice.toLocaleString()}원)
        </Link>
      )}
    />
  );
};

import { Link } from 'react-router-dom';
import { InfoProvider } from '.';
import { getClient } from '../tools';

export const CouponInfoProvider = ({ userId, couponId, receipt }) => {
  const onRequest = (couponId) =>
    getClient('coreservice-payments', true).then((c) =>
      c.get(`/users/${userId}/coupons/${couponId}`)
    );

  return (
    <InfoProvider
      onRequest={onRequest}
      dataId={couponId}
      dataSourceKey="coupon"
      renderLoading={() => <>로딩 중...</>}
      renderFailed={() => <>조회 실패</>}
      render={({ couponGroupId, couponGroup }) => (
        <>
          <Link to={`/couponGroups/${couponGroupId}`}>{couponGroup.name}</Link>
          {receipt && ` (${receipt.discount.toLocaleString()}원 할인)`}
        </>
      )}
    />
  );
};

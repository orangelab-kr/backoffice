import { useParams, withRouter } from 'react-router-dom';

import { Card } from 'antd';
import { RideInfo } from '../components/Ride/RideInfo';

export const RidesDetails = withRouter(() => {
  const { rideId } = useParams();
  return (
    <Card>
      <RideInfo rideId={rideId} />
    </Card>
  );
});

import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { RegionGeofenceCard, RegionGeofenceList, RegionGeofenceMap } from '.';

export const RegionGeofence = ({ map, region }) => {
  const [geofence, setGeofence] = useState();
  const [refresh, setRefresh] = useState(false);
  const geofenceForm = Form.useForm()[0];
  const sidebar = geofence && (
    <RegionGeofenceCard
      region={region}
      geofence={geofence}
      onClose={() => setGeofence(null)}
      setRefresh={setRefresh}
      geofenceForm={geofenceForm}
      refresh={refresh}
    />
  );

  useEffect(() => setRefresh(true), [map]);
  return map ? (
    <RegionGeofenceMap
      region={region}
      sidebar={sidebar}
      geofence={geofence}
      setGeofence={setGeofence}
      setRefresh={setRefresh}
      geofenceForm={geofenceForm}
      refresh={refresh}
    />
  ) : (
    <RegionGeofenceList
      region={region}
      sidebar={sidebar}
      geofence={geofence}
      setGeofence={setGeofence}
      setRefresh={setRefresh}
      refresh={refresh}
    />
  );
};

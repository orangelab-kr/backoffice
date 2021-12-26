import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { RegionGeofenceCard, RegionGeofenceList, RegionGeofenceMap } from '.';
import { getClient } from '../../tools';

export const RegionGeofence = ({ map, region }) => {
  const [geofence, setGeofence] = useState();
  const [refresh, setRefresh] = useState(false);
  const geofenceForm = Form.useForm()[0];
  const deleteGeofence = (geofenceId) => async () => {
    const { regionId } = region;
    await getClient('openapi-location').then((c) =>
      c.delete(`/regions/${regionId}/geofences/${geofenceId}`)
    );

    setGeofence();
    setRefresh(true);
  };

  const sidebar = geofence && (
    <RegionGeofenceCard
      region={region}
      geofence={geofence}
      setGeofence={setGeofence}
      onClose={() => setGeofence()}
      deleteGeofence={deleteGeofence}
      setRefresh={setRefresh}
      geofenceForm={geofenceForm}
      refresh={refresh}
    />
  );

  useEffect(() => {
    setRefresh(true);
    // 기존 지오펜스가 생성되지 않은 지오펜스의 경우 임시 정보 삭제
    setGeofence((geofence) => {
      if (geofence && !geofence.geofenceId) return;
      return geofence;
    });
  }, [map]);

  useEffect(() => {
    if (geofence !== undefined) return;
    geofenceForm.resetFields();
  }, [geofence, geofenceForm]);

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
      deleteGeofence={deleteGeofence}
      refresh={refresh}
    />
  );
};

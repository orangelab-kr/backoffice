import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { NaverMap } from 'react-naver-maps';
import { getClient, useInterval } from '../../tools';

export const RegionGeofenceMap = ({
  region,
  geofence,
  geofenceForm,
  setGeofence,
  setRefresh,
  refresh,
  sidebar,
}) => {
  let map;
  // eslint-disable-next-line no-undef
  const naverMaps = naver && naver.maps;
  const { regionId } = region;
  const [polygons, setPolygons] = useState({});
  const [geofences, setGeofences] = useState([]);
  const getOpacity = (geofence) =>
    parseInt(geofence.profile.color.substr(7, 2) || '1a', 16) / 255;

  useInterval(
    () => {
      if (!geofence || !polygons || !geofenceForm) return;
      const geofenceId = geofence.geofenceId || 'new';
      const polygon = polygons[geofenceId];
      if (!polygon) return;
      const geojson = polygon.toGeoJson().features[0].geometry;
      geofenceForm.setFieldsValue({ geojson });
    },
    geofence ? 500 : 0
  );

  const setMap = (ref) => {
    if (map || !ref.map) return;
    map = ref.map;
  };

  const mergeGeofences = useCallback(
    (newGeofences) =>
      setGeofences((geofences) => {
        const updatedGeofences = [...geofences];
        newGeofences.forEach((newGeofence) => {
          const index = updatedGeofences.findIndex(
            (g) => g.geofenceId === newGeofence.geofenceId
          );

          if (index !== -1) updatedGeofences.splice(index, 1);
          updatedGeofences.push(newGeofence);
        });

        return updatedGeofences;
      }),
    []
  );

  const getGeofences = useCallback(async () => {
    if (refresh !== null && !refresh) return;
    setGeofences([]);
    setPolygons((polygons) => {
      const values = Object.values(polygons);
      values.forEach((polygon) => polygon.setMap(null));
      return {};
    });

    const take = 100;
    let skip = 0;
    while (true) {
      const params = { take, skip };
      const locationClient = await getClient('openapi-location');
      const path = `/regions/${regionId}/geofences`;
      const { data } = await locationClient.get(path, { params });
      if (data.geofences.length <= 0) break;
      mergeGeofences(data.geofences);
      if (setRefresh) setRefresh(false);
      skip += take;
    }
  }, [mergeGeofences, refresh, regionId, setRefresh]);

  const onClickMap = useCallback(
    (event) => {
      if (!geofence) return;
      if (geofence.geofenceId) return setGeofence();

      // 지도 추가를 위한 부분
      if (polygons.new) return;
      const { _lat, _lng } = event.coord;
      const coordinates = [
        [_lng - 0.003, _lat - 0.003],
        [_lng - 0.003, _lat + 0.003],
        [_lng + 0.003, _lat + 0.003],
        [_lng + 0.003, _lat - 0.003],
      ];

      const newPolygon = new naverMaps.Polygon({
        map,
        paths: coordinates,
        zIndex: 1000,
      });

      newPolygon.setEditable(true);
      polygons.new = newPolygon;
    },
    [geofence, map, naverMaps.Polygon, polygons, setGeofence]
  );

  useEffect(() => getGeofences(), [getGeofences, refresh]);
  useEffect(() => {
    if (!map) return;
    naverMaps.Event.clearListeners(map, 'click');
    naverMaps.Event.addListener(map, 'click', onClickMap);
  }, [map, naverMaps.Event, onClickMap]);

  const onClickPolygon = useCallback(
    (geofence) => () => setGeofence(geofence),
    [setGeofence]
  );

  useEffect(() => {
    if (!Object.keys(polygons).length) return;
    Object.values(polygons).forEach((polygon) => {
      if (polygon.editable) polygon.setEditable(false);
    });

    if (geofence) {
      const polygon = polygons[geofence.geofenceId];
      if (polygon) polygon.setEditable(true);
    }

    if (polygons.new) {
      polygons.new.setMap(null);
      delete polygons.new;
    }
  }, [geofence, geofences, polygons]);

  useEffect(() => {
    const updatedPolygons = {};
    geofences.forEach((geofence) => {
      const polygon = new naverMaps.Polygon({
        map,
        clickable: true,
        paths: geofence.geojson.coordinates[0],
        zIndex: geofence.profile.priority,
        fillColor: geofence.profile.color,
        strokeColor: geofence.profile.color,
        fillOpacity: getOpacity(geofence),
        strokeOpacity: 1,
      });

      const { geofenceId } = geofence;
      const func = onClickPolygon(geofence);
      naverMaps.Event.clearListeners(polygon, 'click');
      naverMaps.Event.addListener(polygon, 'click', func);
      updatedPolygons[geofenceId] = polygon;
    });

    setPolygons(updatedPolygons);
  }, [geofences, map, naverMaps.Event, naverMaps.Polygon, onClickPolygon]);

  useEffect(() => {
    if (!polygons) return;
    Object.values(polygons).forEach((polygon) =>
      polygon.setClickable(!geofence || geofence.geofenceId)
    );
  }, [geofence, polygons]);

  return (
    <Card>
      <Row justify="space-between" gutter={[8, 8]}>
        <Col>
          <Typography.Title level={3}>
            {region.name} / 지오펜스 지도
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setGeofence({})}
            disabled={geofence && !geofence.geofenceId}
          >
            지오펜스 추가
          </Button>
        </Col>
      </Row>
      <Row justify="space-between" gutter={[8, 8]} style={{ height: '80vh' }}>
        <Col flex="auto">
          <NaverMap
            id="map"
            naverRef={setMap}
            style={{ height: '100%' }}
            defaultZoom={8}
          />
        </Col>
        {sidebar && <Col span={8}>{sidebar}</Col>}
      </Row>
    </Card>
  );
};

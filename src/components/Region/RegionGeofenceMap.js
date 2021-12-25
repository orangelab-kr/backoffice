import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [editorMode, setEditorMode] = useState(false);
  const [beforeGeofence, setBeforeGeofence] = useState();
  const getOpacity = (geofence) =>
    parseInt(geofence.profile.color.substr(7, 2) || '1a', 16) / 255;

  useInterval(
    () => {
      if (!polygons || !geofence || !geofenceForm) return;
      const { geofenceId } = geofence;
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

    setBeforeGeofence();
  }, [mergeGeofences, refresh, regionId, setRefresh]);

  useEffect(() => getGeofences(), [getGeofences, refresh]);
  useEffect(() => {
    if (!map) return;

    naverMaps.Event.addListener(map, 'click', () => setGeofence());
    naverMaps.Event.once(map, 'init_stylemap', () => {
      new naverMaps.drawing.DrawingManager({ map });
    });
  }, [map, naverMaps.Event, naverMaps.drawing.DrawingManager, setGeofence]);

  const onClickPolygon = useCallback(
    (geofence) => () => setGeofence(geofence),
    [setGeofence]
  );

  useEffect(() => {
    if (!geofences || beforeGeofence === geofence) return;
    setBeforeGeofence(geofence);
    if (beforeGeofence) {
      const beforePolygon = polygons[beforeGeofence.geofenceId];
      if (beforePolygon) beforePolygon.setEditable(false);
    }

    if (geofence) {
      const polygon = polygons[geofence.geofenceId];
      if (polygon) polygon.setEditable(true);
    }
  }, [beforeGeofence, geofence, geofences, polygons]);

  useEffect(() => {
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
      naverMaps.Event.addListener(polygon, 'click', func);
      setPolygons((polygons) => {
        polygons[geofenceId] = polygon;
        return polygons;
      });
    });
  }, [geofences, map, naverMaps.Event, naverMaps.Polygon, onClickPolygon]);

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
            type={editorMode ? 'default' : 'primary'}
            icon={editorMode ? <CheckOutlined /> : <PlusOutlined />}
            onClick={() => setEditorMode((editorMode) => !editorMode)}
          >
            {editorMode ? '완료' : '지오펜스 추가'}
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

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Image,
  message,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Marker, NaverMap } from 'react-naver-maps';
import { MonitoringLog } from '.';
import {
  KickboardInfoProvider,
  MonitoringActionItem,
  RegionInfoProvider,
  UserInfoProvider,
} from '..';
import { getClient, MonitoringStatus } from '../../tools';

export const MonitoringItem = ({ ride }) => {
  const [status, setStatus] = useState();
  const [collapse, setCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshLog, setRefreshLog] = useState(false);
  // eslint-disable-next-line no-undef
  const naverMaps = naver && naver.maps;

  const onChangeMonitoringStatus = (e) => {
    const { value } = e.target;
    const status = MonitoringStatus.find(({ type }) => type === value);
    if (status.type === ride.monitoringStatus) return setStatus();
    setStatus(status);
  };

  const onChangeAction = async ({ sendMessage, price }) => {
    setLoading(true);
    const monitoringStatus = status.type;
    const body = { monitoringStatus, sendMessage, price };
    await getClient('openapi-ride')
      .then((c) => c.post(`/rides/${ride.rideId}/monitoring`, body))
      .finally(() => setLoading(false));

    setRefreshLog(true);
    message.success('처리되었습니다.');
  };

  const onCollapseClick = () => {
    if (collapse) return setCollapse(collapse);
    setRefreshLog(true);
    setCollapse(true);
  };

  return (
    <Card style={{ margin: '10px 0' }}>
      <Row gutter={[8, 8]} justify="space-between">
        <Col>
          <Typography.Title level={4}>
            {dayjs(ride.terminatedAt).format('YYYY년 MM월 DD일 H시 m분')}{' '}
            <KickboardInfoProvider kickboardCode={ride.kickboardCode} />
          </Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={onCollapseClick}>
            더보기 {collapse ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </Col>
      </Row>
      <Row gutter={[4, 4]} justify="space-between" style={{ marginTop: 10 }}>
        <Col xxl={6} span={24}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="반납 일시">
              {dayjs(ride.terminatedAt).format('YYYY년 MM월 DD일 H시 m분')}
            </Descriptions.Item>
            <Descriptions.Item label="킥보드 코드">
              <KickboardInfoProvider
                kickboardCode={ride.kickboardCode}
                showKickboardId
              />
            </Descriptions.Item>
            <Descriptions.Item label="지역">
              <RegionInfoProvider regionId={ride.regionId} />
            </Descriptions.Item>
            {ride.platformId === 'fbf3aadc-58fa-433b-83f0-cd2823ad1dff' && (
              <Descriptions.Item label="사용자">
                <UserInfoProvider userId={ride.userId} />
              </Descriptions.Item>
            )}

            <Descriptions.Item label="이름">{ride.realname}</Descriptions.Item>
            <Descriptions.Item label="전화번호">{ride.phone}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xxl={7} span={12}>
          <NaverMap
            id={`monitoring-item-${ride.rideId}`}
            mapTypeId={naverMaps.MapTypeId.SATELLITE}
            style={{ height: '100%' }}
            defaultZoom={24}
            defaultCenter={{
              lat: ride.terminatedKickboardLocation.latitude,
              lng: ride.terminatedKickboardLocation.longitude,
            }}
          >
            <Marker
              position={{
                lat: ride.terminatedKickboardLocation.latitude,
                lng: ride.terminatedKickboardLocation.longitude,
              }}
            />

            {ride.terminatedPhoneLocation && (
              <Marker
                icon={{
                  url: 'https://cdn.hikick.kr/markers/current_location.png',
                  scaledSize: { width: 18, height: 18 },
                  anchor: { x: 9, y: 9 },
                }}
                position={{
                  lat: ride.terminatedPhoneLocation.latitude,
                  lng: ride.terminatedPhoneLocation.longitude,
                }}
              />
            )}
          </NaverMap>
        </Col>
        <Col xxl={3} span={12}>
          {ride.photo ? (
            <Image src={ride.photo} alt="이미지를 로드할 수 없음" />
          ) : (
            <Empty
              style={{ margin: '30px 0' }}
              description="반납 사진이 없습니다."
            />
          )}
        </Col>
        <Col xxl={6} span={24}>
          <Card>
            <Spin spinning={loading}>
              <Typography.Title level={4}>조치</Typography.Title>
              <Radio.Group
                style={{ width: '100%', marginBottom: 15 }}
                onChange={onChangeMonitoringStatus}
                value={status ? status.type : ride.monitoringStatus}
              >
                <Space direction="vertical">
                  {MonitoringStatus.map(({ type, name, icon, color }) => (
                    <Radio value={type} key={type} style={{ color }}>
                      {name} {icon}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              {status && (
                <MonitoringActionItem
                  actionType={status.action}
                  onClick={onChangeAction}
                />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
      {collapse && (
        <MonitoringLog
          ride={ride}
          refresh={refreshLog}
          setRefresh={setRefreshLog}
        />
      )}
    </Card>
  );
};

import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Row, Typography } from 'antd';
import { Form } from 'antd';
import { useEffect } from 'react';
import { getClient } from '../../tools';
import { ProfileSelect } from '../Profile';

export const RegionGeofenceCard = ({
  onClose,
  region,
  geofence,
  setRefresh,
  geofenceForm,
}) => {
  const { regionId } = region;
  const { geofenceId } = geofence;
  useEffect(
    () => geofenceForm.setFieldsValue(geofence),
    [geofenceForm, geofence]
  );

  const onSave = async (data) => {
    const locationClient = await getClient('openapi-location');
    const path = `/regions/${regionId}/geofences/${geofenceId}`;
    await locationClient.post(path, data);
    message.success('저장되었습니다.');
    setRefresh(true);
  };

  return (
    <Card>
      <Row justify="space-between">
        <Col>
          <Typography.Title level={4}>{geofence.name}</Typography.Title>
        </Col>
        <Col>
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
            type="text"
            danger
          />
        </Col>
      </Row>
      <Form form={geofenceForm} onFinish={onSave} layout="vertical">
        <Form.Item name="geojson" hidden />
        <Form.Item label="지오펜스 이름" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="프로파일" name="profileId">
          <ProfileSelect />
        </Form.Item>
        <Row justify="end">
          <Col>
            <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
              저장
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

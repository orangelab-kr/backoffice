import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import { useEffect } from 'react';
import { getClient } from '../../tools';
import { ProfileSelect } from '../Profile';

export const RegionGeofenceCard = ({
  onClose,
  region,
  geofence,
  setGeofence,
  setRefresh,
  deleteGeofence,
  geofenceForm,
}) => {
  const { regionId } = region;
  const { geofenceId } = geofence;
  useEffect(() => {
    if (!geofence || !geofence.geofenceId) {
      geofenceForm.resetFields();
      return;
    }

    geofenceForm.setFieldsValue(geofence);
  }, [geofenceForm, geofence]);

  const onSave = async (form) => {
    const locationClient = await getClient('openapi-location');
    const path = `/regions/${regionId}/geofences/${geofenceId || ''}`;
    const { data } = await locationClient.post(path, form);
    geofenceForm.setFieldsValue(data.geofence);
    setGeofence(data.geofence);
    message.success('저장되었습니다.');
    setRefresh(true);
  };

  return (
    <Card>
      <Row justify="space-between">
        <Col>
          <Typography.Title level={4}>
            {geofence.name || '새로운 지오펜스'}
          </Typography.Title>
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
      <Form
        form={geofenceForm}
        onFinish={onSave}
        layout="vertical"
        initialValues={{ enabled: true }}
      >
        <Form.Item name="geojson" hidden />
        <Form.Item label="활성화" name="enabled" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item label="지오펜스 이름" name="name" required>
          <Input />
        </Form.Item>
        <Form.Item label="프로파일" name="profileId" required>
          <ProfileSelect />
        </Form.Item>
        <Row justify="end" gutter={[8, 8]}>
          {geofence.geofenceId && (
            <Col>
              <Popconfirm
                title="정말로 지오펜스를 삭제하시곘습니까?"
                onConfirm={deleteGeofence(geofenceId)}
                okText="삭제"
                cancelText="취소"
              >
                <Button icon={<DeleteOutlined />} type="primary" danger />
              </Popconfirm>
            </Col>
          )}
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

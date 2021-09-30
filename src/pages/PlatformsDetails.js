import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

export const PlatformsDetails = withRouter(({ history }) => {
  const params = useParams();
  const platformForm = Form.useForm()[0];
  const platformId = params.platformId !== 'add' ? params.platformId : '';
  const [platform, setPlatform] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const loadPlatform = () => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.get(`/platforms/${platformId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setPlatform(data.platform);
        platformForm.setFieldsValue(data.platform);
      });
  };

  const savePlatform = (body) => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.post(`/platforms/${platformId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${platformId ? '수정' : '생성'}되었습니다.`);
        if (!platformId) history.push(`/platforms/${data.platformId}`);
      });
  };

  const deletePlatform = () => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.delete(`/platforms/${platformId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/platforms`);
      });
  };

  useEffect(loadPlatform, [platformForm, platformId]);
  return (
    <>
      <Card>
        <Form layout="vertical" onFinish={savePlatform} form={platformForm}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Typography.Title level={3} copyable={platformId}>
                {platform ? platform.name : '새로운 플랫폼'}
              </Typography.Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {platform && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deletePlatform}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        loading={isLoading}
                        type="primary"
                        danger
                      />
                    </Popconfirm>
                  </Col>
                )}
                <Col>
                  <Button
                    icon={platformId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {platformId ? '저장' : '생성'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="name" label="플랫폼 이름:">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

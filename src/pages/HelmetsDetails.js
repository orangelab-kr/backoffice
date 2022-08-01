import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

export const HelmetsDetails = withRouter(({ history }) => {
  const params = useParams();
  const helmetForm = Form.useForm()[0];
  const helmetId = params.helmetId !== 'add' ? params.helmetId : '';
  const [helmet, setHelmet] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const loadHelmet = useCallback(() => {
    setLoading(true);
    getClient('openapi-kickboard')
      .then((c) => c.get(`/helmets/${helmetId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setHelmet(data.helmet);
        helmetForm.setFieldsValue(data.helmet);
      });
  }, [helmetForm, helmetId]);

  const saveHelmet = (body) => {
    setLoading(true);
    getClient('openapi-kickboard')
      .then((c) => c.post(`/helmets/${helmetId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${helmetId ? '수정' : '생성'}되었습니다.`);
        if (!helmetId) history.push(`/helmets/${data.helmet._id}`);
      });
  };

  const deleteHelmet = () => {
    setLoading(true);
    getClient('openapi-kickboard')
      .then((c) => c.delete(`/helmets/${helmetId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/helmets`);
      });
  };

  useEffect(() => {
    loadHelmet();
  }, [helmetForm, helmetId, loadHelmet]);

  return (
    <>
      <Card>
        <Form
          layout='vertical'
          onFinish={saveHelmet}
          form={helmetForm}
          initialValues={{ status: 0, version: 1, battery: 100 }}
        >
          <Row justify='space-between' style={{ marginBottom: 20 }}>
            <Col>
              <Typography.Title level={3} copyable={helmet}>
                {helmet
                  ? helmet.macAddress.toUpperCase().match(/.{2}/g).join(':')
                  : '새로운 헬멧'}
              </Typography.Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {helmet && (
                  <Col>
                    <Popconfirm
                      title='정말로 삭제하시겠습니까?'
                      okText='네'
                      cancelText='아니요'
                      onConfirm={deleteHelmet}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        loading={isLoading}
                        type='primary'
                        danger
                      />
                    </Popconfirm>
                  </Col>
                )}
                <Col>
                  <Button
                    icon={helmetId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type='primary'
                    htmlType='submit'
                  >
                    {helmetId ? '저장' : '생성'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name='macAddress' label='헬멧 맥주소:'>
            <Input />
          </Form.Item>
          <Row gutter={[4, 4]}>
            <Col>
              <Form.Item name='battery' label='배터리 잔량:'>
                <InputNumber max={100} min={1} addonAfter='%' />
              </Form.Item>
            </Col>
            <Col flex='auto'>
              <Form.Item name='status' label='상태:'>
                <Select>
                  <Select.Option value={0}>사용 가능</Select.Option>
                  <Select.Option value={1}>사용 중</Select.Option>
                  <Select.Option value={2}>망가짐</Select.Option>
                  <Select.Option value={3}>잃어버림</Select.Option>
                  <Select.Option value={4}>비활성화됨</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col flex={2}>
              <Form.Item name='version' label='버전:'>
                <Select>
                  <Select.Option value={0}>Solebe Y905</Select.Option>
                  <Select.Option value={1}>HIKICK HELMET</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[4, 4]}>
            <Col flex={3}>
              <Form.Item
                name='encryptKey'
                label='암호화 키:'
                rules={[
                  {
                    pattern:
                      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
                    message: '비밀번호는 반드시 BASE64여야 합니다.',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col flex='auto'>
              <Form.Item
                name='password'
                label='비밀번호:'
                rules={[
                  { len: 6, message: '비밀번호는 반드시 6자리여야 합니다.' },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
});

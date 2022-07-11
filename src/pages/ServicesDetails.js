import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
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
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

export const ServicesDetails = withRouter(({ history }) => {
  const { serviceId } = useParams();
  const serviceForm = useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const requestService = useCallback(() => {
    if (!serviceId) return;
    setLoading(true);

    getClient('backoffice')
      .then((c) => c.get(`/services/${serviceId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => serviceForm.setFieldsValue(data.service));
  }, [serviceId, serviceForm, setLoading]);

  const saveService = (body) => {
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.post(`/services/${serviceId}`, body))
      .finally(() => setLoading(false))
      .then((data) => {
        message.success('수정되었습니다.');
        serviceForm.setFieldsValue(data.service);
      });
  };

  const deleteService = (body) => {
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.delete(`/services/${serviceId}`, body))
      .finally(() => setLoading(false))
      .then(() => {
        message.success('삭제되었습니다.');
        history.push(`/services`);
      });
  };

  useEffect(() => {
    requestService();
  }, [requestService, serviceForm, serviceId]);

  return (
    <>
      <Card>
        <Form layout='vertical' onFinish={saveService} form={serviceForm}>
          <Row justify='space-between' style={{ marginBottom: 20 }}>
            <Col>
              <Typography.Title level={3} copyable={serviceId}>
                {serviceId}
              </Typography.Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                <Col>
                  <Popconfirm
                    title='정말로 삭제하시겠습니까?'
                    okText='네'
                    cancelText='아니요'
                    onConfirm={deleteService}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      loading={isLoading}
                      type='primary'
                      danger
                    />
                  </Popconfirm>
                </Col>
                <Col>
                  <Button
                    icon={<SaveOutlined />}
                    disabled={isLoading}
                    type='primary'
                    htmlType='submit'
                  >
                    서비스 저장
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item
            name='serviceId'
            label='서비스 이름'
            rules={[
              {
                required: true,
                message: '반드시 입력하여야 합니다.',
              },
              {
                pattern: /^[\w\-. ]+$/,
                message: '영문, 숫자와 "-"만 사용 가능합니다.',
              },
            ]}
          >
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name='endpoint'
            label='엔드포인트'
            rules={[
              {
                required: true,
                message: '반드시 입력하여야 합니다.',
              },
              {
                type: 'url',
                message: '올바른 주소를 입력해주세요.',
              },
            ]}
          >
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name='secretKey' label='시크릿 키'>
            <Input.Password
              disabled={isLoading}
              placeholder='시크릿 키 값은 존재하지만 확인할 수 없습니다.'
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

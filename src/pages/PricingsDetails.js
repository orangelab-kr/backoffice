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
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;

export const PricingsDetails = withRouter(({ history }) => {
  const [pricing, setPricing] = useState();
  const params = useParams();
  const pricingId = params.pricingId !== 'add' ? params.pricingId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadPricings = () => {
    if (!pricingId) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.get(`/pricings/${pricingId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setPricing(data.pricing);
        form.setFieldsValue(data.pricing);
      });
  };

  const deletePricings = () => {
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.delete(`/pricings/${pricingId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/pricings`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.post(`/pricings/${pricingId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${pricingId ? '수정' : '생성'}되었습니다.`);
        if (data.pricing.pricingId) {
          history.push(`/pricings/${data.pricing.pricingId}`);
        }
      });
  };

  useEffect(loadPricings, [form, pricingId]);
  return (
    <>
      <Card>
        <Form
          layout="vertical"
          onFinish={onSave}
          form={form}
          initialValues={{ franchiseIds: [] }}
        >
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {pricing ? pricing.name : '새로운 가격정책'}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {pricingId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deletePricings}
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
                    icon={pricingId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {pricingId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="standardTime" label="기본 제공시간 ">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="standardPrice" label="기본 이용료">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="perMinuteStandardPrice" label="기본 분당요금">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="nightlyPrice" label="야간 이용료">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="perMinuteNightlyPrice" label="야간 분당요금">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="surchargePrice" label="야간 분당요금">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name="maxPrice" label="최대 금액">
            <InputNumber disabled={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

import {
  CreditCardOutlined,
  MessageOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Col, Form, InputNumber, Row } from 'antd';
import { useState } from 'react';
import { MonitoringActionType } from '../../tools';

export const MonitoringActionItem = ({ actionType, onClick }) => {
  const form = Form.useForm()[0];
  const [fields, setFields] = useState({ sendMessage: true, price: 0 });
  const onChange = () => setFields(form.getFieldsValue());
  const price =
    actionType === MonitoringActionType.AddPayment ? fields.price : undefined;
  const sendMessage =
    actionType !== MonitoringActionType.OnlySave
      ? fields.sendMessage
      : undefined;

  const getIcon = () => {
    if (!sendMessage && !price) return <SaveOutlined />;
    if (sendMessage && !price) return <MessageOutlined />;
    return <CreditCardOutlined />;
  };

  const getText = () => {
    if (!sendMessage && !price) return '저장';
    if (sendMessage && !price) return '통보';
    if (!sendMessage && price) return '결제';
    return '통보 및 결제';
  };

  return (
    <Form
      form={form}
      onFinish={onClick}
      initialValues={fields}
      onFieldsChange={onChange}
    >
      <Row gutter={[8, 8]} align="middle" justify="end">
        {actionType !== MonitoringActionType.OnlySave && (
          <Col>
            <Form.Item name="sendMessage" valuePropName="checked" noStyle>
              <Checkbox>통보</Checkbox>
            </Form.Item>
          </Col>
        )}

        {actionType === MonitoringActionType.AddPayment && (
          <Col>
            <Form.Item name="price" noStyle>
              <InputNumber
                controls={false}
                placeholder="금액"
                addonAfter="원"
                formatter={(v) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => parseInt(v.replace(/,/, ''))}
              />
            </Form.Item>
          </Col>
        )}

        <Col>
          <Button
            type="primary"
            htmlType="submit"
            icon={getIcon()}
            children={getText()}
            danger={fields.price}
          />
        </Col>
      </Row>
    </Form>
  );
};

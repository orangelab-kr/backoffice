import { Col, Form, Input, message, Modal, Row } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { getClient } from '../tools';

export const ServicesCreate = withRouter(({ history, onCancel }) => {
  const form = Form.useForm()[0];

  const onSubmit = async (body) => {
    const client = await getClient('backoffice');
    const { data } = await client.post('/services', body);
    message.success(`${data.service.serviceId} 서비스가 생성되었습니다.`);
    history.push(`/services/${data.service.serviceId}`);
  };

  return (
    <Modal
      visible={true}
      title="서비스 생성"
      okType="primary"
      okText="서비스 생성"
      cancelText="취소"
      onOk={form.submit}
      onCancel={onCancel}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Row gutter={[4, 4]}>
          <Col flex="auto">
            <Form.Item
              label="서비스 이름:"
              name="serviceId"
              required
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
              <Input />
            </Form.Item>
            <Form.Item
              name="endpoint"
              label="엔드포인트"
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
              <Input />
            </Form.Item>
            <Form.Item name="secretKey" label="시크릿 키">
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

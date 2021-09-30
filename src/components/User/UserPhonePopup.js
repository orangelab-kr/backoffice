import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../../tools';

export const UserPhonePopup = withRouter(
  ({ history, onCancel, user, onChange }) => {
    const form = Form.useForm()[0];
    const [showValidateCode, setShowValidateCode] = useState(false);

    const onSubmit = async (body) => {
      const { userId } = user;
      const client = await getClient('coreservice-accounts');
      const phone = await client
        .post(`/users/${userId}/methods/phone/verify`, body)
        .then((res) => res.data.phone);
      onChange({ phone });
      onCancel();
    };

    const { phoneNo } = user;
    const sendValidateCode = async () => {
      const { userId } = user;
      const phoneNo = form.getFieldValue('phoneNo').replace(/\+/, '%2B');
      const client = await getClient('coreservice-accounts');
      await client.get(
        `/users/${userId}/methods/phone/verify?phoneNo=${phoneNo}`
      );

      setShowValidateCode(true);
    };

    return (
      <Modal
        visible={true}
        title="전화번호 변경"
        okType="primary"
        okText="변경"
        cancelText="취소"
        onOk={form.submit}
        onCancel={onCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
          initialValues={{ phoneNo }}
        >
          <Row gutter={4}>
            <Col flex="auto">
              <Row gutter={[4, 4]}>
                <Col flex="auto">
                  <Form.Item
                    name="phoneNo"
                    placeholder="전화번호"
                    required
                    rules={[
                      {
                        required: true,
                        message: '반드시 입력하여야 합니다.',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    icon={<SendOutlined />}
                    type="primary"
                    onClick={sendValidateCode}
                  >
                    인증번호 발송
                  </Button>
                </Col>
              </Row>
            </Col>
            {showValidateCode && (
              <Col flex="auto">
                <Form.Item label="인증번호:" name="code" required>
                  <Input maxLength={6} />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    );
  }
);

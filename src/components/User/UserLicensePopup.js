import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Switch } from 'antd';
import React from 'react';
import { getClient } from '../../tools';

export const UserLicensePopup = ({ onCancel, user, license, onChange }) => {
  const form = Form.useForm()[0];

  const onSubmit = async (body) => {
    const { userId } = user;
    const client = await getClient('coreservice-accounts');
    const { data } = await client.post(`/users/${userId}/license`, body);
    onChange(data.license);
    onCancel();
  };

  const onDelete = async () => {
    const { userId } = user;
    const client = await getClient('coreservice-accounts');
    await client.delete(`/users/${userId}/license`);
    onChange(null);
    onCancel();
  };

  return (
    <Modal
      visible={true}
      title="운전면허 인증"
      okType="primary"
      okText="인증"
      cancelText="취소"
      onOk={form.submit}
      onCancel={onCancel}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={license}
      >
        <Form.Item
          name="licenseStr"
          placeholder="운전면허 번호"
          required
          rules={[
            {
              required: true,
              message: '반드시 입력하여야 합니다.',
            },
            {
              pattern: /^[가-힣|0-9]{2}-[0-9]{2}-[0-9]{6}-[0-9]{2}$/,
              message: '올바른 운전면허 번호를 입력해주세요.',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="인증 무시" name="bypass">
          <Switch />
        </Form.Item>
        <Button icon={<DeleteOutlined />} type="danger" onClick={onDelete}>
          인증 해제
        </Button>
      </Form>
    </Modal>
  );
};

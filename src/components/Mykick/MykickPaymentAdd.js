import { Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { getClient } from '../../tools';

export const MykickPaymentAdd = ({ rent, onClose, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    try {
      setLoading(true);
      const { rentId } = rent;
      const { name, amount } = form.getFieldsValue();
      const body = { name, amount, rentId };
      const client = await getClient('mykick');
      await client.post(`/users/${rent.user.userId}/payments`, body);
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='추가 결제'
      visible={true}
      okText='결제'
      cancelText='취소'
      onOk={onFinish}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ name: '추가 결제', amount: 1000 }}
      >
        <Form.Item
          name='name'
          label='결제 이름:'
          required
          rules={[
            {
              required: true,
              message: '결제 이름을 반드시 입력해주세요.',
            },
          ]}
        >
          <Input placeholder='결제 이름' disabled={loading} />
        </Form.Item>
        <Form.Item
          name='amount'
          label='금액:'
          required
          rules={[
            {
              required: true,
              message: '반드시 금액을 입력해주세요.',
            },
            {
              type: 'number',
              min: 500,
              message: '500원 이상부터 결제가 가능합니다.',
            },
            {
              type: 'number',
              max: 1000000,
              message: '1,000,000원 금액을 초과할 수 없습니다.',
            },
          ]}
        >
          <InputNumber
            keyboard={false}
            controls={false}
            placeholder='결제 금액'
            disabled={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

import { Checkbox, Form, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getClient } from '../../tools';
import { MykickPricingSelect } from '../MykickPricingSelect';

export const MykickRenewal = ({ rent, setRent, onClose }) => {
  const [form] = Form.useForm();
  const { pricingId } = rent.pricing;
  const [loading, setLoading] = useState(false);
  const [addonIds] = useState(rent.addons.map(({ addonId }) => addonId));
  const [addons, setAddons] = useState([]);

  const onFinish = async () => {
    setLoading(true);
    const body = form.getFieldsValue();
    const client = await getClient('mykick');
    const res = await client.post(`/rents/${rent.rentId}/renewal`, body);
    setRent(res.data.rent);
    onClose();
  };

  useEffect(() => {
    getClient('mykick')
      .then((c) => c.get('/addons'))
      .then((r) => setAddons(r.data.addons));
  }, [setAddons]);

  return (
    <Modal
      title='계약 연장'
      visible={true}
      okText='연장'
      cancelText='취소'
      onOk={onFinish}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ pricingId, addonIds }}
      >
        <Form.Item name='pricingId' label='가격표'>
          <MykickPricingSelect isLoading={loading} />
        </Form.Item>
        <Form.Item name='addonIds'>
          <Checkbox.Group
            disabled={loading}
            options={addons.map(({ addonId, name }) => ({
              label: name,
              value: addonId,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

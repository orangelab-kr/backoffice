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
import { useCallback, useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;

export const CouponGroupsDetails = withRouter(({ history }) => {
  const [couponGroup, setCouponGroup] = useState({ name: '로딩 중...' });
  const params = useParams();
  const couponGroupId =
    params.couponGroupId !== 'add' ? params.couponGroupId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadCouponGroup = useCallback(() => {
    if (!couponGroupId) return;
    setLoading(true);
    getClient('coreservice-payments')
      .then((c) => c.get(`/couponGroups/${couponGroupId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setCouponGroup(data.couponGroup);
        form.setFieldsValue(data.couponGroup);
      });
  }, [couponGroupId, form]);

  const deleteCouponGroup = () => {
    setLoading(true);
    getClient('coreservice-payments')
      .then((c) => c.delete(`/couponGroups/${couponGroupId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/couponGroups`);
      });
  };

  const onSave = (body) => {
    setLoading(true);
    getClient('coreservice-payments')
      .then((c) => c.post(`/couponGroup/${couponGroupId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${couponGroupId ? '수정' : '생성'}되었습니다.`);
        if (data.couponGroupId) {
          history.push(`/couponGroups/${data.couponGroupId}`);
        }
      });
  };

  useEffect(() => {
    loadCouponGroup();
  }, [loadCouponGroup, form, couponGroupId]);

  return (
    <>
      <Card>
        <Form layout='vertical' onFinish={onSave} form={form}>
          <Row justify='space-between' style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {couponGroupId ? couponGroup.name : '새로운 쿠폰그룹'}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {couponGroupId && (
                  <Col>
                    <Popconfirm
                      title='정말로 삭제하시겠습니까?'
                      okText='네'
                      cancelText='아니요'
                      onConfirm={deleteCouponGroup}
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
                    icon={couponGroupId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type='primary'
                    htmlType='submit'
                  >
                    {couponGroupId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name='name' label='쿠폰그룹 이름'>
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name='description' label='설명'>
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name='code' label='쿠폰 코드'>
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name='validity' label='만료 시간'>
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item name='limit' label='1인당 제한 갯수'>
            <InputNumber disabled={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

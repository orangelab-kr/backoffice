import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { MykickPricingSelect } from '../components/MykickPricingSelect';
import { MykickUserSelect } from '../components/MykickUserSelect';
import { getClient } from '../tools';
import { MykickStatus } from '../tools/mykickStatus';

const { Title } = Typography;

export const MykickDetails = withRouter(({ history }) => {
  const [mykick, setMykick] = useState();
  const params = useParams();
  const rentId = params.rentId !== 'add' ? params.rentId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadMykick = () => {
    if (!rentId) return;
    setLoading(true);
    getClient('mykick')
      .then((c) => c.get(`/rents/${rentId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setMykick(data.rent);
        form.setFieldsValue({
          ...data.rent,
          expiredAt: moment(data.rent.expiredAt),
        });
      });
  };

  const deletePassProgram = () => {
    setLoading(true);
    getClient('mykick')
      .then((c) => c.delete(`/rents/${rentId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/mykick`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('mykick')
      .then((c) => c.patch(`/rents/${rentId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${rentId ? '수정' : '생성'}되었습니다.`);
        loadMykick();
      });
  };

  useEffect(loadMykick, [form, rentId]);
  return (
    <>
      <Card>
        <Form layout='vertical' onFinish={onSave} form={form}>
          <Row justify='space-between' style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>{mykick ? mykick.name : '새로운 마이킥'}</Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {rentId && (
                  <Col>
                    <Popconfirm
                      title='정말로 삭제하시겠습니까?'
                      okText='네'
                      cancelText='아니요'
                      onConfirm={deletePassProgram}
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
                    icon={rentId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type='primary'
                    htmlType='submit'
                  >
                    {rentId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item name='name' label='이름'>
                <Input disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['pricing', 'pricingId']} label='가격표'>
                <MykickPricingSelect isLoading={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={['user', 'userId']} label='사용자'>
                <MykickUserSelect isLoading={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='status' label='상태'>
                <Select disabled={isLoading}>
                  {Object.entries(MykickStatus).map(([key, obj]) => (
                    <Select.Option key={key} value={key}>
                      {obj.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='kickboardCode' label='킥보드 코드'>
                <Input disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='message' label='취소 또는 일시정지 사유:'>
                <Input disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='expiredAt' label='만료일'>
                <DatePicker disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='remainingMonths' label='남은 개월'>
                <InputNumber disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='enabled'
                label='킥보드 켜짐'
                valuePropName='checked'
              >
                <Checkbox disabled={isLoading} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lightOn'
                label='라이트 켜짐'
                valuePropName='checked'
              >
                <Checkbox disabled={isLoading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
});

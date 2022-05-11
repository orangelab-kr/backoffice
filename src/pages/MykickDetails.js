import {
  PlusOutlined,
  PlusSquareOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Alert,
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
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { KickboardSelect } from '../components/Kickboard/KickboardSelect';
import { MykickPayment } from '../components/Mykick/MykickPayment';
import { MykickRenewal } from '../components/Mykick/MykickRenewal';
import { MykickUser } from '../components/Mykick/MykickUser';
import { MykickPricingSelect } from '../components/MykickPricingSelect';
import { MykickUserSelect } from '../components/MykickUserSelect';
import { getClient, useToggle } from '../tools';
import { MykickStatus } from '../tools/mykickStatus';

const { Title } = Typography;

export const MykickDetails = withRouter(({ history }) => {
  const [rent, setRent] = useState();
  const params = useParams();
  const rentId = params.rentId !== 'add' ? params.rentId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);
  const [showRenewal, setShowRenewal] = useToggle(false);
  const [status, setStatus] = useState();

  const loadMykick = () => {
    if (!rentId) return;
    setLoading(true);
    getClient('mykick')
      .then((c) => c.get(`/rents/${rentId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => setRent(data.rent));
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('mykick')
      .then((c) => c.patch(`/rents/${rentId}`, body))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`${rentId ? '수정' : '생성'}되었습니다.`);
        loadMykick();
      });
  };

  const onExtend = () => {
    if (isLoading) return;
    setLoading(true);
    getClient('mykick')
      .then((c) => c.post(`/rents/${rentId}/extend`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`연장되었습니다.`);
        loadMykick();
      });
  };

  const onUpdateRent = () => {
    if (!rent) return;
    setStatus(rent.status);
    form.setFieldsValue({
      ...rent,
      maxSpeed: rent.maxSpeed || 25,
      expiredAt: moment(rent.expiredAt),
    });
  };

  useEffect(loadMykick, [form, rentId]);
  useEffect(onUpdateRent, [form, rent]);
  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Card>
          <Form layout='vertical' onFinish={onSave} form={form}>
            <Row justify='space-between' style={{ marginBottom: 20 }}>
              <Col>
                <Title level={3}>
                  {rent ? rent.name : '새로운 마이킥'}
                  {rent?.provider && (
                    <Tag color='blue' style={{ margin: '.3em' }}>
                      {rent.provider.name}
                    </Tag>
                  )}
                  {rent?.addons.map((addon) => (
                    <Tag color='green'>{addon.name}</Tag>
                  ))}
                </Title>
              </Col>
              <Col>
                <Row gutter={[4, 0]}>
                  {showRenewal && (
                    <MykickRenewal
                      rent={rent}
                      setRent={setRent}
                      onClose={setShowRenewal(false)}
                    />
                  )}
                  {rent && rent.remainingMonths <= 0 ? (
                    dayjs(rent.expiredAt)
                      .subtract(30, 'days')
                      .isBefore(dayjs()) && (
                      <Col>
                        <Button
                          icon={<PlusSquareOutlined />}
                          onClick={setShowRenewal(true)}
                          loading={isLoading}
                          type='primary'
                          danger
                        >
                          계약 갱신
                        </Button>
                      </Col>
                    )
                  ) : (
                    <Col>
                      <Popconfirm
                        title='정말로 연장을 진행하시겠습니까?'
                        onConfirm={onExtend}
                        okText='네, 연장합니다.'
                        cancelText='아니요'
                      >
                        <Button
                          icon={<PlusOutlined />}
                          loading={isLoading}
                          type='dashed'
                          danger
                        >
                          연장
                        </Button>
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
                  <Select disabled={isLoading} onChange={setStatus}>
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
                  <KickboardSelect isLoading={isLoading} />
                </Form.Item>
              </Col>
              {rent && ['Cancelled', 'Suspended'].includes(status) && (
                <Col span={12}>
                  <Form.Item
                    name='message'
                    label={
                      status === 'Cancelled'
                        ? '취소 사유'
                        : status === 'Suspended'
                        ? '정지 사유'
                        : '메세지'
                    }
                  >
                    <Input disabled={isLoading} />
                  </Form.Item>
                </Col>
              )}
              {rent && rent.expiredAt && (
                <Col span={12}>
                  <Form.Item name='expiredAt' label='만료일'>
                    <DatePicker disabled={isLoading} />
                  </Form.Item>
                </Col>
              )}
              <Col span={6}>
                <Form.Item name='remainingMonths' label='남은 개월'>
                  <InputNumber disabled={isLoading} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name='maxSpeed' label='최대 속도'>
                  <InputNumber disabled={isLoading} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Alert
                        type='warning'
                        message='디버깅용'
                        description='킥보드 상태값으로 가능한 수정하지 않는 것을 권장드립니다.'
                      />
                    </Col>
                    <Col>
                      <Form.Item
                        name='enabled'
                        label='킥보드 켜짐'
                        valuePropName='checked'
                      >
                        <Checkbox disabled={isLoading} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name='lightOn'
                        label='라이트 켜짐'
                        valuePropName='checked'
                      >
                        <Checkbox disabled={isLoading} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col span={10}>
        <MykickPayment rent={rent} />
      </Col>
      <Col span={14}>
        <MykickUser user={rent?.user} />
      </Col>
    </Row>
  );
});

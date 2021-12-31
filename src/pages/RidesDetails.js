import {
  EditOutlined,
  PlusOutlined,
  SmileOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  Popconfirm,
  Radio,
  Result,
  Row,
  Select,
  Tabs,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Marker, NaverMap, Polyline } from 'react-naver-maps';
import { Link, useParams, withRouter } from 'react-router-dom';
import { PaymentItem, RefundModal } from '../components';
import { useDebounce, useInterval, getClient } from '../tools';

export const RidesDetails = withRouter(() => {
  const [ride, setRide] = useState(null);
  const [openapiRide, setOpenapiRide] = useState(null);
  const [ridePayments, setRidePayments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showRefund, setShowRefund] = useState(null);
  const [showTerminate, setShowTerminate] = useState(false);
  const [showChangeDiscount, setShowChangeDiscount] = useState(false);
  const [terminateReceipt, setTerminateReceipt] = useState(null);
  const [selectDiscountGroupId, setSelectDiscountGroupId] = useState(null);
  const [lightsOn, setLightsOn] = useState(false);
  const [discountGroups, setDiscountGroups] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [lockOn, setLockOn] = useState(false);
  const [terminateLocation, setTerminateLocationState] = useState({
    _lat: 0,
    _lng: 0,
  });

  const { rideId } = useParams();
  const debouncedTerminateLocation = useDebounce(terminateLocation, 1000);
  const addPaymentForm = Form.useForm()[0];
  const terminateForm = Form.useForm()[0];
  const changeDiscountForm = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);
  const createMarkerIcon = ({ idx, createdAt }) => {
    const displayedTime = dayjs(createdAt).format('YYYY년 M월 D일 H시 m분 s초');
    const showTime = `this.innerHTML = '${displayedTime}'; this.style.zIndex = 10000;`;
    const hideTime = `this.innerHTML = '${idx}'; this.style.zIndex = 0;`;
    return `<div\
  style="\
    background-color: #fff;\n
    border-radius: 10%;\
    padding: 2px 5px;
    text-align: center;\
    font-weight: 700"
  onMouseOver="${showTime}"
  onTouchStart="${showTime}"
  onMouseOut="${hideTime}"
  onTouchEnd="${hideTime}"
>${idx}</div>`;
  };

  const loadRide = () => {
    if (!rideId) return;
    setLoading(true);

    getClient('coreservice-ride')
      .then((c) => c.get(`/rides/${rideId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => setRide(data.ride));
  };

  const loadOpenapiRide = () => {
    if (!ride?.properties?.openapi?.rideId) return;
    setLoading(true);

    getClient('openapi-ride')
      .then((c) => c.get(`/rides/${ride.properties.openapi.rideId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setOpenapiRide(data.ride);
        if (!showTerminate) {
          const { latitude, longitude } = data.ride.startedKickboardLocation;
          setSelectDiscountGroupId(data.ride.discountGroupId);
          if (data.ride.discountGroupId) {
            onSearchDiscounts(data.ride.discountGroupId, '');
          }

          setTerminateLocation(
            new window.naver.maps.LatLng(latitude, longitude)
          );
        }
      });
  };

  const onSearchDiscountGroups = (search) => {
    setLoading(true);
    const params = { search };
    getClient('openapi-ride')
      .then((c) => c.get('/discountGroups', { params }))
      .finally(() => setLoading(false))
      .then(({ data }) => setDiscountGroups(data.discountGroups));
  };

  const onSearchDiscountGroupsWithDebounce = _.debounce(
    onSearchDiscountGroups,
    500
  );

  const onChangeDiscountGroup = (discountGroupId) => {
    setSelectDiscountGroupId(discountGroupId);
    if (!discountGroupId) return;
    changeDiscountForm.setFieldsValue({ discountId: null });
    onSearchDiscounts(discountGroupId, '');
  };

  const onSearchDiscounts = (discountGroupId, search) => {
    setLoading(true);
    const params = { search, take: 10, showUsed: false };
    getClient('openapi-discount')
      .then((c) => c.get(`/discountGroups/${discountGroupId}`, { params }))
      .finally(() => setLoading(false))
      .then(({ data }) => setDiscounts(data.discounts));
  };

  const onChangeDiscount = ({ discountId, discountGroupId }) => {
    getClient('openapi-ride')
      .then((c) =>
        c.post(`/rides/${ride.properties.openapi.rideId}/discount`, {
          discountId,
          discountGroupId,
        })
      )
      .finally(() => setLoading(false))
      .then(() => {
        message.success('할인을 변경하였습니다.');
        setShowChangeDiscount(false);
        loadRide();
      });
  };

  const loadRidePayments = () => {
    setLoading(true);

    getClient('openapi-ride')
      .then((c) => c.get(`/rides/${ride.properties.openapi.rideId}/payments`))
      .finally(() => setLoading(false))
      .then(({ data }) => setRidePayments(data.payments));
  };

  const onReceiptChange = (key) => {
    if (key !== 'histories') return;
    loadRidePayments();
  };

  const onInfoChange = (key) => {
    if (key !== 'timeline') return;
    getTimeline();
  };

  const refundPayment = (paymentId, data) => {
    setLoading(true);

    getClient('openapi-ride')
      .then((c) =>
        c.delete(
          `/rides/${ride.properties.openapi.rideId}/payments/${paymentId}`,
          {
            data,
          }
        )
      )
      .finally(() => setLoading(false))
      .then(() => loadRidePayments());
  };

  const onAddPayment = (paymentInfo) => {
    setLoading(true);

    getClient('openapi-ride')
      .then((c) =>
        c.post(`/rides/${ride.properties.openapi.rideId}/payments`, paymentInfo)
      )
      .finally(() => setLoading(false))
      .then(() => {
        loadRidePayments();
        setShowAddPayment(false);
      });
  };

  const getTimeline = () => {
    setLoading(true);

    getClient('openapi-ride')
      .then((c) => c.get(`/rides/${ride.properties.openapi.rideId}/timeline`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setTimeline(data.timeline);
      });
  };

  const calculateTerminatePricing = () => {
    const { _lat: latitude, _lng: longitude } = debouncedTerminateLocation;
    const terminatedAt =
      terminateForm.getFieldValue('terminatedAt') || moment();
    if (!latitude || !longitude) return;

    setLoading(true);
    getClient('openapi-ride')
      .then((c) =>
        c.get(`/rides/${ride.properties.openapi.rideId}/pricing`, {
          params: {
            latitude: debouncedTerminateLocation._lat,
            longitude: debouncedTerminateLocation._lng,
            terminatedAt: terminatedAt.format(),
          },
        })
      )
      .finally(() => setLoading(false))
      .then(({ data }) => setTerminateReceipt(data.pricing));
  };

  const setTerminateLocation = (location) => {
    setTerminateReceipt(null);
    setTerminateLocationState(location);
  };

  const onTerminate = ({ terminatedAt }) => {
    setLoading(true);
    if (!debouncedTerminateLocation || !terminateReceipt) {
      message.warn('가격을 책정하고 있습니다. 책정이 완료된 후 시도해주세요.');
      return;
    }

    getClient('openapi-ride').then((c) =>
      c
        .delete(`/rides/${ride.properties.openapi.rideId}`, {
          params: {
            latitude: debouncedTerminateLocation._lat,
            longitude: debouncedTerminateLocation._lng,
            terminatedAt: terminatedAt.format(),
            terminatedType: 'ADMIN_REQUESTED',
          },
        })
        .finally(() => setLoading(false))
        .then(() => {
          loadRide();
          setShowTerminate(false);
        })
    );
  };

  const onLights = () => {
    setLoading(true);

    const action = !lightsOn ? 'on' : 'off';
    getClient('openapi-ride')
      .then((c) =>
        c.get(`/rides/${ride.properties.openapi.rideId}/lights/${action}`)
      )
      .finally(() => setLoading(false))
      .then(() => setLightsOn(!lightsOn));
  };

  const onLock = () => {
    setLoading(true);

    const action = !lockOn ? 'on' : 'off';
    getClient('openapi-ride')
      .then((c) =>
        c.get(`/rides/${ride.properties.openapi.rideId}/lock/${action}`)
      )
      .finally(() => setLoading(false))
      .then(() => setLockOn(!lockOn));
  };

  useEffect(loadRide, [rideId]);
  useEffect(loadOpenapiRide, [
    ride?.properties?.openapi?.rideId,
    showTerminate,
  ]);

  useEffect(onSearchDiscountGroups, []);
  useEffect(calculateTerminatePricing, [
    debouncedTerminateLocation,
    ride?.properties?.openapi?.rideId,
    terminateForm,
  ]);

  useInterval(
    loadRide,
    openapiRide && !openapiRide.terminatedAt ? 10000 : null
  );
  return (
    <>
      <Card>
        <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Typography.Title level={3} copyable={openapiRide}>
                  {openapiRide ? ride.properties.openapi.rideId : '로딩 중...'}
                </Typography.Title>
              </Col>

              {openapiRide && !openapiRide.terminatedAt && (
                <Col>
                  <Row gutter={[4, 0]} align="middle">
                    <Col>
                      <Checkbox
                        checked={lightsOn}
                        onChange={onLights}
                        disabled={isLoading}
                      >
                        라이트
                      </Checkbox>
                    </Col>
                    <Col>
                      <Checkbox
                        checked={lockOn}
                        onChange={onLock}
                        disabled={isLoading}
                      >
                        일시정지
                      </Checkbox>
                    </Col>
                    <Col>
                      <Button
                        icon={<StopOutlined />}
                        disabled={isLoading}
                        onClick={() => setShowTerminate(true)}
                        danger
                      >
                        라이드 종료
                      </Button>

                      <Modal
                        title="라이드 종료"
                        visible={showTerminate}
                        okType="danger"
                        okText="라이드 종료"
                        cancelText="취소"
                        onOk={terminateForm.submit}
                        onCancel={() => setShowTerminate(false)}
                      >
                        <Form
                          layout="vertical"
                          form={terminateForm}
                          onFinish={onTerminate}
                          initialValues={{
                            terminatedAt: moment(),
                          }}
                        >
                          <Row gutter={[4, 4]}>
                            <Col span={24}>
                              {openapiRide && (
                                <NaverMap
                                  id="terminate-location"
                                  style={{
                                    width: '100%',
                                    height: '300px',
                                  }}
                                  defaultZoom={13}
                                  center={terminateLocation}
                                  onCenterChanged={setTerminateLocation}
                                >
                                  <Marker position={terminateLocation} />
                                </NaverMap>
                              )}
                            </Col>
                            <Col span={24}>
                              <Form.Item label="종료 시점:" name="terminatedAt">
                                <DatePicker
                                  showTime
                                  style={{ width: '100%' }}
                                  onChange={calculateTerminatePricing}
                                  format="YYYY년 MM월 DD일 H시 m분 s초"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Descriptions bordered size="small">
                                {terminateReceipt ? (
                                  <>
                                    <Descriptions.Item
                                      label="심야 요금"
                                      span={3}
                                    >
                                      {terminateReceipt.isNightly
                                        ? '적용 됨'
                                        : '적용 안됨'}
                                    </Descriptions.Item>

                                    {terminateReceipt.standard.price !== 0 && (
                                      <Descriptions.Item
                                        label="기본요금 결제 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.standard.price.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.standard.discount !==
                                      0 && (
                                      <Descriptions.Item
                                        label="기본요금 할인 금액"
                                        span={3}
                                      >
                                        -
                                        {terminateReceipt.standard.discount.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.standard.total !== 0 && (
                                      <Descriptions.Item
                                        label="기본요금 최종 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.standard.total.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.perMinute.price !== 0 && (
                                      <Descriptions.Item
                                        label="분당요금 결제 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.perMinute.price.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.perMinute.discount !==
                                      0 && (
                                      <Descriptions.Item
                                        label="분당요금 할인 금액"
                                        span={3}
                                      >
                                        -
                                        {terminateReceipt.perMinute.discount.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.perMinute.total !== 0 && (
                                      <Descriptions.Item
                                        label="분당요금 최종 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.perMinute.total.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.surcharge.price !== 0 && (
                                      <Descriptions.Item
                                        label="추가요금 결제 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.surcharge.price.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.surcharge.discount !==
                                      0 && (
                                      <Descriptions.Item
                                        label="추가요금 할인 금액"
                                        span={3}
                                      >
                                        -
                                        {terminateReceipt.surcharge.discount.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.surcharge.total !== 0 && (
                                      <Descriptions.Item
                                        label="추가요금 최종 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.surcharge.total.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.total !== 0 && (
                                      <Descriptions.Item
                                        label="전체 결제 금액"
                                        span={3}
                                      >
                                        {terminateReceipt.price.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    {terminateReceipt.discount !== 0 && (
                                      <Descriptions.Item
                                        label="전체 할인 금액"
                                        span={3}
                                      >
                                        -
                                        {terminateReceipt.discount.toLocaleString()}
                                        원
                                      </Descriptions.Item>
                                    )}

                                    <Descriptions.Item
                                      label="최종 금액"
                                      span={3}
                                    >
                                      {terminateReceipt.total.toLocaleString()}
                                      원
                                    </Descriptions.Item>
                                  </>
                                ) : (
                                  <Descriptions.Item>
                                    가격을 측정하는 중...
                                  </Descriptions.Item>
                                )}
                              </Descriptions>
                            </Col>
                          </Row>
                        </Form>
                      </Modal>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
          {openapiRide && (
            <>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>라이드 정보</Typography.Title>
                  <Tabs defaultActiveKey="info" onChange={onInfoChange}>
                    <Tabs.TabPane tab="기본 정보" key="info">
                      <Descriptions bordered size="small">
                        <Descriptions.Item label="현재 상태" span={2}>
                          {!openapiRide.terminatedAt ? (
                            <Badge status="processing" text="탑승 중..." />
                          ) : (
                            <Badge status="success" text="종료됨" />
                          )}
                        </Descriptions.Item>

                        <Descriptions.Item label="킥보드 코드" span={2}>
                          <Typography.Text copyable={true}>
                            {openapiRide.kickboardCode}
                          </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="시작 일자" span={2}>
                          {dayjs(openapiRide.startedAt).format(
                            'YYYY년 M월 D일 H시 m분 s초'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="종료 일자" span={2}>
                          {openapiRide.terminatedAt
                            ? dayjs(openapiRide.terminatedAt).format(
                                'YYYY년 M월 D일 H시 m분 s초'
                              )
                            : '라이드 중...'}
                        </Descriptions.Item>
                        <Descriptions.Item label="시작 위치" span={2}>
                          {openapiRide.startedKickboardLocation ? (
                            <NaverMap
                              id="started-location"
                              style={{
                                width: '100%',
                                height: '300px',
                              }}
                              defaultZoom={13}
                              center={
                                new window.naver.maps.LatLng(
                                  openapiRide.startedKickboardLocation.latitude,
                                  openapiRide.startedKickboardLocation.longitude
                                )
                              }
                            >
                              <Marker
                                position={
                                  new window.naver.maps.LatLng(
                                    openapiRide.startedKickboardLocation.latitude,
                                    openapiRide.startedKickboardLocation.longitude
                                  )
                                }
                              />
                            </NaverMap>
                          ) : (
                            '위치 정보 없음'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="반납 위치" span={2}>
                          {!openapiRide.terminatedAt ? (
                            '라이드 중...'
                          ) : openapiRide.terminatedKickboardLocation ? (
                            <NaverMap
                              id="terminated-location"
                              style={{
                                width: '100%',
                                height: '300px',
                              }}
                              defaultZoom={13}
                              center={
                                new window.naver.maps.LatLng(
                                  openapiRide.terminatedKickboardLocation.latitude,
                                  openapiRide.terminatedKickboardLocation.longitude
                                )
                              }
                            >
                              <Marker
                                position={
                                  new window.naver.maps.LatLng(
                                    openapiRide.terminatedKickboardLocation.latitude,
                                    openapiRide.terminatedKickboardLocation.longitude
                                  )
                                }
                              />
                            </NaverMap>
                          ) : (
                            '위치 정보 없음'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="반납 사진" span={2}>
                          {!openapiRide.terminatedAt ? (
                            '라이드 중...'
                          ) : openapiRide.photo ? (
                            <Image
                              src={openapiRide.photo}
                              width={100}
                              alt="이미지를 로드할 수 없음"
                            />
                          ) : (
                            '업로드 하지 않음'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="할인 ID" span={1}>
                          {!openapiRide.discountGroupId ||
                          !openapiRide.discountId ? (
                            '적용 안함'
                          ) : (
                            <Link
                              to={`/discountGroups/${openapiRide.discountGroupId}`}
                            >
                              {openapiRide.discountId}
                            </Link>
                          )}
                          {!openapiRide.terminatedAt && (
                            <>
                              <Button
                                type="link"
                                shape="circle"
                                onClick={() => setShowChangeDiscount(true)}
                                icon={<EditOutlined />}
                              />

                              <Modal
                                title="할인 변경"
                                visible={showChangeDiscount}
                                okType="primary"
                                okText="변경"
                                cancelText="취소"
                                onOk={changeDiscountForm.submit}
                                onCancel={() => setShowChangeDiscount(false)}
                              >
                                <Form
                                  layout="vertical"
                                  form={changeDiscountForm}
                                  onFinish={onChangeDiscount}
                                  initialValues={{
                                    discountGroupId:
                                      openapiRide.discountGroupId,
                                    discountId: openapiRide.discountId,
                                  }}
                                >
                                  <Row gutter={[4, 4]}>
                                    <Col span={24}>
                                      <Form.Item
                                        label="할인 그룹:"
                                        name="discountGroupId"
                                        required
                                      >
                                        <Select
                                          showSearch
                                          filterOption={false}
                                          placeholder={
                                            '할인 그룹을 선택해주세요.'
                                          }
                                          onSearch={
                                            onSearchDiscountGroupsWithDebounce
                                          }
                                          onChange={onChangeDiscountGroup}
                                          loading={isLoading}
                                        >
                                          <Select.Option>
                                            선택 안함
                                          </Select.Option>
                                          {discountGroups.map(
                                            ({ discountGroupId, name }) => (
                                              <Select.Option
                                                key={discountGroupId}
                                              >
                                                {name}
                                              </Select.Option>
                                            )
                                          )}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    {selectDiscountGroupId && (
                                      <Col span={24}>
                                        <Form.Item
                                          label="할인:"
                                          name="discountId"
                                          required
                                          rules={[
                                            {
                                              required: true,
                                              message: '반드시 선택해주세요.',
                                            },
                                          ]}
                                        >
                                          <Select
                                            showSearch
                                            filterOption={false}
                                            placeholder={'할인을 선택해주세요.'}
                                            onSearch={(search) =>
                                              onSearchDiscounts(
                                                selectDiscountGroupId,
                                                search
                                              )
                                            }
                                            loading={isLoading}
                                          >
                                            {discounts.map(({ discountId }) => (
                                              <Select.Option key={discountId}>
                                                {discountId}
                                              </Select.Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                    )}
                                  </Row>
                                </Form>
                              </Modal>
                            </>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="이동 기록" key="timeline">
                      {timeline && (
                        <NaverMap
                          id="timeline"
                          style={{
                            width: '100%',
                            height: '400px',
                          }}
                          defaultZoom={14}
                          defaultCenter={
                            new window.naver.maps.LatLng(
                              openapiRide.startedKickboardLocation.latitude,
                              openapiRide.startedKickboardLocation.longitude
                            )
                          }
                        >
                          {timeline.map(
                            ({ latitude, longitude, createdAt }, idx) => (
                              <Marker
                                position={{ lat: latitude, lng: longitude }}
                                icon={{
                                  content: createMarkerIcon({ idx, createdAt }),
                                  anchor: { x: 18, y: 15 },
                                }}
                              />
                            )
                          )}

                          <Polyline
                            path={[
                              ...timeline.map(
                                ({ latitude, longitude }) =>
                                  new window.naver.maps.LatLng(
                                    latitude,
                                    longitude
                                  )
                              ),
                            ]}
                            strokeColor={'#303030'}
                            strokeStyle={'solid'}
                            strokeOpacity={0.5}
                            strokeWeight={2}
                          />
                        </NaverMap>
                      )}
                    </Tabs.TabPane>
                  </Tabs>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>탑승자 정보</Typography.Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="이름">
                      {openapiRide.realname}
                    </Descriptions.Item>
                    <Descriptions.Item label="전화번호">
                      {openapiRide.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="생년월일">
                      {dayjs(openapiRide.birthday).format('YYYY년 MM월 DD일')}
                    </Descriptions.Item>
                    <Descriptions.Item label="사용자 ID" span={2}>
                      <Typography.Text copyable={true}>
                        {openapiRide.userId}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="보험 ID">
                      <Typography.Text copyable={openapiRide.insuranceId}>
                        {openapiRide.insuranceId || '보험이 신청되지 않음'}
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Row justify="space-between">
                    <Col>
                      <Typography.Title level={4}>
                        결제 정보 ({openapiRide.price.toLocaleString()}원)
                      </Typography.Title>
                    </Col>
                    {showRefund && (
                      <RefundModal
                        payment={showRefund}
                        refundPayment={refundPayment}
                        onClose={() => setShowRefund(null)}
                      />
                    )}

                    {openapiRide.terminatedAt && (
                      <Col>
                        <Button
                          style={{ margin: 3 }}
                          icon={<PlusOutlined />}
                          onClick={() => setShowAddPayment(true)}
                        >
                          추가 결제
                        </Button>
                        <Modal
                          title="추가 결제"
                          visible={showAddPayment}
                          okText="추가 결제"
                          cancelText="취소"
                          onOk={addPaymentForm.submit}
                          onCancel={() => setShowAddPayment(false)}
                        >
                          <Form
                            layout="vertical"
                            form={addPaymentForm}
                            onFinish={onAddPayment}
                            initialValues={{
                              paymentType: 'SERVICE',
                              amount: 1000,
                              description: '관리자에 의해 결제되었습니다.',
                            }}
                          >
                            <Row gutter={[4, 0]}>
                              <Col>
                                <Form.Item
                                  name="paymentType"
                                  label="결제 타입:"
                                  required
                                >
                                  <Radio.Group>
                                    <Radio.Button value="SERVICE">
                                      서비스 금액
                                    </Radio.Button>
                                    <Radio.Button value="SURCHARGE">
                                      추가 금액
                                    </Radio.Button>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>

                              <Col flex="auto">
                                <Form.Item
                                  name="amount"
                                  label="금액:"
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: '반드시 금액을 입력해주세요.',
                                    },
                                    {
                                      type: 'number',
                                      min: 500,
                                      message:
                                        '500원 이상부터 결제가 가능합니다.',
                                    },
                                    {
                                      type: 'number',
                                      max: 1000000,
                                      message:
                                        '1,000,000원 금액을 초과할 수 없습니다.',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    keyboard={false}
                                    controls={false}
                                    placeholder="결제 금액"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row justify="start" gutter={[4, 0]}>
                              <Col flex="auto">
                                <Form.Item
                                  name="description"
                                  label="결제 내용:"
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        '결제 내용을 반드시 입력해주세요.',
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="결제 내용을 입력하세요."
                                    disabled={isLoading}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Modal>
                        <Popconfirm
                          title="정말로 모두 환불하시겠습니까?"
                          disabled={isLoading}
                          onConfirm={() => refundPayment('')}
                          okText="전체 환불"
                          cancelText="취소"
                        >
                          <Button
                            icon={<StopOutlined />}
                            style={{ margin: 3 }}
                            danger
                          >
                            환불
                          </Button>
                        </Popconfirm>
                      </Col>
                    )}
                  </Row>
                  {openapiRide.terminatedAt ? (
                    <Tabs defaultActiveKey="receipt" onChange={onReceiptChange}>
                      <Tabs.TabPane tab="영수증" key="receipt">
                        <Descriptions bordered size="small">
                          <Descriptions.Item label="영수증 ID" span={2}>
                            <Typography.Text copyable={true}>
                              {openapiRide.receipt.receiptId}
                            </Typography.Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="심야 요금" span={1}>
                            {openapiRide.receipt.isNightly
                              ? '적용 됨'
                              : '적용 안됨'}
                          </Descriptions.Item>

                          <Descriptions.Item
                            label="기본요금 결제 금액"
                            span={1}
                          >
                            {openapiRide.receipt.standard.price.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="기본요금 할인 금액"
                            span={1}
                          >
                            -
                            {openapiRide.receipt.standard.discount.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="기본요금 최종 금액"
                            span={1}
                          >
                            {openapiRide.receipt.standard.total.toLocaleString()}
                            원
                          </Descriptions.Item>

                          <Descriptions.Item
                            label="분당요금 결제 금액"
                            span={1}
                          >
                            {openapiRide.receipt.perMinute.price.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="분당요금 할인 금액"
                            span={1}
                          >
                            -
                            {openapiRide.receipt.perMinute.discount.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="분당요금 최종 금액"
                            span={1}
                          >
                            {openapiRide.receipt.perMinute.total.toLocaleString()}
                            원
                          </Descriptions.Item>

                          <Descriptions.Item
                            label="추가요금 결제 금액"
                            span={1}
                          >
                            {openapiRide.receipt.surcharge.price.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="추가요금 할인 금액"
                            span={1}
                          >
                            -
                            {openapiRide.receipt.surcharge.discount.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item
                            label="추가요금 최종 금액"
                            span={1}
                          >
                            {openapiRide.receipt.surcharge.total.toLocaleString()}
                            원
                          </Descriptions.Item>
                          <Descriptions.Item label="전체 결제 금액" span={1}>
                            {openapiRide.receipt.price.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="전체 할인 금액" span={1}>
                            -{openapiRide.receipt.discount.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="최종 금액" span={1}>
                            {openapiRide.receipt.total.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="계산 일자" span={3}>
                            {dayjs(openapiRide.receipt.updatedAt).format(
                              'YYYY년 M월 D일 H시 m분 s초'
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="결제 내역" key="histories">
                        <List
                          bordered
                          loading={isLoading}
                          itemLayout="vertical"
                          dataSource={ridePayments}
                          renderItem={(payment) => (
                            <PaymentItem
                              payment={payment}
                              showRefundModel={() => setShowRefund(payment)}
                            />
                          )}
                        />
                      </Tabs.TabPane>
                    </Tabs>
                  ) : (
                    <Result
                      icon={<SmileOutlined />}
                      title="라이드가 종료된 후 반영됩니다."
                    />
                  )}
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
});

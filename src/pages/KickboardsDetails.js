import {
  DeleteOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Popconfirm,
  Progress,
  Result,
  Row,
  Select,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Marker, NaverMap } from 'react-naver-maps';
import { useParams, withRouter } from 'react-router-dom';
import {
  KickboardBatteryLockSwitch,
  KickboardLightsSwitch,
  KickboardStatusSwitch,
  RegionSelect,
} from '../components';
import { FranchisesSelect } from '../components/FranchisesSelect';
import { getClient } from '../tools';

export const KickboardsDetails = withRouter(({ history }) => {
  const params = useParams();
  const kickboardForm = Form.useForm()[0];
  const [kickboard, setKickboard] = useState(null);
  const [status, setStatus] = useState(null);
  const [battery, setBattery] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const kickboardCode =
    params.kickboardCode !== 'add' ? params.kickboardCode : '';

  const loadKickboard = () => {
    if (!kickboardCode) return;
    setLoading(true);
    getClient('openapi-kickboard')
      .then((c) => c.get(`/kickboards/${kickboardCode}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setKickboard(data.kickboard);
        kickboardForm.setFieldsValue(data.kickboard);
        loadKickboardStatus();
        loadKickboardBattery();
      });
  };

  const loadKickboardStatus = useCallback(
    (refresh = false) => {
      setLoading(true);
      const method = refresh ? 'post' : 'get';
      getClient('openapi-kickboard')
        .then((c) => c[method](`/kickboards/${kickboardCode}/status`))
        .finally(() => setLoading(false))
        .then(({ data }) => setStatus(data.status));
    },
    [kickboardCode]
  );

  const loadKickboardBattery = useCallback(
    (refresh = false) => {
      setLoading(true);
      const method = refresh ? 'post' : 'get';
      getClient('openapi-kickboard')
        .then((c) => c[method](`/kickboards/${kickboardCode}/battery`))
        .finally(() => setLoading(false))
        .then(({ data }) => setBattery(data.battery));
    },
    [kickboardCode]
  );

  const saveKickboard = useCallback(
    (body) => {
      setLoading(true);
      const { kickboardCode } = body;
      getClient('openapi-kickboard')
        .then((c) => c.post(`/kickboards/${kickboardCode}`, body))
        .finally(() => setLoading(false))
        .then(({ data }) => {
          const isCreated = params.kickboardCode === 'add';
          message.success(`${isCreated ? '수정' : '생성'}되었습니다.`);
          if (isCreated) {
            history.push(`/kickboards/${data.kickboard.kickboardCode}`);
          }
        });
    },
    [history, params.kickboardCode]
  );

  const deleteKickboard = useCallback(() => {
    setLoading(true);
    getClient('openapi-kickboard')
      .then((c) => c.delete(`/kickboards/${kickboardCode}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/kickboards`);
      });
  }, [history, kickboardCode]);

  useEffect(loadKickboard, [
    kickboardCode,
    kickboardForm,
    loadKickboardBattery,
    loadKickboardStatus,
  ]);

  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        {kickboard && kickboard.disconnectedAt && (
          <div style={{ margin: '10px 0 10px 0' }}>
            <Alert
              message='경고! 연결이 끊긴 킥보드입니다.'
              description={`해당 킥보드는 ${dayjs(
                kickboard.disconnectedAt
              ).format(
                'YYYY년 MM월 DD일 hh시 mm분 ss초'
              )} 이후 연결이 끊겼습니다.`}
              type='warning'
              closable
            />
          </div>
        )}
        <Card>
          <Form
            layout='vertical'
            onFinish={saveKickboard}
            form={kickboardForm}
            initialValues={{ mode: 0, collect: null, lost: null }}
          >
            <Row justify='space-between' style={{ marginBottom: 20 }}>
              <Col>
                <Typography.Title level={3} copyable={kickboardCode}>
                  {kickboardCode || '새로운 킥보드'}
                </Typography.Title>
              </Col>
              <Col>
                <Row gutter={[4, 0]}>
                  {kickboard && (
                    <Col>
                      <Popconfirm
                        title='정말로 삭제하시겠습니까?'
                        okText='네'
                        cancelText='아니요'
                        onConfirm={deleteKickboard}
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
                      icon={kickboardCode ? <SaveOutlined /> : <PlusOutlined />}
                      loading={isLoading}
                      type='primary'
                      htmlType='submit'
                    >
                      {kickboardCode ? '저장' : '생성'}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[4, 4]} justify='space-between'>
              <Col flex={1}>
                <Form.Item
                  name='kickboardCode'
                  label='킥보드 코드:'
                  required
                  rules={[
                    {
                      required: true,
                      message: '킥보드 코드는 비워둘 수 없습니다.',
                    },
                    {
                      len: 6,
                      message: '반드시 킥보드 코드는 6자리여야 합니다.',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name='kickboardId' label='IMEI:' required>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name='photo'
              label='반납 사진:'
              normalize={(value) => (value.length ? value : null)}
              rules={[{ type: 'url', message: '올바른 주소여야 합니다.' }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={[4, 4]} justify='space-between'>
              <Col flex={1}>
                <Form.Item name='mode' label='모드:' required>
                  <Select>
                    <Select.Option value={0}>사용 가능</Select.Option>
                    <Select.Option value={1}>사용 중</Select.Option>
                    <Select.Option value={2}>망가짐</Select.Option>
                    <Select.Option value={3}>수거됨</Select.Option>
                    <Select.Option value={4}>미등록</Select.Option>
                    <Select.Option value={5}>비활성화됨</Select.Option>
                    <Select.Option value={6}>마이킥</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name='lost' label='분실 상태:' required>
                  <Select>
                    <Select.Option>분실되지 않음</Select.Option>
                    <Select.Option value={3}>1차 분실</Select.Option>
                    <Select.Option value={2}>2차 분실</Select.Option>
                    <Select.Option value={1}>3차 분실</Select.Option>
                    <Select.Option value={0}>최종 분실</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name='collect' label='수거 상태:' required>
                  <Select>
                    <Select.Option>수거대상 아님</Select.Option>
                    <Select.Option value={0}>배터리 교체</Select.Option>
                    <Select.Option value={1}>위치 이동</Select.Option>
                    <Select.Option value={2}>고장</Select.Option>
                    <Select.Option value={3}>기타</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[4, 4]}>
              <Col flex={1}>
                <Form.Item name='regionId' label='지역:'>
                  <RegionSelect />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name='franchiseId' label='프렌차이즈 ID:'>
                  <FranchisesSelect mode={null} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      {kickboardCode && (
        <>
          <Col xl={12} span={24}>
            <Card>
              <Row justify='space-between'>
                <Col>
                  <Typography.Title level={3}>상태</Typography.Title>
                </Col>
                <Col>
                  <Button
                    icon={<RedoOutlined />}
                    loading={isLoading}
                    type='primary'
                    onClick={() => loadKickboardStatus(true)}
                  >
                    새로고침
                  </Button>
                </Col>
              </Row>
              {status ? (
                <Descriptions bordered size='small' layout='horizontal'>
                  <Descriptions.Item label='킥보드 속도' span={2}>
                    <Progress
                      percent={status.speed}
                      steps={10}
                      gapDegree={50}
                      format={(percent) => `${percent}KM`}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='GPS 속도' span={2}>
                    <Progress
                      percent={status.gps.speed}
                      steps={10}
                      gapDegree={50}
                      format={(percent) => `${percent}KM`}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='킥보드 배터리' span={2}>
                    <Progress
                      percent={status.power.scooter.battery}
                      steps={10}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='IoT 배터리' span={2}>
                    <Progress percent={status.power.iot.battery} steps={10} />
                  </Descriptions.Item>
                  <Descriptions.Item label='킥보드 상태' span={1}>
                    <KickboardStatusSwitch
                      kickboard={kickboard}
                      status={status}
                      onClick={loadKickboardStatus}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='배터리 잠금' span={1}>
                    <KickboardBatteryLockSwitch
                      kickboard={kickboard}
                      status={status}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='라이트' span={1}>
                    <KickboardLightsSwitch
                      kickboard={kickboard}
                      status={status}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label='컨트롤러' span={1}>
                    {status.isControllerChecked ? (
                      <Badge status='processing' text='정상' />
                    ) : (
                      <Badge status='warning' text='경고' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='배터리' span={1}>
                    {status.isBatteryChecked ? (
                      <Badge status='processing' text='정상' />
                    ) : (
                      <Badge status='warning' text='경고' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='IoT' span={1}>
                    {status.isIotChecked ? (
                      <Badge status='processing' text='정상' />
                    ) : (
                      <Badge status='warning' text='경고' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='부저' span={1}>
                    {status.isBuzzerOn ? (
                      <Badge status='processing' text='작동 중' />
                    ) : (
                      <Badge status='default' text='꺼짐' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='EBS 브레이크' span={1}>
                    {status.isEBSBrakeOn ? (
                      <Badge status='processing' text='작동 중' />
                    ) : (
                      <Badge status='default' text='꺼짐' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='넘어짐' span={1}>
                    {status.isFallDown ? (
                      <Badge status='warning' text='감지됨' />
                    ) : (
                      <Badge status='default' text='감지 안됨' />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label='위치' span={4}>
                    <NaverMap
                      id='current-location'
                      style={{
                        width: '100%',
                        height: '300px',
                      }}
                      defaultZoom={13}
                      center={
                        new window.naver.maps.LatLng(
                          status.gps.latitude,
                          status.gps.longitude
                        )
                      }
                    >
                      <Marker
                        position={
                          new window.naver.maps.LatLng(
                            status.gps.latitude,
                            status.gps.longitude
                          )
                        }
                      />
                    </NaverMap>
                  </Descriptions.Item>
                  <Descriptions.Item label='업데이트 일자' span={2}>
                    {dayjs(status.createdAt).format('YYYY년 MM월 DD일 H시 m분')}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Result status='warning' title='아직 상태 정보가 없습니다.' />
              )}
            </Card>
          </Col>
          <Col xl={12} span={24}>
            <Card>
              <Row justify='space-between'>
                <Col>
                  <Typography.Title level={3}>배터리</Typography.Title>
                </Col>
                <Col>
                  <Button
                    icon={<RedoOutlined />}
                    loading={isLoading}
                    type='primary'
                    onClick={() => loadKickboardBattery(true)}
                  >
                    새로고침
                  </Button>
                </Col>
              </Row>{' '}
              {battery ? (
                <Descriptions bordered size='small'>
                  <Descriptions.Item label='배터리 S/N' span={2}>
                    {battery.batterySN || '없음'}
                  </Descriptions.Item>
                  <Descriptions.Item label='배터리 셀타입' span={2}>
                    {battery.cellType || '없음'}
                  </Descriptions.Item>
                  <Descriptions.Item label='총 용량' span={2}>
                    {battery.totalCapacity}
                  </Descriptions.Item>
                  <Descriptions.Item label='총 시간' span={2}>
                    {battery.totalTime}
                  </Descriptions.Item>
                  {battery.cells.map((cell, index) => (
                    <Descriptions.Item label={`${index + 1}번째 셀`} span={2}>
                      {cell}
                    </Descriptions.Item>
                  ))}
                  <Descriptions.Item label='업데이트 일자'>
                    {dayjs(battery.updatedAt).format(
                      'YYYY년 MM월 DD일 H시 m분'
                    )}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Result status='warning' title='아직 배터리 정보가 없습니다.' />
              )}
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
});

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { KickboardInfoProvider, RegionInfoProvider, UserInfoProvider } from '.';
import { MonitoringStatus } from '../tools';

export const MonitoringItem = () => {
  const [action, setAction] = useState();
  const [collapse, setCollapse] = useState(false);
  const onChangeMonitoringStatus = (e) => {
    const { value } = e.target;
    const status = MonitoringStatus.find(({ type }) => type === value);
    setAction(status.action);
  };

  return (
    <Card style={{ margin: '10px 0' }}>
      <Row gutter={[8, 8]} justify="space-between">
        <Col>
          <Typography.Title level={4}>
            {dayjs().format('YYYY년 MM월 DD일 H시 m분')}{' '}
            <KickboardInfoProvider kickboardCode="DE20KP" />
          </Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setCollapse((c) => !c)}>
            더보기 {collapse ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Button>
        </Col>
      </Row>
      <Row gutter={[4, 4]} justify="space-between">
        <Col xxl={6} span={24}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="일시">
              {dayjs().format('YYYY년 MM월 DD일 H시 m분')}
            </Descriptions.Item>
            <Descriptions.Item label="킥보드 코드">
              <KickboardInfoProvider kickboardCode="DE20KP" showKickboardId />
            </Descriptions.Item>
            <Descriptions.Item label="지역">
              <RegionInfoProvider regionId="026d2188-c839-4c31-b917-d173e2156929" />
            </Descriptions.Item>
            <Descriptions.Item label="사용자">
              <UserInfoProvider userId="9c584c50-4bbc-11ec-8171-65154d12b65d" />
            </Descriptions.Item>
            {/* <Descriptions.Item label="이름">엄다니엘</Descriptions.Item>
              <Descriptions.Item label="전화번호">
               010-9563-7570
              </Descriptions.Item> */}
          </Descriptions>
        </Col>
        <Col xxl={7} span={12}>
          <Image
            src="http://www.outdoornews.co.kr/news/photo/201408/14846_47104_272.jpg"
            alt="이미지를 로드할 수 없음"
          />
        </Col>
        <Col xxl={3} span={12}>
          <Image
            src={
              'https://img.etnews.com/photonews/2105/1414137_20210517172108_588_0001.jpg'
            }
            alt="이미지를 로드할 수 없음"
          />
        </Col>
        <Col xxl={6} span={24}>
          <Card>
            <Typography.Title level={4}>조치</Typography.Title>
            <Radio.Group
              style={{ width: '100%' }}
              onChange={onChangeMonitoringStatus}
            >
              <Space direction="vertical">
                {MonitoringStatus.map(({ type, name, icon }) => (
                  <Radio value={type} key={type}>
                    {name} {icon}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <Row justify="end">
              <Col>{action}</Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {collapse && (
        <Typography.Paragraph>
          <pre>
            2021년 11월 13일 15시 30분 / 반납 / 반납이 완료되었습니다.
            <br />
            2021년 11월 13일 15시 30분 / 통지 / 미제출된 반납 사진으로 인해 안내
            문자를 발송하였습니다.
            <br />
            2021년 11월 13일 15시 30분 / 수거 / 수거가 완료되었습니다. 수거 통보
            및 15,000원이 결제되었습니다.
            <br />
          </pre>
        </Typography.Paragraph>
      )}
    </Card>
  );
};

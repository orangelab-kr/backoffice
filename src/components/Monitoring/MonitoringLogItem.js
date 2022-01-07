import { Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import { MonitoringLogType, MonitoringStatus } from '../../tools';

export const MonitoringLogItem = ({ log }) => {
  const createdAt = dayjs(log.createdAt).format('YYYY년 M월 D일 H시 m분');
  const [monitoringStatus, monitoringLogType] = [
    MonitoringStatus.find(({ type }) => type === log.monitoringStatus),
    MonitoringLogType.find(({ type }) => type === log.logType),
  ];

  return (
    <Row>
      <Col style={{ fontWeight: 600, textAlign: 'center' }} span={5}>
        {createdAt}
      </Col>
      <Col>
        <Divider type="vertical" />
      </Col>
      <Col
        span={4}
        style={{
          fontWeight: 800,
          textAlign: 'center',
          color: monitoringStatus?.color,
        }}
      >
        {monitoringStatus?.name || log.monitoringStatus}
      </Col>
      <Col>
        <Divider type="vertical" />
      </Col>
      <Col
        span={3}
        style={{
          fontWeight: 800,
          textAlign: 'center',
          color: monitoringLogType?.color,
        }}
      >
        {monitoringLogType?.text || log.logType}
      </Col>
      <Col>
        <Divider type="vertical" />
      </Col>
      <Col>
        {'  '}
        {log.message}
      </Col>
    </Row>
  );
};

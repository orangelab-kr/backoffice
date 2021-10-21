import { ZoomInOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { withRouter } from 'react-router';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserRides = withRouter(({ history, user }) => {
  const { userId } = user;
  const onRequest = () =>
    getClient('coreservice-ride').then((c) => c.get(`/rides`));

  return (
    <BackofficeList
      title="라이드 기록"
      onRequest={onRequest}
      dataSourceKey="rides"
      defaultParams={{ userId }}
      renderItem={(ride) => (
        <List.Item>
          <Row justify="space-between">
            <Col>
              <Typography.Title level={5} copyable={true}>
                {ride.kickboardCode}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Typography.Text>
                {dayjs(ride.createdAt).format('YYYY년 M월 D일 H시 m분')}
                {' ~ '}
                {dayjs(ride.endedAT).format('D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <Button size="small" icon={<ZoomInOutlined />}>
                자세히보기
              </Button>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
});

import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserSessions = ({ user }) => {
  const { userId } = user;
  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) =>
      c.get(`/users/${userId}/sessions`, opts)
    );

  const generateSession = (opts) =>
    getClient('coreservice-accounts').then((c) =>
      c.get(`/users/${userId}/sessions/generate`, opts)
    );

  const deleteSession = (sessionId) =>
    getClient('coreservice-accounts').then((c) =>
      c.delete(`/users/${userId}/sessions/${sessionId}`)
    );

  return (
    <BackofficeList
      title="로그인 세션"
      onRequest={onRequest}
      dataSourceKey="sessions"
      buttons={
        <Row gutter={[4, 4]}>
          <Col>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={generateSession}
            >
              세션 발급
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="정말로 연결을 해제하시겠습니까?"
              onConfirm={() => deleteSession('')}
              okText="해제"
              cancelText="취소"
            >
              <Button icon={<StopOutlined />} danger>
                연결 끊기
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      renderItem={(session) => (
        <List.Item>
          <Row justify="space-between">
            <Col>
              <Typography.Title level={5} copyable={true}>
                {session.platform}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <b>로그인 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(session.createdAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <b>마지막 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(session.usedAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <Popconfirm
                title="정말로 연결을 해제하시겠습니까?"
                onConfirm={() => deleteSession('')}
                okText="해제"
                cancelText="취소"
              >
                <Button size="small" icon={<StopOutlined />} danger>
                  연결 끊기
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

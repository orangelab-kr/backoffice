import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../../tools';

export const UserSessions = withRouter(({ history, user }) => {
  const [isLoading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);

  const { userId } = user;
  const loadSessions = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/users/${userId}/sessions`))
      .then(({ data }) => setSessions(data.sessions))
      .finally(() => setLoading(false));
  };

  const generateSession = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/users/${userId}/sessions/generate`))
      .finally(loadSessions);
  };

  const deleteSession = (sessionId) => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.delete(`/users/${userId}/sessions/${sessionId}`))
      .finally(loadSessions);
  };

  useEffect(loadSessions, [userId]);
  return (
    <Card>
      <Row gutter={[4, 4]} justify="space-between">
        <Col flex={1}>
          <Typography.Title level={3}>로그인 세션</Typography.Title>
        </Col>
        <Col>
          <Row gutter={[4, 4]}>
            <Col>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                disabled={isLoading}
                onClick={generateSession}
              >
                세션 발급
              </Button>
            </Col>
            <Col>
              <Popconfirm
                title="정말로 연결을 해제하시겠습니까?"
                disabled={isLoading}
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
        </Col>
        <Col span={24}>
          <List
            loading={isLoading}
            itemLayout="vertical"
            dataSource={sessions}
            bordered
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
                      {dayjs(session.createdAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
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
                      disabled={isLoading}
                      onConfirm={() => deleteSession(session.sessionId)}
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
        </Col>
      </Row>
    </Card>
  );
});

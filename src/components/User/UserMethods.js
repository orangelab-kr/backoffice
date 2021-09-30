import { StopOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../../tools';

export const UserMethods = withRouter(({ history, user }) => {
  const [isLoading, setLoading] = useState(false);
  const [methods, setMethods] = useState([]);

  const { userId } = user;
  const loadMethods = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/users/${userId}/methods`))
      .then(({ data }) => setMethods(data.methods))
      .finally(() => setLoading(false));
  };

  const deleteMethod = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.delete(`/users/${userId}/methods/kakao`))
      .finally(loadMethods);
  };

  useEffect(loadMethods, [userId]);
  return (
    <Card>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Typography.Title level={3}>로그인 수단</Typography.Title>
        </Col>
        <Col span={24}>
          <List
            loading={isLoading}
            itemLayout="vertical"
            dataSource={methods}
            bordered
            renderItem={(method) => (
              <List.Item>
                <Row justify="space-between">
                  <Col>
                    <Typography.Title level={5} copyable={true}>
                      {method.description}
                    </Typography.Title>
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col>
                    <b>연결 시점: </b>
                    <Typography.Text copyable={true}>
                      {dayjs(method.createdAt).format(
                        'YYYY년 M월 D일 H시 m분 s초'
                      )}
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Popconfirm
                      title="정말로 연결을 해제하시겠습니까?"
                      disabled={isLoading}
                      onConfirm={deleteMethod}
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

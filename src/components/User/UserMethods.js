import { StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { withRouter } from 'react-router';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserMethods = withRouter(({ history, user }) => {
  const { userId } = user;
  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) =>
      c.get(`/users/${userId}/methods`, opts)
    );

  const deleteMethod = () =>
    getClient('coreservice-accounts').then((c) =>
      c.delete(`/users/${userId}/methods/kakao`)
    );

  return (
    <BackofficeList
      title="로그인 수단"
      indexKey="methodId"
      onRequest={onRequest}
      dataSourceKey="methods"
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
                {dayjs(method.createdAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <Popconfirm
                title="정말로 연결을 해제하시겠습니까?"
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
  );
});

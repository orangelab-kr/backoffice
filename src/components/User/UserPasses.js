import { StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { withRouter } from 'react-router';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserPasses = withRouter(({ history, user }) => {
  const { userId } = user;
  const onRequest = () =>
    getClient('coreservice-accounts').then((c) =>
      c.get(`/users/${userId}/passes`)
    );

  const deletePass = (pass) =>
    getClient('coreservice-accounts').then((c) =>
      c.delete(`/users/${userId}/passes/${pass.passId}`)
    );

  return (
    <BackofficeList
      title="패스"
      onRequest={onRequest}
      dataSourceKey="passes"
      renderItem={(pass) => (
        <List.Item>
          <Row justify="space-between">
            <Col>
              <Typography.Title
                level={5}
                copyable={true}
                delete={pass.expiredAt && dayjs(pass.expiredAt).isBefore()}
              >
                {pass.passProgram.name}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <b>등록 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(pass.createdAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            {pass.expiredAt && (
              <Col>
                <b>만료 시점: </b>
                <Typography.Text copyable={true}>
                  {dayjs(pass.expiredAt).format('YYYY년 M월 D일 H시 m분')}
                </Typography.Text>
              </Col>
            )}
            <Col>
              <Popconfirm
                title="정말로 패스를 삭제하시겠습니까?"
                onConfirm={() => deletePass(pass)}
                okText="삭제"
                cancelText="취소"
              >
                <Button size="small" icon={<StopOutlined />} danger>
                  삭제
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
});

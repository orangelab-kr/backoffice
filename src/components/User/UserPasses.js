import { StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserPasses = ({ user }) => {
  const { userId } = user;
  const [refresh, setRefresh] = useState(true);

  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) =>
      c.get(`/users/${userId}/passes`, opts)
    );

  const deletePass = (pass) =>
    getClient('coreservice-accounts')
      .then((c) =>
        c.post(`/users/${userId}/passes/${pass.passId}`, {
          expiredAt: new Date(),
        })
      )
      .then(() => setRefresh(true));

  return (
    <BackofficeList
      title="패스"
      indexKey="passId"
      hasSearch={true}
      onRequest={onRequest}
      dataSourceKey="passes"
      refresh={refresh}
      setRefresh={setRefresh}
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
                title="정말로 패스를 만료시키시겠습니까?"
                onConfirm={() => deletePass(pass)}
                okText="만료"
                cancelText="취소"
              >
                <Button size="small" icon={<StopOutlined />} danger>
                  만료
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

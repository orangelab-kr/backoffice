import { StopOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getClient } from '../../tools';

export const UserPasses = withRouter(({ history, user }) => {
  const [isLoading, setLoading] = useState(false);
  const [passes, setPasses] = useState([]);

  const { userId } = user;
  const loadPasses = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/users/${userId}/passes`))
      .then(({ data }) => setPasses(data.passes))
      .finally(() => setLoading(false));
  };

  const deletePass = (pass) => {
    setLoading(true);
    const { passId } = pass;
    getClient('coreservice-accounts')
      .then((c) => c.delete(`/users/${userId}/passes/${passId}`))
      .finally(loadPasses);
  };

  useEffect(loadPasses, [userId]);
  return (
    <Card>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Typography.Title level={3}>패스</Typography.Title>
        </Col>
        <Col span={24}>
          <List
            loading={isLoading}
            itemLayout="vertical"
            dataSource={passes}
            bordered
            renderItem={(pass) => (
              <List.Item>
                <Row justify="space-between">
                  <Col>
                    <Typography.Title
                      level={5}
                      copyable={true}
                      delete={
                        pass.expiredAt && dayjs(pass.expiredAt).isBefore()
                      }
                    >
                      {pass.passProgram.name}
                      {/* {coupon.passes} / {coupon.couponGroup.name} */}
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
                      title="정말로 쿠폰을 삭제하시겠습니까?"
                      disabled={isLoading}
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
        </Col>
      </Row>
    </Card>
  );
});

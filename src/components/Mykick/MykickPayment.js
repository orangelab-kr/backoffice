import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { getClient } from '../../tools';
import { BackofficeList } from '../List';
import _ from 'lodash';

export const MykickPayment = ({ rent }) => {
  const [refresh, setRefresh] = useState(true);

  const onRequest = (opts) => {
    _.set(opts, 'params.rentIds', [rent.rentId]);
    _.set(opts, 'params.hideCancelled', true);
    return getClient('mykick').then((c) =>
      c.get(`/users/${rent.user.userId}/payments`, opts)
    );
  };

  const deletePayment = (payment) => () =>
    getClient('mykick')
      .then((c) =>
        c.delete(`/users/${rent.user.userId}/payments/${payment.paymentId}`)
      )
      .then(() => setRefresh(true));

  if (!rent) return <></>;
  return (
    <BackofficeList
      title='결제 목록'
      indexKey='paymentId'
      onRequest={onRequest}
      dataSourceKey='payments'
      refresh={refresh}
      setRefresh={setRefresh}
      renderItem={(payments) => (
        <List.Item>
          <Row justify='space-between'>
            <Col>
              <Typography.Title level={5} copyable={true}>
                {payments.name}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify='space-between'>
            <Col>
              <b>결제 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(payments.createdAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <Popconfirm
                title='정말로 결제를 취소하시겠습니까?'
                onConfirm={deletePayment(payments)}
                okText='네, 취소합니다.'
                cancelText='아니요'
              >
                <Button size='small' icon={<CloseOutlined />} danger>
                  취소
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

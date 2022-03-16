import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useState } from 'react';
import { getClient } from '../../tools';
import { useToggle } from '../../tools/useToggle';
import { BackofficeList } from '../List';
import { MykickPaymentAdd } from './MykickPaymentAdd';

export const MykickPayment = ({ rent }) => {
  const [refresh, setRefresh] = useState(true);
  const [showPaymentAdd, setShowPaymentAdd] = useToggle(false);

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
    <>
      {showPaymentAdd && (
        <MykickPaymentAdd
          rent={rent}
          onClose={setShowPaymentAdd(false)}
          onRefresh={() => setRefresh(true)}
        />
      )}
      <BackofficeList
        title='결제 목록'
        indexKey='paymentId'
        onRequest={onRequest}
        dataSourceKey='payments'
        refresh={refresh}
        setRefresh={setRefresh}
        buttons={
          <Button
            icon={<PlusOutlined />}
            type='primary'
            onClick={setShowPaymentAdd(true)}
          >
            추가 결제
          </Button>
        }
        renderItem={(payments) => (
          <List.Item>
            <Row justify='space-between'>
              <Col>
                <Typography.Title level={5} copyable={true}>
                  {payments.name} / {payments.amount.toLocaleString()}원
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
    </>
  );
};

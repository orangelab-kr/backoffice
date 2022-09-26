import { StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Popconfirm, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserCards = ({ user }) => {
  const { userId } = user;
  const [refresh, setRefresh] = useState(true);

  const onRequest = (opts) =>
    getClient('coreservice-payments').then((c) =>
      c.get(`/users/${userId}/cards`, opts)
    );

  const deleteCard = (card) => () =>
    getClient('coreservice-payments')
      .then((c) => c.delete(`/users/${userId}/cards/${card.cardId}`))
      .then(() => setRefresh(true));

  return (
    <BackofficeList
      title='카드 목록'
      indexKey='cardId'
      onRequest={onRequest}
      dataSourceKey='cards'
      refresh={refresh}
      setRefresh={setRefresh}
      renderItem={(card) => (
        <List.Item>
          <Row justify='space-between'>
            <Col>
              <Typography.Title level={5} copyable={true}>
                {card.cardName}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify='space-between'>
            <Col>
              <b>등록 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(card.createdAt).format('YYYY년 M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col>
              <Popconfirm
                title='정말로 연결을 해제하시겠습니까?'
                onConfirm={deleteCard(card)}
                okText='해제'
                cancelText='취소'
              >
                <Button size='small' icon={<StopOutlined />} danger>
                  카드 삭제
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

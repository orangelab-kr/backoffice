import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Helmets = () => {
  const columns = [
    {
      title: '헬멧 맥주소',
      dataIndex: 'macAddress',
      render: (helmetMacAddress, helmet) => (
        <Link to={`/helmets/${helmet._id}`}>
          <Tag>{helmetMacAddress.toUpperCase().match(/.{2}/g).join(':')}</Tag>
        </Link>
      ),
    },
    {
      title: '배터리',
      dataIndex: 'battery',
      render: (battery) => (
        <Tag color={battery >= 70 ? 'green' : battery >= 30 ? 'yellow' : 'red'}>
          {battery}%
        </Tag>
      ),
    },
    {
      title: '제품',
      dataIndex: 'version',
      render: (version) =>
        version === 0 ? (
          <Tag color="blue">Solebe Y905</Tag>
        ) : version === 1 ? (
          <Tag color="green">HIKICK HELMET</Tag>
        ) : (
          <Tag color="red">알 수 없음</Tag>
        ),
    },
    {
      title: '최초 등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-kickboard').then((c) => c.get('/helmets', opts));

  return (
    <BackofficeTable
      title="헬멧 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="helmets"
      buttons={
        <Link to="/helmets/add">
          <Button icon={<PlusOutlined />} type="primary">
            헬멧 추가
          </Button>
        </Link>
      }
    />
  );
};

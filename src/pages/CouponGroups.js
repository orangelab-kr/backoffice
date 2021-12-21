import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const CouponGroups = () => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'couponGroupId',
      render: (value) => <Link to={`/couponGroups/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '쿠폰 코드',
      dataIndex: 'code',
      render: (value) => value || '없음',
    },
    {
      title: '타입',
      dataIndex: 'type',
      render: (value) => (value ? '일회성' : '다회성'),
    },
    {
      title: '사용자당 최대 개수',
      dataIndex: 'limit',
      render: (value) => (value ? `${value}개` : '제한 없음'),
    },
    {
      title: '만료',
      dataIndex: 'validity',
      render: (value) => (value ? `${value}초` : '만료 없음'),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
    {
      title: '수정 일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) => dayjs(updatedAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-payments').then((c) => c.get('/couponGroups', opts));

  return (
    <BackofficeTable
      title="쿠폰그룹 목록"
      hasSearch={true}
      columns={columns}
      scroll={{ x: 1300 }}
      onRequest={onRequest}
      dataSourceKey="couponGroups"
      buttons={
        <Link to="/couponGroups/add">
          <Button icon={<PlusOutlined />} type="primary">
            쿠폰그룹 추가
          </Button>
        </Link>
      }
    />
  );
};

import { UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { KickboardInfoProvider } from '../components/Kickboard/KickboardInfoProvider';
import { UserInfoProvider } from '../components/User/UserInfoProvider';
import { getClient } from '../tools';

export const Rides = () => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'rideId',
      render: (value) => <Link to={`/rides/${value}`}>{value}</Link>,
    },
    {
      title: '킥보드 코드',
      dataIndex: 'kickboardCode',
      render: (value) => <KickboardInfoProvider kickboardCode={value} />,
    },
    {
      title: '사용자',
      dataIndex: 'userId',
      render: (userId) => <UserInfoProvider userId={userId} />,
    },
    {
      title: '금액',
      dataIndex: 'price',
      render: (price, ride) =>
        ride.endedAt ? `${price.toLocaleString()}원` : '라이드 중',
    },
    {
      title: '시작 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '종료 일자',
      dataIndex: 'endedAt',
      render: (endedAt) =>
        endedAt ? dayjs(endedAt).format('D일 H시 m분') : '라이드 중',
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-ride').then((c) => c.get('/rides', opts));

  return (
    <BackofficeTable
      title="라이드 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="rides"
      buttons={
        <Link to="/rides/add">
          <Button icon={<UserAddOutlined />} type="primary">
            라이드 시작
          </Button>
        </Link>
      }
    />
  );
};

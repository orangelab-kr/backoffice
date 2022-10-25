import { Button, Drawer } from 'antd';
import React, { useState } from 'react';

import { BackofficeTable } from '../components';
import { RecordStatus } from '../components/Record/RecordStatus';
import { RideInfo } from '../components/Ride/RideInfo';
import { UserInfoProvider } from '../components/User/UserInfoProvider';
import dayjs from 'dayjs';
import { getClient } from '../tools';

export const Records = () => {
  const [selectedRideId, setSelectedRideId] = useState();
  const onClickName = (record) => () =>
    setSelectedRideId(record.properties?.coreservice?.rideId);
  console.log(selectedRideId);
  const columns = [
    {
      title: '상태',
      dataIndex: 'recordId',
      render: (recordId, record) => <RecordStatus record={record} />,
    },
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, record) => (
        <Button type="text" onClick={onClickName(record)}>
          {name}
        </Button>
      ),
    },
    {
      title: '결제금액(초기 금액)',
      dataIndex: 'amount',
      render: (amount, record) =>
        `${amount.toLocaleString()}원${
          record.initialAmount !== amount
            ? `(${record.initialAmount.toLocaleString()}원)`
            : ''
        }`,
    },
    {
      title: '사용자',
      dataIndex: 'userId',
      render: (userId) => <UserInfoProvider userId={userId} />,
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '요청일자',
      dataIndex: 'retiredAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '성공일자',
      dataIndex: 'processedAt',
      render: (processedAt) =>
        processedAt ? dayjs(processedAt).format('D일 H시 m분') : '결제 실패',
    },
    {
      title: 'UUID',
      dataIndex: 'recordId',
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-payments').then((c) => c.get('/records', opts));

  return (
    <>
      <BackofficeTable
        title="결제내역 목록"
        hasSearch={true}
        columns={columns}
        onRequest={onRequest}
        scroll={{ x: 1200 }}
        dataSourceKey="records"
        rowKey="recordId"
      />
      <Drawer
        closable
        title="라이드 상세조회"
        placement="right"
        onClose={() => setSelectedRideId()}
        visible={selectedRideId}
        width={'80%'}
      >
        <RideInfo rideId={selectedRideId} />
      </Drawer>
    </>
  );
};

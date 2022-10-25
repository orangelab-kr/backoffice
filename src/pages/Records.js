import { BackofficeTable } from '../components';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import { RecordStatus } from '../components/Record/RecordStatus';
import { UserAddOutlined } from '@ant-design/icons';
import { UserInfoProvider } from '../components/User/UserInfoProvider';
import dayjs from 'dayjs';
import { getClient } from '../tools';

export const Records = () => {
  const columns = [
    {
      title: '상태',
      dataIndex: 'name',
      render: (name, record) => <RecordStatus record={record} />,
    },
    {
      title: '이름',
      dataIndex: 'name',
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
    <BackofficeTable
      title="결제내역 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1200 }}
      dataSourceKey="records"
      rowKey="recordId"
      buttons={
        <Link to="/records/add">
          <Button icon={<UserAddOutlined />} type="primary">
            라이드 시작
          </Button>
        </Link>
      }
    />
  );
};

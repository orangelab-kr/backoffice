import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Kickboards = () => {
  const columns = [
    {
      title: '킥보드 코드',
      dataIndex: 'kickboardCode',
      render: (value) => <Link to={`/kickboards/${value}`}>{value}</Link>,
    },
    {
      title: 'IMEI',
      dataIndex: 'kickboardId',
      key: 'kickboardId',
    },
    {
      title: '연결 상태',
      dataIndex: 'disconnectedAt',
      render: (disconnectedAt) =>
        disconnectedAt
          ? dayjs(disconnectedAt).format('YYYY년 MM월 DD일 H시 m분 끊김')
          : '연결됨',
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-kickboard').then((c) => c.get('/kickboards', opts));

  return (
    <BackofficeTable
      title="킥보드 목록"
      rowKey='kickboardCode'
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="kickboards"
      buttons={
        <Link to="/kickboards/add">
          <Button icon={<PlusOutlined />} type="primary">
            킥보드 추가
          </Button>
        </Link>
      }
    />
  );
};

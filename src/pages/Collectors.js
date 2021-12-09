import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Collectors = () => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'userId',
      render: (userId) => <Link to={`/collectors/${userId}`}>{userId}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '전화번호',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-collector').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title="수거팀 목록"
      hasSearch={true}
      columns={columns}
      dataSourceKey="users"
      scroll={{ x: 1000 }}
      onRequest={onRequest}
      buttons={
        <Link to="/collectors/add">
          <Button icon={<PlusOutlined />} type="primary">
            수거팀 추가
          </Button>
        </Link>
      }
    />
  );
};

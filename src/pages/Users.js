import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Users = withRouter(({ history }) => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'userId',
      render: (value) => <Link to={`/users/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '전화번호',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    },
    {
      title: '생년월일',
      dataIndex: 'birthday',
      render: (birthday) => dayjs(birthday).format('YYYY년 MM월 DD일'),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title="사용자 목록"
      hasSearch={true}
      columns={columns}
      scroll={{ x: 1100 }}
      dataSourceKey="users"
      onRequest={onRequest}
    />
  );
});

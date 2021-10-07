import { UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Admins = () => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'userId',
      render: (value) => <Link to={`/admins/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '권한 그룹',
      dataIndex: 'permissionGroup',
      render: (permissionGroup) => (
        <Link to={`/permissionGroups/${permissionGroup.permissionGroupId}`}>
          {permissionGroup.name}
        </Link>
      ),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const onRequest = (opts) =>
    getClient('backoffice').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title="관리자 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="users"
      buttons={
        <Link to="/admins/add">
          <Button icon={<UserAddOutlined />} type="primary">
            관리자 추가
          </Button>
        </Link>
      }
    />
  );
};

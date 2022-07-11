import { UserAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Admins = () => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'username',
      render: (username, user) => (
        <Link to={`/admins/${user.userId}`}>{username}</Link>
      ),
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
    {
      title: 'UUID',
      dataIndex: 'userId',
    },
  ];

  const onRequest = (opts) =>
    getClient('backoffice').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title='관리자 목록'
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey='users'
      rowKey='userId'
      buttons={
        <Link to='/admins/add'>
          <Button icon={<UserAddOutlined />} type='primary'>
            관리자 추가
          </Button>
        </Link>
      }
    />
  );
};

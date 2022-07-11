import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Users = () => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'realname',
      render: (realname, { userId, profileUrl }) => (
        <Link to={`/users/${userId}`}>
          <Avatar
            size='small'
            src={profileUrl}
            icon={<UserOutlined />}
            style={{ marginRight: 5 }}
          />
          {realname}
        </Link>
      ),
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
    {
      title: 'UUID',
      dataIndex: 'userId',
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title='사용자 목록'
      hasSearch={true}
      columns={columns}
      scroll={{ x: 1100 }}
      rowKey='userId'
      dataSourceKey='users'
      onRequest={onRequest}
    />
  );
};

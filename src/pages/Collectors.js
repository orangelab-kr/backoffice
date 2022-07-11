import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Collectors = () => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'username',
      render: (username, user) => (
        <Link to={`/collectors/${user.userId}`}>{username}</Link>
      ),
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
    {
      title: 'UUID',
      dataIndex: 'userId',
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-collector').then((c) => c.get('/users', opts));

  return (
    <BackofficeTable
      title='수거팀 목록'
      hasSearch={true}
      columns={columns}
      dataSourceKey='users'
      scroll={{ x: 1000 }}
      onRequest={onRequest}
      rowKey='userId'
      buttons={
        <Link to='/collectors/add'>
          <Button icon={<PlusOutlined />} type='primary'>
            수거팀 추가
          </Button>
        </Link>
      }
    />
  );
};

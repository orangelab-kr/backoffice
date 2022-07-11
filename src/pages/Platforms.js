import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Platforms = () => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, platform) => (
        <Link to={`/platforms/${platform.platformId}`}>{name}</Link>
      ),
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
    {
      title: 'UUID',
      dataIndex: 'platformId',
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-platform').then((c) => c.get('/platforms', opts));

  return (
    <BackofficeTable
      title='플랫폼 목록'
      hasSearch={true}
      columns={columns}
      dataSourceKey='platforms'
      scroll={{ x: 1000 }}
      onRequest={onRequest}
      rowKey='platformId'
      buttons={
        <Link to='/platforms/add'>
          <Button icon={<PlusOutlined />} type='primary'>
            플랫폼 추가
          </Button>
        </Link>
      }
    />
  );
};

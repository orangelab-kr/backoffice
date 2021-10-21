import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Platforms = () => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'platformId',
      render: (platformId) => (
        <Link to={`/platforms/${platformId}`}>{platformId}</Link>
      ),
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-platform').then((c) => c.get('/platforms', opts));

  return (
    <BackofficeTable
      title="플랫폼 목록"
      hasSearch={true}
      columns={columns}
      dataSourceKey="platforms"
      scroll={{ x: 1000 }}
      onRequest={onRequest}
      buttons={
        <Link to="/platforms/add">
          <Button icon={<PlusOutlined />} type="primary">
            플랫폼 추가
          </Button>
        </Link>
      }
    />
  );
};

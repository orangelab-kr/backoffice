import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
  ];

  const onRequest = (opts) =>
    getClient('openapi-kickboard').then((c) => c.get('/kickboards', opts));

  return (
    <BackofficeTable
      title="킥보드 목록"
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

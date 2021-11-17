import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import clipboard from 'copy-to-clipboard';
import dayjs from 'dayjs';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Services = withRouter(({ history }) => {
  const copyAccessKey = (serviceId) => async () => {
    const key = `service-generate-${Date.now()}`;
    message.loading({ content: '액세스토큰 정보 발급 중...', key });
    const accessToken = await getClient('backoffice')
      .then((c) => c.get(`/services/${serviceId}/generate`))
      .then((res) => res.data.accessToken);

    message.success({
      content: '액세스토큰이 클립보드에 저장되었습니다.',
      key,
    });

    clipboard(accessToken);
  };

  const columns = [
    {
      title: '서비스 ID',
      dataIndex: 'serviceId',
      render: (serviceId) => (
        <Link to={`/services/${serviceId}`}>{serviceId}</Link>
      ),
    },
    {
      title: '엔드포인트',
      dataIndex: 'endpoint',
      render: (endpoint) => (
        <a href={endpoint} target="_blank" rel="noopener noreferrer">
          {endpoint}
        </a>
      ),
    },
    {
      title: '액세스토큰 복사',
      dataIndex: 'serviceId',
      render: (serviceId) => (
        <Button
          size="small"
          icon={<CopyOutlined />}
          onClick={copyAccessKey(serviceId)}
        >
          복사
        </Button>
      ),
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 H시 m분'),
    },
    {
      title: '수정일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) =>
        dayjs(updatedAt).format('YYYY년 MM월 DD일 H시 m분'),
    },
  ];

  const onRequest = (opts) =>
    getClient('backoffice').then((c) => c.get('/services', opts));

  return (
    <BackofficeTable
      title="서비스 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      dataSourceKey="services"
      scroll={{ x: 1100 }}
    />
  );
});

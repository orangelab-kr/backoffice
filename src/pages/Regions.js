import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable, PricingInfoProvider } from '../components';
import { getClient } from '../tools';

export const Regions = () => {
  const [refresh, setRefresh] = useState(true);
  const setEnabled = (region, enabled) => async () => {
    const { regionId } = region;
    await getClient('openapi-location').then((c) =>
      c.post(`/regions/${regionId}`, { enabled })
    );

    setRefresh(true);
  };

  const columns = [
    {
      title: '활성화',
      dataIndex: 'enabled',
      render: (enabled, region) => (
        <Checkbox
          checked={enabled}
          onChange={setEnabled(region, !enabled)}
          style={{ marginLeft: 8 }}
        />
      ),
    },
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, { regionId }) => (
        <Link to={`/regions/${regionId}`}>{name}</Link>
      ),
    },
    {
      title: '가격정책',
      dataIndex: 'pricingId',
      render: (pricingId) => <PricingInfoProvider pricingId={pricingId} />,
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '수정일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) => dayjs(updatedAt).format('YYYY년 M월 D일 H시 m분'),
    },
  ];

  const onRequest = (opts) =>
    getClient('openapi-location').then((c) => c.get('/regions', opts));

  return (
    <BackofficeTable
      title="지역 목록"
      rowKey="regionId"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      refresh={refresh}
      setRefresh={setRefresh}
      dataSourceKey="regions"
      buttons={
        <Link to="/regions/add">
          <Button icon={<PlusOutlined />} type="primary">
            지역 추가
          </Button>
        </Link>
      }
    />
  );
};

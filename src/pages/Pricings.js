import { FileAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const Pricings = () => {
  const NumberView = (unit) => (value) =>
    value ? `${value.toLocaleString()}${unit}` : '없음';

  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, { pricingId }) => (
        <Link to={`/pricings/${pricingId}`}>{name}</Link>
      ),
    },
    {
      title: '기본 제공시간',
      dataIndex: 'standardTime',
      render: NumberView('분'),
    },
    {
      title: '기본 이용료',
      dataIndex: 'standardPrice',
      render: NumberView('원'),
    },
    {
      title: '기본 분당요금',
      dataIndex: 'perMinuteStandardPrice',
      render: NumberView('원/분'),
    },
    {
      title: '야간 이용료',
      dataIndex: 'nightlyPrice',
      render: NumberView('원'),
    },
    {
      title: '야간 분당요금',
      dataIndex: 'perMinuteNightlyPrice',
      render: NumberView('원/분'),
    },
    {
      title: '추가 요금',
      dataIndex: 'surchargePrice',
      render: NumberView('원'),
    },
    {
      title: '최대 금액',
      dataIndex: 'maxPrice',
      render: NumberView('원'),
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
    getClient('openapi-location').then((c) => c.get('/pricings', opts));

  return (
    <BackofficeTable
      title="가격정책 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1000 }}
      dataSourceKey="pricings"
      buttons={
        <Link to="/pricings/add">
          <Button icon={<FileAddOutlined />} type="primary">
            가격정책 추가
          </Button>
        </Link>
      }
    />
  );
};

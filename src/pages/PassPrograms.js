import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const PassPrograms = withRouter(({ history }) => {
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'passProgramId',
      render: (value) => <Link to={`/passPrograms/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '판매 여부',
      dataIndex: 'isSale',
      render: (value) => (value ? '허용' : '금지'),
    },
    {
      title: '연장 가능',
      dataIndex: 'allowRenew',
      render: (value) => (value ? '허용' : '금지'),
    },
    {
      title: '가격',
      dataIndex: 'price',
      render: (value) => (value ? `${value.toLocaleString()}원` : '없음'),
    },
    {
      title: '만료',
      dataIndex: 'validity',
      render: (value) => (value ? `${value}초` : '만료 없음'),
    },
    {
      title: '쿠폰 그룹',
      dataIndex: 'couponGroupId',
      render: (value) => <Link to={`/couponGroups/${value}`}>{value}</Link>,
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
    {
      title: '수정 일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) => dayjs(updatedAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-accounts').then((c) => c.get('/passPrograms', opts));

  return (
    <BackofficeTable
      title="패스프로그램 목록"
      hasSearch={true}
      columns={columns}
      onRequest={onRequest}
      scroll={{ x: 1500 }}
      dataSourceKey="passPrograms"
      buttons={
        <Link to="/passPrograms/add">
          <Button icon={<PlusOutlined />} type="primary">
            패스 프로그램 추가
          </Button>
        </Link>
      }
    />
  );
});

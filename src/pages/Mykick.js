import { Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { BackofficeTable, KickboardInfoProvider } from '../components';
import { getClient } from '../tools';
import { MykickStatus } from '../tools/mykickStatus';

export const Mykick = () => {
  const columns = [
    {
      title: '상태',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={MykickStatus[status].color}>
          {MykickStatus[status].text}
        </Tag>
      ),
    },
    {
      title: '킥보드 이름',
      dataIndex: 'rentId',
      render: (rentId, { name }) => (
        <Link to={`/mykick/${rentId}`}>{name}</Link>
      ),
    },
    {
      title: '이름',
      dataIndex: 'user',
      render: (user) => `${user.name}(${user.phoneNo})`,
    },
    {
      title: '킥보드 코드',
      dataIndex: 'kickboardCode',
      render: (kickboardCode) =>
        kickboardCode ? (
          <KickboardInfoProvider
            kickboardCode={kickboardCode}
            showKickboardId
          />
        ) : (
          '미배정'
        ),
    },
    {
      title: '제공자',
      dataIndex: 'provider',
      render: (provider) =>
        provider ? <Tag color='blue'>{provider.name}</Tag> : '없음',
    },
    {
      title: '만료일자',
      dataIndex: 'expiredAt',
      render: (expiredAt) =>
        expiredAt ? dayjs(expiredAt).format('YYYY년 MM월 DD일') : '없음',
    },
    {
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
  ];

  const onRequest = (opts) =>
    getClient('mykick').then((c) => c.get('/rents', opts));

  return (
    <BackofficeTable
      rowKey='rentId'
      title='마이킥 목록'
      hasSearch={true}
      columns={columns}
      dataSourceKey='rents'
      scroll={{ x: 1000 }}
      onRequest={onRequest}
    />
  );
};

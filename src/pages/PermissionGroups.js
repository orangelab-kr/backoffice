import { ApiOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const PermissionGroups = () => {
  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, permissionGroup) => (
        <Link to={`/permissionGroups/${permissionGroup.permissionGroupId}`}>
          {name}
        </Link>
      ),

      key: 'name',
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '권한',
      dataIndex: 'permissions',
      render: (permissions) => (
        <>
          {permissions.map((permission, i) => {
            if (i > 3) return <></>;
            if (i === 3) {
              return <Tag color='red'>이외 {permissions.length - i}개</Tag>;
            }

            return <Tag>{permission.name}</Tag>;
          })}
        </>
      ),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
    {
      title: 'UUID',
      dataIndex: 'permissionGroupId',
    },
  ];

  const onRequest = (opts) =>
    getClient('backoffice').then((c) => c.get('/permissionGroups', opts));

  return (
    <BackofficeTable
      title='권한 그룹 목록'
      hasSearch={true}
      columns={columns}
      scroll={{ x: 1300 }}
      onRequest={onRequest}
      dataSourceKey='permissionGroups'
      rowKey='permissionGroupId'
      buttons={
        <Link to='/permissionGroups/add'>
          <Button icon={<ApiOutlined />} type='primary'>
            권한그룹 추가
          </Button>
        </Link>
      }
    />
  );
};

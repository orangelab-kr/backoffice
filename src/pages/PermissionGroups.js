import { ApiOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const PermissionGroups = withRouter(({ history }) => {
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'permissionGroupId',
      render: (value) => <Link to={`/permissionGroups/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'name',
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
              return <Tag color="red">이외 {permissions.length - i}개</Tag>;
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
  ];

  const requestPermissionGroups = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('backoffice')
      .then((c) => c.get('/permissionGroups', { params }))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const { permissionGroups, total } = data;
        setPermissionGroups(permissionGroups);
        setTotal(total - take);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestPermissionGroups();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestPermissionGroups();
  };

  useEffect(requestPermissionGroups, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between" gutter={[4, 4]}>
          <Col>
            <Title level={3}>권한 그룹 목록</Title>
          </Col>
          <Col>
            <Row>
              <Col>
                <Search
                  placeholder="검색"
                  onSearch={onSearch}
                  loading={isLoading}
                  enterButton
                />
              </Col>
              <Col>
                <Link to="/permissionGroups/add">
                  <Button
                    icon={<ApiOutlined />}
                    type="primary"
                    disabled={isLoading}
                  >
                    권한그룹 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={permissionGroups}
          rowKey="permissionGroupId"
          loading={isLoading}
          scroll={{ x: '100%' }}
          pagination={{
            onChange: onPagnationChange,
            onShowSizeChange: setTake,
            total,
          }}
        />
      </Card>
    </>
  );
});

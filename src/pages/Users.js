import { UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Users = withRouter(({ history }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'userId',
      render: (value) => <Link to={`/users/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '권한 그룹',
      dataIndex: 'permissionGroup',
      render: (permissionGroup) => (
        <Link to={`/permissionGroups/${permissionGroup.permissionGroupId}`}>
          {permissionGroup.name}
        </Link>
      ),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const requestUsers = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('backoffice')
      .then((c) => c.get('/users', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { users, total } = res.data;
        setUsers(users);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestUsers();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestUsers();
  };

  useEffect(requestUsers, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>관리자 목록</Title>
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
                <Link to="/users/add">
                  <Button icon={<UserAddOutlined />} type="primary">
                    관리자 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="userId"
          loading={isLoading}
          scroll={{ x: '100%' }}
          pagination={{
            onChange: onPagnationChange,
            onShowSizeChange: true,
            total,
          }}
        />
      </Card>
    </>
  );
});

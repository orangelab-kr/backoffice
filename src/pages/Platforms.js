import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Platforms = withRouter(({ history }) => {
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
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

  const requestPlatforms = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('openapi-platform')
      .then((c) => c.get('/platforms', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { platforms, total } = res.data;
        setPlatforms(platforms);
        setTotal(total - take);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestPlatforms();
  };

  const onSearch = (search) => {
    setSkip(0);
    setSearch(search);
    requestPlatforms();
  };

  useEffect(requestPlatforms, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>플랫폼 목록</Title>
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
                <Link to="/platforms/add">
                  <Button icon={<PlusOutlined />} type="primary">
                    플랫폼 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={platforms}
          rowKey="platformId"
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

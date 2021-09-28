import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Kickboards = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
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

  const requestKickboards = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('openapi-kickboard')
      .then((c) => c.get('/kickboards', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { kickboards, total } = res.data;
        setDataSource(kickboards);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestKickboards();
  };

  const onSearch = (search) => {
    setSkip(0);
    setSearch(search);
    requestKickboards();
  };

  useEffect(requestKickboards, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>킥보드 목록</Title>
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
                <Link to="/kickboards/add">
                  <Button icon={<PlusOutlined />} type="primary">
                    킥보드 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="kickboardCode"
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

import { ApiOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { ServicesCreate } from '../components';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Services = withRouter(({ history }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const [createService, setCreateService] = useState(false);

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
      title: '등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 H시 m분 s초'),
    },
    {
      title: '수정일자',
      dataIndex: 'updatedAt',
      render: (updatedAt) =>
        dayjs(updatedAt).format('YYYY년 MM월 DD일 H시 m분 s초'),
    },
  ];

  const requestServices = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('backoffice')
      .then((c) => c.get('/services', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { services, total } = res.data;
        setServices(services);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestServices();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestServices();
  };

  useEffect(requestServices, [search, skip, take]);
  return (
    <>
      {createService && (
        <ServicesCreate onCancel={() => setCreateService(false)} />
      )}

      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>서비스 목록</Title>
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
                <Button
                  icon={<ApiOutlined />}
                  type="primary"
                  onClick={() => setCreateService(true)}
                >
                  서비스 생성
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={services}
          rowKey="serviceId"
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

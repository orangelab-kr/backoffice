import { PlusOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Table, Typography, Tag, Button } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Helmets = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: '헬멧 맥주소',
      dataIndex: 'macAddress',
      render: (helmetMacAddress, helmet) => (
        <Link to={`/helmets/${helmet._id}`}>
          <Tag>{helmetMacAddress.toUpperCase().match(/.{2}/g).join(':')}</Tag>
        </Link>
      ),
    },
    {
      title: '배터리',
      dataIndex: 'battery',
      render: (battery) => (
        <Tag color={battery >= 70 ? 'green' : battery >= 30 ? 'yellow' : 'red'}>
          {battery}%
        </Tag>
      ),
    },
    {
      title: '제품',
      dataIndex: 'version',
      render: (version) =>
        version === 0 ? (
          <Tag color="blue">Solebe Y905</Tag>
        ) : version === 1 ? (
          <Tag color="green">HIKICK HELMET</Tag>
        ) : (
          <Tag color="red">알 수 없음</Tag>
        ),
    },
    {
      title: '최초 등록일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
  ];

  const requestHelmets = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('openapi-kickboard')
      .then((c) => c.get('/helmets', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { helmets, total } = res.data;
        setDataSource(helmets);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestHelmets();
  };

  const onSearch = (search) => {
    setSkip(0);
    setSearch(search);
    requestHelmets();
  };

  useEffect(requestHelmets, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>헬멧 목록</Title>
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
                <Link to="/helmets/add">
                  <Button icon={<PlusOutlined />} type="primary">
                    헬멧 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="macAddress"
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

import { Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const CouponGroups = withRouter(({ history }) => {
  const [couponGroups, setCouponGroups] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'couponGroupId',
      render: (value) => <Link to={`/couponGroups/${value}`}>{value}</Link>,
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '쿠폰 코드',
      dataIndex: 'code',
      render: (value) => value || '없음',
    },
    {
      title: '타입',
      dataIndex: 'type',
      render: (value) => (value ? '일회성' : '다회성'),
    },
    {
      title: '사용자당 최대 개수',
      dataIndex: 'limit',
      render: (value) => (value ? `${value}개` : '제한 없음'),
    },
    {
      title: '만료',
      dataIndex: 'validity',
      render: (value) => (value ? `${value / 1000}초` : '만료 없음'),
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

  const requestCouponGroups = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('coreservice-payments')
      .then((c) => c.get('/couponGroups', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { couponGroups, total } = res.data;
        setCouponGroups(couponGroups);
        setTotal(total - take);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestCouponGroups();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestCouponGroups();
  };

  useEffect(requestCouponGroups, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>쿠폰 그룹 목록</Title>
          </Col>
          <Col>
            <Row gutter={[4, 4]} justify="center">
              <Col>
                <Search
                  placeholder="검색"
                  onSearch={onSearch}
                  loading={isLoading}
                  enterButton
                />
              </Col>
              {/* <Col flex="auto">
                <Link to="/users/add">
                  <Button
                    icon={<UserAddOutlined />}
                    type="primary"
                    style={{ width: '100%' }}
                  >
                    사용자 추가
                  </Button>
                </Link>
              </Col> */}
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={couponGroups}
          rowKey="couponGroupId"
          loading={isLoading}
          scroll={{ x: 1000 }}
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

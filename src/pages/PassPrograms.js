import { Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const PassPrograms = withRouter(({ history }) => {
  const [passPrograms, setPassPrograms] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
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
      render: (value) => (value ? `${value / 1000}초` : '만료 없음'),
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

  const requestPassPrograms = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    getClient('coreservice-accounts')
      .then((c) => c.get('/passPrograms', { params }))
      .finally(() => setLoading(false))
      .then((res) => {
        const { passPrograms, total } = res.data;
        setPassPrograms(passPrograms);
        setTotal(total - take);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestPassPrograms();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestPassPrograms();
  };

  useEffect(requestPassPrograms, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>패스 프로그램 목록</Title>
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
          dataSource={passPrograms}
          rowKey="passProgramId"
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

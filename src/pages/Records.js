import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import React, { useState } from 'react';
import {
  BooleanParam,
  DateTimeParam,
  StringParam,
  useQueryParams,
} from 'use-query-params';

import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import _ from 'lodash';
import moment from 'moment';
import { BackofficeTable } from '../components';
import { RecordStatus } from '../components/Record/RecordStatus';
import { RideInfo } from '../components/Ride/RideInfo';
import { UserInfoProvider } from '../components/User/UserInfoProvider';
import { UserSelect } from '../components/User/UserSelect';
import { getClient } from '../tools';

export const Records = () => {
  const searchForm = Form.useForm()[0];
  const [selectedRideId, setSelectedRideId] = useState();
  const [query, setQuery] = useQueryParams({
    userId: StringParam, //
    startedAt: DateTimeParam, //
    endedAt: DateTimeParam, //
    search: StringParam, //
    onlyUnpaid: BooleanParam,
    onlyPaid: BooleanParam,
  });

  const rangeAutocomplete = {
    '최근 3시간': [moment().subtract(3, 'hours'), moment()],
    오늘: [moment().startOf('day'), moment().endOf('day')],
    '이번 주': [moment().startOf('week'), moment().endOf('week')],
    '이번 달': [moment().startOf('month'), moment().endOf('month')],
    '저번 달': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };

  const onSearch = (form) => {
    const { range, userId, search, status } = form;
    const startedAt = range && range[0].toDate();
    const endedAt = range && range[1].toDate();
    const onlyPaid = status === true;
    const onlyUnpaid = status === false;
    setQuery({
      startedAt,
      endedAt,
      userId,
      search,
      onlyPaid,
      onlyUnpaid,
    });
  };

  const onClickName = (record) => () =>
    setSelectedRideId(record.properties?.coreservice?.rideId);
  const columns = [
    {
      title: '상태',
      dataIndex: 'recordId',
      render: (recordId, record) => <RecordStatus record={record} />,
    },
    {
      title: '이름',
      dataIndex: 'name',
      render: (name, record) => (
        <Button type="text" onClick={onClickName(record)}>
          {name}
        </Button>
      ),
    },
    {
      title: '결제금액(초기 금액)',
      dataIndex: 'amount',
      render: (amount, record) =>
        `${amount.toLocaleString()}원${
          record.initialAmount !== amount
            ? `(${record.initialAmount.toLocaleString()}원)`
            : ''
        }`,
    },
    {
      title: '사용자',
      dataIndex: 'userId',
      render: (userId) => <UserInfoProvider userId={userId} />,
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '요청일자',
      dataIndex: 'retiredAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '성공일자',
      dataIndex: 'processedAt',
      render: (processedAt) =>
        processedAt ? dayjs(processedAt).format('D일 H시 m분') : '결제 실패',
    },
    {
      title: 'UUID',
      dataIndex: 'recordId',
    },
  ];

  const onRequest = (opts) =>
    getClient('coreservice-payments').then((c) =>
      c.get('/records', { ...opts, params: _.merge(query, opts.params) }),
    );

  return (
    <>
      <Card style={{ marginBottom: 10 }}>
        <Form onFinish={onSearch} form={searchForm}>
          <Row gutter={[10, 4]} justify="space-between">
            <Col span={24} lg={11}>
              <Form.Item name="range" label="기간">
                <DatePicker.RangePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY년 MM월 DD일 H시 m분"
                  ranges={rangeAutocomplete}
                />
              </Form.Item>
            </Col>
            <Col span={24} lg={13}>
              <Form.Item name="userId" label="사용자 ID">
                <UserSelect />
              </Form.Item>
            </Col>
            <Col span={24} lg={14} xl={10}>
              <Form.Item name="search" label="검색">
                <Input placeholder="검색어를 입력하세요." />
              </Form.Item>
            </Col>
            <Col span={24} lg={10}>
              <Form.Item name="status" label="상태">
                <Select placeholder="상태를 선택하세요.">
                  <Select.Option value={null}>모든 상태</Select.Option>
                  <Select.Option value={true}>결제성공 내역만</Select.Option>
                  <Select.Option value={false}>미수금 내역만</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} xl={2}>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
                block
              >
                검색
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <BackofficeTable
        title="결제내역 목록"
        hasSearch={true}
        columns={columns}
        onRequest={onRequest}
        scroll={{ x: 1200 }}
        dataSourceKey="records"
        rowKey="recordId"
      />
      <Drawer
        closable
        title="라이드 상세조회"
        placement="right"
        onClose={() => setSelectedRideId()}
        visible={selectedRideId}
        width={'80%'}
      >
        {selectedRideId && <RideInfo rideId={selectedRideId} />}
      </Drawer>
    </>
  );
};

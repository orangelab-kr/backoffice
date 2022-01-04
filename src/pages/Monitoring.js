import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Skeleton,
  Switch,
  Typography,
} from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrayParam,
  DateTimeParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { MonitoringItem, RegionSelect } from '../components';
import { getClient, MonitoringStatus } from '../tools';

export const Monitoring = () => {
  const searchForm = Form.useForm()[0];
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [rides, setRides] = useState([]);
  const [query, setQuery] = useQueryParams({
    take: withDefault(NumberParam, 10),
    skip: withDefault(NumberParam, 0),
    monitoringStatus: ArrayParam,
    startedAt: DateTimeParam,
    endedAt: DateTimeParam,
    regionId: ArrayParam,
    search: StringParam,
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

  const getRides = useCallback(async () => {
    setLoading(true);
    const params = {
      onlyTerminated: true,
      ...query,
    };

    const { data } = await getClient('openapi-ride')
      .then((c) => c.get('/rides', { params }))
      .finally(() => setLoading(false));

    setRides(data.rides);
    setTotal(data.total);
  }, [query]);

  const onSearch = (form) => {
    const { monitoringStatus, range, regionId, search } = form;
    const startedAt = range && range[0].toDate();
    const endedAt = range && range[1].toDate();
    setQuery({ monitoringStatus, startedAt, endedAt, regionId, search });
  };

  useEffect(getRides, [getRides]);
  useEffect(() => searchForm.setFieldsValue(query));
  return (
    <Card>
      <Typography.Title level={3}>모니터링 시스템</Typography.Title>
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
              <Form.Item name="regionId" label="지역">
                <RegionSelect
                  mode="multiple"
                  placeholder="미선택시 모든 지역"
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="onlyPhoto" label="반납사진만">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item name="monitoringStatus" label="구분">
                <Select mode="multiple" placeholder="미선택시 모든 킥보드">
                  {MonitoringStatus.map(({ type, name, icon }) => (
                    <Select.Option value={type} key={type}>
                      {icon} {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} lg={14} xl={12}>
              <Form.Item name="search" label="검색">
                <Input placeholder="이름, 전화번호, 킥보드 코드" />
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

      {!loading
        ? rides.map((ride) => <MonitoringItem ride={ride} key={ride.rideId} />)
        : [...Array(3)].map(() => (
            <Card style={{ margin: '10px 0' }}>
              <Skeleton />
            </Card>
          ))}

      <Row justify="end">
        <Col>
          <Pagination
            total={total}
            showSizeChanger
            pageSize={query.take}
            current={query.skip / query.take + 1}
            onShowSizeChanger={(take) => setQuery((q) => ({ ...q, take }))}
            onChange={(page, take) => {
              const skip = (page - 1) * take;
              setQuery((q) => ({ ...q, take, skip }));
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

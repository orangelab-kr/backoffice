import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Typography,
} from 'antd';
import moment from 'moment';
import { MonitoringItem, RegionSelect } from '../components';
import { MonitoringStatus } from '../tools';

export const Monitoring = () => {
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

  return (
    <Card>
      <Typography.Title level={3}>모니터링 시스템</Typography.Title>
      <Card style={{ marginBottom: 10 }}>
        <Form>
          <Row gutter={[20, 4]} justify="space-between">
            <Col span={11}>
              <Form.Item name="range" label="기간">
                <DatePicker.RangePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY년 MM월 DD일 H시 m분"
                  ranges={rangeAutocomplete}
                />
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item name="regionIds" label="지역">
                <RegionSelect
                  mode="multiple"
                  placeholder="미선택시 모든 지역"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="구분">
                <Select mode="multiple" placeholder="미선택시 모든 킥보드">
                  {MonitoringStatus.map(({ type, name, icon }) => (
                    <Select.Option value={type} key={type}>
                      {icon} {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="search" label="검색">
                <Input.Search
                  placeholder="이름, 전화번호, 킥보드 코드"
                  enterButton
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <MonitoringItem />
      <Row justify="end">
        <Col>
          <Pagination />
        </Col>
      </Row>
    </Card>
  );
};

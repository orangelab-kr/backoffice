import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { BackofficeList } from '..';
import { getClient } from '../../tools';

export const UserCoupon = ({ user }) => {
  const { userId } = user;
  const onRequest = (opts) =>
    getClient('coreservice-payments').then((c) =>
      c.get(`/users/${userId}/coupons`, opts)
    );

  const deleteCoupon = (couponId) =>
    getClient('coreservice-payments').then((c) =>
      c.delete(`/users/${userId}/coupons/${couponId}`)
    );

  return (
    <BackofficeList
      title="쿠폰"
      indexKey="couponId"
      hasSearch={true}
      onRequest={onRequest}
      dataSourceKey="coupons"
      defaultParams={{ showUsed: true }}
      buttons={
        <Dropdown
          overlay={
            <Menu>
              <Input />
              <Menu.Item key="0">
                <a href="https://www.antgroup.com">1st menu item</a>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="1">
                <a href="https://www.aliyun.com">2nd menu item</a>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3">3rd menu item</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<PlusOutlined />} type="primary">
            쿠폰 발급
          </Button>
        </Dropdown>
      }
      renderItem={(coupon) => (
        <List.Item>
          <Row justify="space-between">
            <Col>
              <Typography.Title
                level={5}
                copyable={true}
                delete={coupon.expiredAt && dayjs(coupon.expiredAt).isBefore()}
              >
                {coupon.couponGroup.type} / {coupon.couponGroup.name}
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <b>등록 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(coupon.createdAt).format('YYYY년 M월 DD일 HH시 mm분')}
              </Typography.Text>
            </Col>
            {coupon.expiredAt && (
              <Col flex={1}>
                <b>만료 시점: </b>
                <Typography.Text copyable={true}>
                  {dayjs(coupon.expiredAt).format('YYYY년 M월 DD일 HH시 mm분')}
                </Typography.Text>
              </Col>
            )}
            {coupon.usedAt && (
              <Col flex={1}>
                <b>사용 시점: </b>
                <Typography.Text copyable={true}>
                  {dayjs(coupon.usedAt).format('YYYY년 M월 DD일 HH시 mm분')}
                </Typography.Text>
              </Col>
            )}
            <Col>
              <Popconfirm
                title="정말로 쿠폰을 삭제하시겠습니까?"
                onConfirm={() => deleteCoupon(coupon)}
                okText="삭제"
                cancelText="취소"
              >
                <Button size="small" icon={<StopOutlined />} danger>
                  삭제
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

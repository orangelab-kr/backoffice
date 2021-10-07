import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Typography
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import {
  UserCoupon,
  UserMethods,
  UserPasses,
  UserPhonePopup,
  UserSessions
} from '../components';
import { getClient } from '../tools';

const { Title } = Typography;

export const UsersDetails = withRouter(({ history }) => {
  const [user, setUser] = useState(null);
  const params = useParams();
  const userId = params.userId !== 'add' ? params.userId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);
  const [showPhoneChange, setShowPhoneChange] = useState(false);

  const loadAdmin = () => {
    if (!userId) return;
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const user = data.user;
        user.birthday = moment(user.birthday);

        setUser(user);
        form.setFieldsValue(user);
      });
  };

  const deleteAdmin = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.delete(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/users`);
      });
  };

  const onSave = (body) => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.post(`/users/${userId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${userId ? '수정' : '생성'}되었습니다.`);
        if (data.userId) history.push(`/users/${data.userId}`);
      });
  };

  useEffect(loadAdmin, [form, userId]);
  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        {showPhoneChange && (
          <UserPhonePopup
            user={user}
            onChange={form.setFieldsValue}
            onCancel={() => setShowPhoneChange(false)}
          />
        )}
        <Card>
          <Form layout="vertical" onFinish={onSave} form={form}>
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>
                <Title level={3}>
                  {user ? user.realname : '새로운 사용자'}
                </Title>
              </Col>
              <Col>
                <Row gutter={[4, 0]}>
                  {userId && (
                    <Col>
                      <Popconfirm
                        title="정말로 삭제하시겠습니까?"
                        okText="네"
                        cancelText="아니요"
                        onConfirm={deleteAdmin}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          loading={isLoading}
                          type="primary"
                          danger
                        />
                      </Popconfirm>
                    </Col>
                  )}
                  <Col>
                    <Button
                      icon={userId ? <SaveOutlined /> : <PlusOutlined />}
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      {userId ? '저장하기' : '생성하기'}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Form.Item name="realname" label="사용자 이름:">
              <Input disabled={isLoading} />
            </Form.Item>
            <Form.Item name="email" label="이메일:">
              <Input disabled={isLoading} />
            </Form.Item>
            <Form.Item name="birthday" label="생년월일:">
              <DatePicker
                disabled={isLoading}
                style={{ width: '100%' }}
                format="YYYY년 MM월 DD일"
              />
            </Form.Item>
            <Form.Item name="phoneNo" label="전화번호:">
              <Input
                disabled={isLoading}
                readOnly={true}
                onClick={() => setShowPhoneChange(true)}
              />
            </Form.Item>
            <Form.Item hidden={true} name="phone" />
          </Form>
        </Card>
      </Col>
      {user && (
        <Col xl={12} span={24}>
          <UserCoupon user={user} />
        </Col>
      )}
      {user && (
        <Col xl={12} span={24}>
          <UserSessions user={user} />
        </Col>
      )}
      {user && (
        <Col xl={12} span={24}>
          <UserMethods user={user} />
        </Col>
      )}
      {user && (
        <Col xl={12} span={24}>
          <UserPasses user={user} />
        </Col>
      )}
    </Row>
  );
});

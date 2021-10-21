import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { PermissionGroupsSelect } from '../components';
import { getClient } from '../tools';

const { Title } = Typography;

export const AdminsDetails = withRouter(({ history }) => {
  const [admin, setAdmin] = useState({ name: '로딩 중...' });
  const params = useParams();
  const userId = params.userId !== 'add' ? params.userId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadAdmin = () => {
    if (!userId) return;
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.get(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setAdmin(data.user);
        form.setFieldsValue(data.user);
      });
  };

  const deleteAdmin = () => {
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.delete(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/admins`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.post(`/users/${userId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${userId ? '수정' : '생성'}되었습니다.`);
        if (data.userId) {
          history.push(`/admins/${data.userId}`);
        }
      });
  };

  useEffect(loadAdmin, [form, isLoading, userId]);
  return (
    <>
      <Card>
        <Form layout="vertical" onFinish={onSave} form={form}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {userId ? admin.username : '새로운 관리자'}
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
          <Form.Item name="username" label="관리자 이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="email" label="이메일">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="phone" label="전화번호">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="password" label="비밀번호">
            <Input.Password disabled={isLoading} />
          </Form.Item>
          <Form.Item name="permissionGroupId" label="권한 그룹">
            <PermissionGroupsSelect
              isLoading={isLoading}
              defaultPermissionGroup={admin.permissionGroup}
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

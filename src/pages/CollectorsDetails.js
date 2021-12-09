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
import { FranchisesSelect } from '../components/FranchisesSelect';
import { getClient } from '../tools';

const { Title } = Typography;

export const CollectorsDetails = withRouter(({ history }) => {
  const [collector, setCollector] = useState({ username: '로딩 중...' });
  const params = useParams();
  const userId = params.userId !== 'add' ? params.userId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadCollector = () => {
    if (!userId) return;
    setLoading(true);
    getClient('openapi-collector')
      .then((c) => c.get(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const { user } = data;
        user.franchiseIds = user.franchises.map((f) => f.franchiseId);

        setCollector(user);
        form.setFieldsValue(user);
      });
  };

  const deleteCollector = () => {
    setLoading(true);
    getClient('openapi-collector')
      .then((c) => c.delete(`/users/${userId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/collectors`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('openapi-collector')
      .then((c) => c.post(`/users/${userId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${userId ? '수정' : '생성'}되었습니다.`);
        if (data.user.userId) {
          history.push(`/collectors/${data.user.userId}`);
        }
      });
  };

  useEffect(loadCollector, [form, userId]);
  return (
    <>
      <Card>
        <Form
          layout="vertical"
          onFinish={onSave}
          form={form}
          initialValues={{ franchiseIds: [] }}
        >
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {userId ? collector.username : '새로운 수거팀'}
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
                      onConfirm={deleteCollector}
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
          <Form.Item name="username" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="phoneNo" label="전화번호">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="franchiseIds" label="프렌차이즈">
            <FranchisesSelect isLoading={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

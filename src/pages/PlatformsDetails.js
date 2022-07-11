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
    Tabs,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import { BackofficeTable } from '../components';
import { getClient } from '../tools';

export const PlatformsDetails = withRouter(({ history }) => {
  const params = useParams();
  const platformForm = Form.useForm()[0];
  const platformId = params.platformId !== 'add' ? params.platformId : '';
  const [platform, setPlatform] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const loadPlatform = () => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.get(`/platforms/${platformId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setPlatform(data.platform);
        platformForm.setFieldsValue(data.platform);
      });
  };

  const savePlatform = (body) => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.post(`/platforms/${platformId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${platformId ? '수정' : '생성'}되었습니다.`);
        if (!platformId) history.push(`/platforms/${data.platformId}`);
      });
  };

  const deletePlatform = () => {
    setLoading(true);
    getClient('openapi-platform')
      .then((c) => c.delete(`/platforms/${platformId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/platforms`);
      });
  };

  const onPlatformUsersRequest = (opts) =>
    getClient('openapi-platform').then((c) =>
      c.get(`/platforms/${platformId}/users`, opts)
    );

  useEffect(() => {
    loadPlatform();
  }, [platformForm, platformId]);
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Card>
            <Form layout="vertical" onFinish={savePlatform} form={platformForm}>
              <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Col>
                  <Typography.Title level={3} copyable={platformId}>
                    {platform ? platform.name : '새로운 플랫폼'}
                  </Typography.Title>
                </Col>
                <Col>
                  <Row gutter={[4, 0]}>
                    {platform && (
                      <Col>
                        <Popconfirm
                          title="정말로 삭제하시겠습니까?"
                          okText="네"
                          cancelText="아니요"
                          onConfirm={deletePlatform}
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
                        icon={platformId ? <SaveOutlined /> : <PlusOutlined />}
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                      >
                        {platformId ? '저장' : '생성'}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Form.Item name="name" label="플랫폼 이름:">
                <Input />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        {platformId && (
          <Col span={24}>
            <Card>
              <Tabs defaultActiveKey="users">
                <Tabs.TabPane tab="사용자 목록" key="users">
                  <BackofficeTable
                    title="사용자 목록"
                    hasSearch={true}
                    scroll={{ x: 1000 }}
                    dataSourceKey="platformUsers"
                    onRequest={onPlatformUsersRequest}
                    columns={[
                      {
                        title: 'UUID',
                        dataIndex: 'platformUserId',
                        render: (value) => (
                          <Link to={`/platforms/${platformId}/users/${value}`}>
                            {value}
                          </Link>
                        ),
                      },
                      {
                        title: '이름',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: '이메일',
                        dataIndex: 'email',
                        key: 'email',
                      },
                      {
                        title: '전화번호',
                        dataIndex: 'phone',
                        key: 'phone',
                      },
                      {
                        title: '권한 그룹',
                        dataIndex: 'permissionGroup',
                        render: (permissionGroup) => (
                          <Link
                            to={`/permissionGroups/${permissionGroup.permissionGroupId}`}
                          >
                            {permissionGroup.name}
                          </Link>
                        ),
                      },
                      {
                        title: '생성 일자',
                        dataIndex: 'createdAt',
                        render: (createdAt) =>
                          dayjs(createdAt).format('YYYY년 MM월 DD일'),
                      },
                    ]}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
});

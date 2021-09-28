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
import clipboard from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { PermissionsSelect } from '../components';
import { getClient } from '../tools';

const { Title } = Typography;

export const PermissionGroupsDetails = withRouter(({ history }) => {
  const [permissionGroup, setPermissionGroup] = useState({
    name: '로딩 중...',
  });

  const params = useParams();
  const permissionGroupId =
    params.permissionGroupId !== 'add' ? params.permissionGroupId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const copyKey = (value) => {
    return () => {
      clipboard(value);
      message.success('복사되었습니다.');
    };
  };

  const loadPermissionGroup = () => {
    if (!permissionGroupId) return;
    setLoading(true);

    getClient('backoffice')
      .then((c) => c.get(`/permissionGroups/${permissionGroupId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        const { permissionGroup } = data;
        permissionGroup.permissions = permissionGroup.permissions.map(
          ({ permissionId, name }) => ({
            key: permissionId,
            label: name,
            value: permissionId,
          })
        );

        setPermissionGroup(permissionGroup);
        form.setFieldsValue(permissionGroup);
      });
  };

  const deletePermissionGroup = () => {
    setLoading(true);
    getClient('backoffice')
      .then((c) => c.delete(`/permissionGroups/${permissionGroupId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/permissionGroups`);
      });
  };

  const onSave = (body) => {
    setLoading(true);
    body.permissionIds = body.permissions.map(({ value }) => value);
    delete body.permissions;

    getClient('backoffice')
      .then((c) => c.post(`/permissionGroups/${permissionGroupId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${permissionGroupId ? '수정' : '생성'}되었습니다.`);

        if (data.permissionGroupId) {
          history.push(`/permissionGroups/${data.permissionGroupId}`);
        }
      });
  };

  useEffect(loadPermissionGroup, [form, permissionGroupId]);
  return (
    <>
      <Card>
        <Form layout="vertical" onFinish={onSave} form={form}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {permissionGroupId ? permissionGroup.name : '새로운 권한 그룹'}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {permissionGroupId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deletePermissionGroup}
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
                    icon={
                      permissionGroupId ? <SaveOutlined /> : <PlusOutlined />
                    }
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {permissionGroupId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {permissionGroupId && (
            <Form.Item name="permissionGroupId" label="권한 그룹 ID">
              <Input
                disabled={isLoading}
                onClick={copyKey(permissionGroupId)}
                readOnly
              />
            </Form.Item>
          )}
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="permissions" label="권한 목록">
            <PermissionsSelect isLoading={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

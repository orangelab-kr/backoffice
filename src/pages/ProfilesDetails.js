import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { ChromePicker, SketchPicker } from 'react-color';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;

export const ProfilesDetails = withRouter(({ history }) => {
  const [profile, setProfile] = useState();
  const params = useParams();
  const profileId = params.profileId !== 'add' ? params.profileId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadProfiles = () => {
    if (!profileId) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.get(`/profiles/${profileId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setProfile(data.profile);
        form.setFieldsValue(data.profile);
      });
  };

  const deleteProfiles = () => {
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.delete(`/profiles/${profileId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/profiles`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.post(`/profiles/${profileId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${profileId ? '수정' : '생성'}되었습니다.`);
        if (data.profile.profileId) {
          history.push(`/profiles/${data.profile.profileId}`);
        }
      });
  };

  const onChangeColorPicker = (props) => {
    const decimalToHex = (alpha) =>
      alpha === 0 ? '00' : Math.round(255 * alpha).toString(16);
    const color = `${props.hex}${decimalToHex(props.rgb.a)}`;
    form.setFieldsValue({ color });
  };

  useEffect(loadProfiles, [form, profileId]);
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
                {profile ? profile.name : '새로운 프로파일'}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {profileId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deleteProfiles}
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
                    icon={profileId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {profileId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="speed" label="최대 속도 ">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Spin spinning={isLoading} style={{ width: '20%' }}>
            <Form.Item name="color" label="지오펜스 색상" valuePropName="color">
              <ChromePicker onChange={onChangeColorPicker} />
            </Form.Item>
          </Spin>
          <Form.Item name="priority" label="우선순위">
            <InputNumber disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name="canReturn"
            label="반납 가능여부"
            valuePropName="checked"
          >
            <Checkbox disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name="hasSurcharge"
            label="추가료 발생여부"
            valuePropName="checked"
          >
            <Checkbox disabled={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

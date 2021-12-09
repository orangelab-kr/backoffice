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
  Switch,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { getClient } from '../tools';

const { Title } = Typography;

export const PassProgramsDetails = withRouter(({ history }) => {
  const [passProgram, setPassProgram] = useState();
  const params = useParams();
  const passProgramId =
    params.passProgramId !== 'add' ? params.passProgramId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadPassPrograms = () => {
    if (!passProgramId) return;
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.get(`/passPrograms/${passProgramId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setPassProgram(data.passProgram);
        form.setFieldsValue(data.passProgram);
      });
  };

  const deletePassProgram = () => {
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.delete(`/passPrograms/${passProgramId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/passProgram`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('coreservice-accounts')
      .then((c) => c.post(`/passPrograms/${passProgramId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${passProgramId ? '수정' : '생성'}되었습니다.`);
        if (data.passProgram.passProgramId) {
          history.push(`/passPrograms/${data.passProgram.pasProgramId}`);
        }
      });
  };

  useEffect(loadPassPrograms, [form, passProgramId]);
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
                {passProgram ? passProgram.name : '새로운 패스 프로그램'}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {passProgramId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deletePassProgram}
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
                    icon={passProgramId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {passProgramId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input.TextArea disabled={isLoading} />
          </Form.Item>
          <Form.Item name="couponGroupId" label="쿠폰 그룹 ID">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="price" label="가격">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="validity" label="기간">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="isSale" label="판매 여부" valuePropName="checked">
            <Switch disabled={isLoading} />
          </Form.Item>
          <Form.Item
            name="allowRenew"
            label="연장 가능"
            valuePropName="checked"
          >
            <Switch disabled={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});

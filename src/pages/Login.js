import { Button, Col, Form, Input, Row } from 'antd';
import { getClient } from '../tools';

import React from 'react';
import { withRouter } from 'react-router-dom';

export const Login = withRouter(({ history }) => {
  const onFinish = async (body) => {
    const client = await getClient('backoffice');
    const { data } = await client.post('/auth/email', body);
    localStorage.setItem('hikick-backoffice-session-id', data.sessionId);
    history.push('/');
  };

  return (
    <Row style={{ minHeight: '100vh' }} justify="center" align="middle">
      <Col lg={8} sm={12} align="center">
        <Form name="basic" layout="vertical" size="large" onFinish={onFinish}>
          <Form.Item label="이메일" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
});

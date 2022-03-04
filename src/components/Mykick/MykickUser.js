import { SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { getClient } from '../../tools';

export const MykickUser = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [idcard, setIdcard] = useState();
  useEffect(() => {
    if (!user) return;
    getClient('mykick').then((c) =>
      c
        .get(`/users/${user.userId}/idcard`)
        .then(({ data }) => setIdcard(data.idcard))
        .catch(() => setIdcard(null))
    );
  }, [user]);

  const save = async (payload) => {
    setLoading(true);
    getClient('mykick').then((c) =>
      c
        .patch(`/users/${user.userId}`, payload)
        .then(() => message.success('저장되었습니다.'))
        .finally(() => setLoading(false))
    );
  };

  if (!user || idcard === undefined) return <></>;
  const birthday = moment(user.birthday);
  return (
    <Card>
      <Form
        layout='vertical'
        initialValues={{ ...user, birthday, idcard }}
        onFinish={save}
      >
        <Row
          justify='space-between'
          gutter={[8, 8]}
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Typography.Title level={3}>사용자 정보</Typography.Title>
          </Col>
          <Col>
            <Row gutter={[4, 0]}>
              <Col>
                <Button
                  icon={<SaveOutlined />}
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                >
                  저장하기
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col lg={8} xs={24}>
                <Card>
                  <Image src={idcard} width='100%' />
                </Card>
              </Col>
              <Col lg={16} xs={24}>
                <Row gutter={[8, 8]}>
                  <Col lg={24} xs={24}>
                    <Form.Item name='name' label='성함'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xs={24}>
                    <Form.Item name='phoneNo' label='전화번호'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={12} xs={24}>
                    <Form.Item name='birthday' label='생년월일'>
                      <DatePicker />
                    </Form.Item>
                  </Col>
                  <Col lg={24} xs={24}>
                    <Form.Item name='address' label='주소'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='idcard' label='신분증 사진'>
                      <Input src={idcard} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

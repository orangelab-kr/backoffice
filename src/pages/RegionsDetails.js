import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Switch,
  Tabs,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params';
import { PricingSelect, RegionGeofence } from '../components';
import { getClient } from '../tools';

const { Title } = Typography;

export const RegionsDetails = withRouter(({ history }) => {
  const [region, setRegion] = useState();
  const params = useParams();
  const regionId = params.regionId !== 'add' ? params.regionId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);
  const [tab, setTab] = useQueryParam('tab', StringParam);
  const [map, setMap] = useQueryParam('map', BooleanParam);

  const loadRegions = () => {
    if (!regionId) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.get(`/regions/${regionId}`))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setRegion(data.region);
        form.setFieldsValue(data.region);
      });
  };

  const deleteRegions = () => {
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.delete(`/regions/${regionId}`))
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/regions`);
      });
  };

  const onSave = (body) => {
    if (isLoading) return;
    setLoading(true);
    getClient('openapi-location')
      .then((c) => c.post(`/regions/${regionId}`, body))
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${regionId ? '수정' : '생성'}되었습니다.`);
        if (data.region.regionId) {
          history.push(`/regions/${data.region.regionId}`);
        }
      });
  };

  useEffect(loadRegions, [form, regionId]);
  return (
    <Tabs activeKey={tab} defaultActiveKey="general" onChange={setTab}>
      <Tabs.TabPane tab="기본 정보" key="general">
        <Card>
          <Form layout="vertical" onFinish={onSave} form={form}>
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>
                <Title level={3}>{region ? region.name : '새로운 지역'}</Title>
              </Col>
              <Col>
                <Row gutter={[4, 0]}>
                  {regionId && (
                    <Col>
                      <Popconfirm
                        title="정말로 삭제하시겠습니까?"
                        okText="네"
                        cancelText="아니요"
                        onConfirm={deleteRegions}
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
                      icon={regionId ? <SaveOutlined /> : <PlusOutlined />}
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      {regionId ? '저장하기' : '생성하기'}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Form.Item name="enabled" label="활성화" valuePropName="checked">
              <Checkbox disabled={isLoading} />
            </Form.Item>
            <Form.Item name="name" label="이름">
              <Input disabled={isLoading} />
            </Form.Item>
            <Form.Item name="pricingId" label="가격 정책">
              <PricingSelect isLoading={isLoading} />
            </Form.Item>
          </Form>
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane
        key="geofence"
        disabled={!region}
        tab={
          <>
            지오펜스
            <Switch
              style={{ marginLeft: 5 }}
              onChange={setMap}
              checked={map}
              disabled={tab !== 'geofence'}
              checkedChildren="지도"
              unCheckedChildren="목록"
            />
          </>
        }
      >
        {region && <RegionGeofence region={region} map={map} />}
      </Tabs.TabPane>
    </Tabs>
  );
});

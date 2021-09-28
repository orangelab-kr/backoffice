import {
  BlockOutlined,
  CarOutlined,
  CrownOutlined,
  HomeOutlined,
  LockOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

export const Dashboard = withRouter(({ history, children }) => {
  // eslint-disable-next-line no-restricted-globals
  const currentMenu = location.pathname;
  const onClick = ({ key }) => history.push(key);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        width={150}
        defaultCollapsed={true}
        collapsedWidth={50}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[currentMenu]}
          mode="inline"
          onClick={onClick}
        >
          <Menu.Item key="/main" icon={<HomeOutlined />}>
            대시보드
          </Menu.Item>
          <Menu.Item key="/kickboards" icon={<CarOutlined />}>
            킥보드
          </Menu.Item>
          <Menu.Item key="/helmets" icon={<CrownOutlined />}>
            헬멧
          </Menu.Item>
          <Menu.Item key="/users" icon={<TeamOutlined />}>
            관리자
          </Menu.Item>
          <Menu.Item key="/permissionGroups" icon={<LockOutlined />}>
            권한 그룹
          </Menu.Item>
          <Menu.Item key="/services" icon={<BlockOutlined />}>
            서비스
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ height: '68px' }} />
        <Content style={{ margin: '10px 16px' }}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>HIKICK Backoffice ❤️</Footer>
      </Layout>
    </Layout>
  );
});

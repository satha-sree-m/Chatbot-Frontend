import React, {} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import TaskConfig from '../config/TaskConfig';

const TaskLayout = ({children}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Header, Content, Sider } = Layout;
const Days = ['1', '2', '3'].map((key,index) => ({
  key:index,
  label: `Day ${key}`,
}));
const navigate= useNavigate();

const handleMenuOnChange =(data)=>{
try {
  const requriredData= TaskConfig?.find((x) => x.key=== data?.key);
    console.log(requriredData)
    const {path}= requriredData
    navigate(path);
    console.log({data})
} catch (error) {
    console.error(error)
}
}
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={Days}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderInlineEnd: 0 }}
            items={TaskConfig}
            onClick={handleMenuOnChange}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'Task' }]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "90vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
           {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default TaskLayout;
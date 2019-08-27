import { useState, useEffect } from 'react'
import { Layout, Row, Col, Button, Icon, Menu } from 'antd'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../components/firebase'

import styles from './index.css'
import router from 'umi/router';

const { Header, Content } = Layout

const BaseLayout = props => (
  <Layout className={styles.Layout} {...props}>{props.children}</Layout>
)

const BaseHeader = props => (
  <Header className={styles.Header} {...props}>{props.children}</Header>
)

const BaseContent = props => (
  <Content className={styles.Content} {...props}>{props.children}</Content>
)

const CenteredRow = props => (
  <Row type="flex" justify="center" {...props}>
    <Col xs={24} md={16} lg={12} xl={8} xxl={6}>{props.children}</Col>
  </Row>
)

const HeaderButton = props => (
  <Button className={styles.Menu} {...props} />
)

const FrontLayout = props => {
  const [category] = useState({ id: null, name: '' })

  return (
    <BaseLayout>
      <BaseHeader className={styles.Header}>
        <CenteredRow>
          <Row type="flex" justify="space-between">
            <Row type="flex" align="middle">
              <HeaderButton 
                icon="left"
                shape="circle-outline"
                onClick={() => router.push('/')}
              />
              <h1 className={styles.Title}>{category.name}</h1>
            </Row>
            <div>
              <HeaderButton 
                icon="search"
                shape="circle-outline"
              />
              <HeaderButton 
                icon="heart"
                shape="circle-outline"
              />
              <HeaderButton 
                icon="shopping"
                shape="circle-outline"
              />
            </div>
          </Row>
        </CenteredRow>
      </BaseHeader>
      <BaseContent style={{ padding: 0 }}>
        <CenteredRow>
          {props.children}
        </CenteredRow>
      </BaseContent>
    </BaseLayout>
  );
}

const LoginLayout = props => (
  <BaseLayout>
    <BaseContent>
      <CenteredRow style={{ marginTop: '20%' }}>
        {props.children}
      </CenteredRow>
    </BaseContent>
  </BaseLayout>
)

const AdminLayout = props => {
  const [menus] = useState([
    { text: 'Product', to: 'product' },
    { text: 'Category', to: 'category' }
  ])
  const [selectedMenu, setSelectedMenu] = useState(props.pathname.split('/').pop())
  const [user] = useAuthState(auth)

  const menuHandler = ({ key }) => {
    setSelectedMenu(key)
    router.push(`/admin/${key}`)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      await router.push(`/admin`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!props.pathname.includes(selectedMenu)) {
      console.log(selectedMenu)
      router.push(`/admin/${selectedMenu}`)
    }
  }, [props.pathname, selectedMenu])

  useEffect(() => {
    if (!user) {
      router.push(`/login`)
    }
  }, [user])

  return (
    <BaseLayout>
      <BaseHeader>
        <Row type="flex" align="middle" justify="space-between" style={{ margin: '0 50px' }}>
          <Menu mode="horizontal" onClick={menuHandler} selectedKeys={[selectedMenu]} >
            {
              menus.map(menu => (
                <Menu.Item key={menu.to}>
                  {menu.text}
                </Menu.Item>
              ))
            }
          </Menu>
          <Button onClick={handleLogout}>
            Logout
            <Icon type="logout"/>
          </Button>
        </Row>
      </BaseHeader>
      <BaseContent>
        {props.children}
      </BaseContent>
    </BaseLayout>
  )
}

const CurrentLayout = props => {
  if (props.location.pathname === '/login') {
    return <LoginLayout>{props.children}</LoginLayout>
  }
  if (props.location.pathname.includes('admin')) {
    return <AdminLayout pathname={props.location.pathname}>{props.children}</AdminLayout>
  }
  return <FrontLayout>{props.children}</FrontLayout>
}

export default CurrentLayout;

import { useState, useEffect } from 'react'
import { Button, Icon, notification } from 'antd'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth, GoogleAuthProvider } from '../components/firebase'
import router from 'umi/router';

export default props => {
  const [isLoading, setLoading] = useState(false)
  const [user, isUserLoading, error] = useAuthState(auth)

  const handleLogin = () => {
    setLoading(true)
    auth.signInWithRedirect(GoogleAuthProvider)
  }

  useEffect(() => {
    if (user) {
      notification.success({
        message: `Welcome, ${user.displayName}`,
        placement: 'bottomRight'
      });
      router.push('/admin/product')
    }
  }, [user])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Login Failed',
        placement: 'bottomRight'
      });
    }
  }, [error])

  return (
    <div style={{ textAlign: 'center' }}>
      <Button size="large" loading={isLoading || isUserLoading} onClick={handleLogin}>
        Login
        <Icon type="login"/>
      </Button>
    </div>
  )
}
import React, { useEffect } from 'react'
import router from 'umi/router'

export default props => {
  useEffect(() => {
    router.push('/')
  }, [])

  return <></>
}
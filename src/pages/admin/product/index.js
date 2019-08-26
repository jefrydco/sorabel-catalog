import { useState, useEffect } from 'react'
import { Table, Tag, Button, Icon, notification, Avatar } from 'antd'
import router from 'umi/router';
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { db } from '../../../components/firebase'
import { ContentCard } from '../../../components/Card'

const productsDbRef = db.collection('products')

export default props => {
  const [products, isProductsLoading, isProductsError]  = useCollectionData(productsDbRef)

  useEffect(() => {
    if (isProductsError) {
      notification.error({
        message: 'Product failed to load',
        placement: 'bottomRight'
      });
    }
  }, [isProductsError])
  
  const sizesRenderer = (sizes = []) => {
    return sizes.map(size => (
      <Tag key={size}>
        {size}
      </Tag>
    ))
  }

  const thumbnailRenderer = (images = []) => {
    const [{ thumbUrl, name }] = images
    return <Avatar src={thumbUrl} alt={name} size="large" />
  }

  const actionRenderer = (text, record) => {
    return (
      <>
        <Button onClick={() => router.push(`/admin/product/edit/${record.id}`)} type="primary" style={{ marginRight: '5px' }}>
          Edit
          <Icon type="edit"/>
        </Button>
        <Button type="danger">
          Delete
          <Icon type="delete" />
        </Button>
      </>
    )
  }

  const [columns] = useState([
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Sizes', dataIndex: 'sizes', key: 'sizes', render: sizesRenderer },
    { title: 'Thumbnail', dataIndex: 'images', key: 'images', render: thumbnailRenderer },
    { title: 'Action', dataIndex: 'action', key: 'action', render: actionRenderer }
  ])

  return (
    <ContentCard
      title="Product"
      extra={
        <Button onClick={() => router.push(`/admin/product/new`)} type="primary">
          Add
          <Icon type="plus" />
        </Button>
      }
    >
      <Table
        dataSource={products}
        columns={columns}
        loading={isProductsLoading}
        rowKey="uid"/>
    </ContentCard>
  )
}
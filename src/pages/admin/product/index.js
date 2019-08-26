import { useState, useEffect } from 'react'
import { Table, Tag, Button, Icon, notification, Avatar, Popconfirm } from 'antd'
import router from 'umi/router';
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { db } from '../../../components/firebase'
import { ContentCard } from '../../../components/Card'

const productsDbRef = db.collection('products')

export default props => {
  const [isLoading, setLoading] = useState(false)
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

  const handleConfirmDelete = async uid => {
    try {
      setLoading(true)
      await productsDbRef.doc(uid).delete()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const thumbnailRenderer = (images = []) => {
    const [{ thumbUrl, name }] = images
    return <Avatar src={thumbUrl} alt={name} size="large" />
  }

  const actionRenderer = uid => {
    return (
      <>
        <Button onClick={() => router.push(`/admin/product/edit/${uid}`)} type="primary" style={{ marginRight: '5px' }}>
          Edit
          <Icon type="edit"/>
        </Button>
        <Popconfirm
          title="Are you sure delete this category?"
          onConfirm={() => handleConfirmDelete(uid)}
        >
          <Button type="danger">
            Delete
            <Icon type="delete" />
          </Button>
        </Popconfirm>
      </>
    )
  }

  const [columns] = useState([
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Sizes', dataIndex: 'sizes', key: 'sizes', render: sizesRenderer },
    { title: 'Thumbnail', dataIndex: 'images', key: 'images', render: thumbnailRenderer },
    { title: 'Action', dataIndex: 'uid', key: 'uid', render: actionRenderer }
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
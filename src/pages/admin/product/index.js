import { useState } from 'react'
import { Table, Tag, Button, Icon } from 'antd'
import router from 'umi/router';

import { ContentCard } from '../../../components/Card'

export default props => {
  const sizesRenderer = (sizes = []) => {
    return sizes.map(size => (
      <Tag key={size}>
        {size}
      </Tag>
    ))
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

  const [products] = useState([
    { id: 1, text: 'Jefry' }
  ])

  const [columns] = useState([
    { title: 'Name', dataIndex: 'text', key: 'text' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Sizes', dataIndex: 'sizes', key: 'sizes', render: sizesRenderer },
    { title: 'Thumbnail', dataIndex: 'thumbnail', key: 'thumbnail' },
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
        loading={false}
        rowKey="id"/>
    </ContentCard>
  )
}
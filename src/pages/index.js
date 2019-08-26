import { useState, useEffect } from 'react'
import { Card, Row, Col, notification, Tag, Button } from 'antd'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Link from 'umi/link'

import styles from './index.css'

import { db } from '../components/firebase'

const productsDbRef = db.collection('products')
const categoriesDbRef = db.collection('categories')

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR'
})

const BaseCard = props => (
  <Card className={styles.BaseCard} {...props}>{props.children}</Card>
)

export default (props) => {
  const [products, isProductsLoading, isProductsError] = useCollectionData(productsDbRef)
  const [categories, isCategoriesLoading, isCategoriesError] = useCollectionData(categoriesDbRef)

  useEffect(() => {
    if (isCategoriesError) {
      notification.error({
        message: 'Category failed to load',
        placement: 'bottomRight'
      });
    }
  }, [isCategoriesError])

  useEffect(() => {
    if (isProductsError) {
      notification.error({
        message: 'Product failed to load',
        placement: 'bottomRight'
      });
    }
  }, [isProductsError])

  let newProducts = []

  if (!isProductsLoading) {
    newProducts = products.slice(0, 2)
  }

  const NewProducts = (
    <Row type="flex" gutter={12}>
      {newProducts.map(product => (
        <Col xs={12} key={product.uid}>
          <Card 
            size="small"
            cover={
              <img
                src={product.images[0].response.url}
                alt={product.name} />
            }
          >
            <Card.Meta
              title={product.name}
              description={currencyFormatter.format(product.price)}
            />
          </Card>
        </Col>
    ))}
    </Row>
  )

  const Categories = (
    !isCategoriesLoading ? categories.map(category => (
      <Tag key={category.uid}>
        <Link to="/">
          {category.text}
        </Link>
      </Tag>
    )) : null
  )

  const Prices = (
    <Row type="flex" justify="center" align="middle" gutter={12}>
      {
        ['150000', '150000 - 250000'].map((price, i) => (
          <Col xs={12} key={i}>
            <Button size="large" block>
              {price}
            </Button>
          </Col>
        ))
      }
    </Row>
  )

  return (
    <>
      <BaseCard
        title="Terbaru"
        extra={
          <Link to="/">Lihat Semua</Link>
        }
      >
        {NewProducts}
      </BaseCard>
      <BaseCard
        title="Kategori"
      >
        {Categories}
      </BaseCard>
      <BaseCard
        title="Berdasarkan Harga"
      >
        {Prices}
      </BaseCard>
    </>
  );
}

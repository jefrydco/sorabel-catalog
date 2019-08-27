import { useEffect } from 'react'
import { Card, Row, Col, notification, Select, Button } from 'antd'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Link from 'umi/link'

import styles from './index.css'

import { BaseCard } from '../components/Card'
import { db } from '../components/firebase'

const productsDbRef = db.collection('products')
const categoriesDbRef = db.collection('categories')

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR'
})

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
          <Link 
            to={`/product/${product.uid}`}
            key={product.uid}
          >
            <Card 
              size="small"
              type="inner"
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
          </Link>
        </Col>
      ))}
    </Row>
  )

  const Categories = (
    !isCategoriesLoading ? categories.map(category => (
      <Button to="/" className={styles.Button} key={category.uid}>
        {category.text}
      </Button>
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

  const Sort = (
    <div style={{ marginBottom: 10 }}>
      <Select className={styles.Button} placeholder="Urutkan" size="large" style={{ width: 150 }}>
        {
          [
            { text: 'Terbaru', value: 'date_desc' },
            { text: 'Termurah', value: 'price_asc' },
            { text: 'Termahal', value: 'price_desc' }
          ].map(filter => (
            <Select.Option key={filter.value}>
              {filter.text}
            </Select.Option>
          ))
        }
      </Select>
      <Button className={styles.Button} size="large">Filter</Button>
    </div>
  )

  const Products = isProductsLoading ? null : (
    products.map(product => (
      <Link 
        to={`/product/${product.uid}`}
        key={product.uid}
      >
        <Card 
          size="large"
          type="inner"
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
      </Link>
    ))
  )

  return (
    <>
      <BaseCard
        title="Terbaru"
        loading={isProductsLoading}
        extra={
          <Link to="/">Lihat Semua</Link>
        }
      >
        {NewProducts}
      </BaseCard>
      <BaseCard
        loading={isCategoriesLoading}
        title="Kategori"
      >
        {Categories}
      </BaseCard>
      <BaseCard
        title="Berdasarkan Harga"
      >
        {Prices}
      </BaseCard>
      <BaseCard title="Editorial">
        <a title="Editorial" href="https://www.sorabel.com/blog/5-jenis-dress-yang-penting-wanita-tahu">
          <img alt="" src="https://imager-next.freetls.fastly.net/images/resized/480/assets-category-banner/250619_Sub-Category_DRESS.jpg" />
        </a>
      </BaseCard>
      <BaseCard
        title="Rekomendasi Produk"
        loading={isProductsLoading}
      >
        {Sort}
        {Products}
      </BaseCard>
    </>
  );
}

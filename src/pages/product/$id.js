import { BaseCard } from '../../components/Card'
import { useState, useEffect } from 'react'
import { notification, Carousel, Modal, Divider, Button, Icon, Row, Col, Collapse } from 'antd'
import router from 'umi/router';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

import { db } from '../../components/firebase'

import styles from './$id.css'

const productDbRef = db.collection('products')

export default props => {
  if (!props.match.params.id) {
    return router.replace('/')
  }

  const [isModal, setModal] = useState(false)
  const [image, setImage] = useState(null)
  const [product, isProductLoading, isProductError] = useDocumentDataOnce(productDbRef.doc(props.match.params.id))

  useEffect(() => {
    if (isProductError) {
      notification.error({
        message: 'Product failed to load',
        placement: 'bottomRight'
      });
    }
  }, [isProductError])

  const handleCarouselImage = (image) => {
    setImage(image)
    setModal(true)
  }

  let Image = null
  if (!isProductLoading) {
    if (product.images.length === 0) {
      Image = (
        <img
            src={product.images[0].response.url}
            alt={product.name} />
      )
    } else {
      Image = (
        <Carousel 
          effect="fade"
          autoplay={true}
        >
          {
            product.images.map(image => (
              <img
                key={image.name}
                src={image.response.url}
                alt={image.name}
                onClick={() => handleCarouselImage(image)}
              />
            ))
          }
        </Carousel>
      )
    }
  }

  return (
    <div>
      <BaseCard
        loading={isProductLoading}
        style={{ marginBottom: 8 }}
        cover={Image}
      >
        <Modal 
          visible={isModal}
          footer={null}
          onCancel={() => {
            setModal(false)
            setImage(null)
          }}
        >
          {
            image && (
              <img
                src={image.response.url}
                alt={image.name}
              />
            )
          }
        </Modal>
        {
          isProductLoading ? null : (
            <>
              <h1>{product.name}</h1>
              <h2>{product.price}</h2>
              <Divider />
              <div>
                Warna: {product.color}
              </div>
              <div>
                Ukuran: {
                  product.sizes.map((size, i) => {
                    if (product.sizes.length - 1 !== i) {
                      return <span>{size}, </span>
                    }
                    return <span>{size}</span>
                  })
                }
              </div>
              <Button style={{ marginTop: 10 }} size="large">
                <Icon type="sliders"/>
                Panduan Ukuran
              </Button>
              <Divider />
              <Row type="flex" gutter={8}>
                <Col xs={8}>
                  <Button block>
                    <Icon type="heart"/>
                    Simpan
                  </Button>
                </Col>
                <Col xs={16}>
                  <Button block type="primary">Beli Sekarang</Button>
                </Col>
              </Row>
            </>
          )
        }
      </BaseCard>
      <Collapse 
        expandIconPosition="right"
        bordered={false}
      >
        <Collapse.Panel header="Detail &amp; Ukuran">
          {
            isProductLoading ? null : (
              <div>
                <h3>Detail</h3>
                <div>
                  { product.description }
                </div>
                <Divider />
                <h3>Panduan Ukuran</h3>
                {
                  product.sizeDescriptions.map((desc, i) => (
                    <div className={styles.MeasurementGuidelines}>
                      <h4>{product.sizes[i]}</h4>
                      <div>{desc}</div>
                    </div>
                  ))
                }
              </div>
            )
          }
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}
import { Form, Row, Col, Icon, Input, Button, Select, Badge, Upload, Modal, notification } from 'antd'
import { ContentCard } from '../Card'
import styles from './index.css'
import { useState, useEffect } from 'react';
import { storage, db } from '../firebase'
import uuidv4 from 'uuid/v4'
import router from 'umi/router'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const colors = ['Pink','Red','Yellow','Orange','Cyan','Green','Blue','Purple','Geek Blue','Magenta','Volcano','Gold','Lime']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL']
const productsStorageRef = storage.ref('products')
const productsDbRef = db.collection('products')
const categoriesDbRef = db.collection('categories')

const ProductForm = props => {
  const [isLoading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)
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
    if (redirect) {
      const id = setInterval(() => {
        router.push('/admin/product')
      }, 1000);
      return () => {
        clearInterval(id)
      }
    }
  }, [redirect])

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(async (err, _product) => {
      if (!err) {
        try {
          setLoading(true)
          const uid = uuidv4()
          const product = {
            ..._product,
            uid,
            images: _product.images.map(image => {
              delete image.originFileObj
              return {
                ...image,
              }
            })
          }
          await productsDbRef.doc(uid).set(product, { merge: true })
          await notification.success({
            message: 'Product is saved',
            placement: 'bottomRight'
          })
          await setRedirect(true)
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    });
  };

  const { getFieldDecorator, getFieldValue } = props.form;
  const sizeValues = getFieldValue('sizes') || []

  const handleRemoveSizeDescription = _sizeValue => {
    // can use data-binding to get
    // We need at least one passenger
    if (sizeValues.length === 1) {
      return;
    }

    // can use data-binding to set
    props.form.setFieldsValue({
      sizes: sizeValues.filter(sizeValue => sizeValue !== _sizeValue),
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const formItems = sizeValues.map((sizeValue, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? 'Size Description' : ''}
      required={true}
      key={sizeValue}
    >
      <Row>
        <Col>Size Description for {sizeValue}:</Col>
      </Row>
      <Row gutter={8} type="flex" justify="space-between" align="middle">
        <Col xs={23}>
          {getFieldDecorator(`sizeDescriptions[${index}]`, {
            rules: [
              {
                required: true,
                whitespace: true,
                message: `Please input size description for ${sizeValue} or delete this field.`,
              },
            ],
          })(<Input.TextArea
                placeholder={`Lingkar dada 110 cm\nLebar bahu 41 cm\nPanjang lengan 19 cm\nLingkar lengan 54 cm\nPanjang 96 cm`}
                rows={5}
                autosize={{ minRows: 5 }}
              />)}
        </Col>
        <Col xs={1}>
          {sizeValues.length > 1 ? (
            <Icon
              className={styles.DeleteButton}
              type="minus-circle-o"
              onClick={() => handleRemoveSizeDescription(sizeValue)}
            />
          ) : null}
        </Col>
      </Row>
    </Form.Item>
  ));

  const [isPreview, setPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  // eslint-disable-next-line
  const [images, setImages] = useState([])

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const handleImagesCancel = () => setPreview(false);

  const handleImagesPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreview(true)
    setPreviewImage(file.url || file.preview)
  };

  const handleImagesAction = async ({onError, onSuccess, file}) => {
    try {
      const uploadRef = productsStorageRef.child(`${uuidv4()}.jpg`)
      const storageSnap = await uploadRef.put(file)
      if (storageSnap) {
        const url = await storageSnap.ref.getDownloadURL()
        const { name, timeCreated, fullPath  } = storageSnap.metadata

        onSuccess({
          name,
          url,
          timeCreated,
          fullPath
        })
      }
    } catch (error) {
      onError(error)
    }
  }

  const handleImagesRemove = async file => {
    try {
      const uploadRef = storage.ref(file.response.fullPath)
      await uploadRef.delete()
    } catch (error) {
      console.log(error)
    }
  }

  const handleImagesChange = e => {
    if (Array.isArray(e.fileList)) {
      setImages(Array.from(e.fileList))
    }
    return e && e.fileList;
  };

  return (
    <ContentCard
      title={`${props.id ? `Edit` : `Add`} Product`}
      extra={
        <Button type="primary" onClick={handleSubmit}>
          {props.id ? `Edit` : `Save`}
          <Icon type={props.id ? `edit` : `save`} />
        </Button>
      }
    >
      <Form
        onSubmit={handleSubmit}
        labelCol={{
          xs: { span: 24 },
          sm: { span: 4 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 20 },
        }}
        layout="horizontal"
        className="login-form"
      >
        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input name.'
              }
            ],
          })(
            <Input placeholder="Ex: My Lovely Product" allowClear />,
          )}
        </Form.Item>
        <Form.Item label="Price">
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                message: 'Please input price.'
              }
            ],
          })(
            <Input type="number" addonBefore="Rp." placeholder="Ex: 100000" allowClear />,
          )}
        </Form.Item>
        <Form.Item label="Category">
          {getFieldDecorator('category', {
            rules: [
              {
                required: true,
                message: 'Please choose category.'
              }
            ],
          })(
            <Select placeholder="Ex: Pink">
              {!isCategoriesLoading ? categories.map(category => (
                <Select.Option key={category.uid}>
                  {category.text}
                </Select.Option>
              )) : null}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Color">
          {getFieldDecorator('color', {
            rules: [
              {
                required: true,
                message: 'Please choose color.'
              }
            ],
          })(
            <Select placeholder="Ex: Pink">
              {colors.map(color => (
                <Select.Option key={color}>
                  <Badge color={color.toLowerCase().replace(/\s/g, '')} text={color} />
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Sizes">
          {getFieldDecorator('sizes', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: 'Please choose at least min 1 sizes.'
              }
            ],
          })(
            <Select
              mode="tags"
              tokenSeparators={[',']}
              placeholder="Ex: XXL"
            >
              {sizes.map(size => (
                <Select.Option key={size}>{size}</Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {formItems}
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please input description.'
              }
            ],
          })(
            <Input.TextArea
              placeholder="Ex: My product has been proven for over 10 years."
              rows={5}
              autosize={{ minRows: 5 }} />,
          )}
        </Form.Item>
        <Form.Item label="Images">
          <div className="clearfix">
            {getFieldDecorator('images', {
              valuePropName: 'fileList',
              getValueFromEvent: handleImagesChange,
            })(
              <Upload
                listType="picture-card"
                accept="images/*"
                multiple={true}
                customRequest={handleImagesAction}
                onRemove={handleImagesRemove}
                onPreview={handleImagesPreview}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>
            )}
            <Modal visible={isPreview} footer={null} onCancel={handleImagesCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={
          {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 4,
            },
          }
        }>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            onSubmit={handleSubmit}
          >
            {props.id ? `Edit` : `Save`}
            <Icon type={props.id ? `edit` : `save`} />
          </Button>
        </Form.Item>
      </Form>
    </ContentCard>
  )
}

const WrappedProductForm = Form.create({ name: 'product_form' })(ProductForm)
export default WrappedProductForm
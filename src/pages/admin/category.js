import { useState, useEffect } from 'react'
import { Form, Input, Table, Modal, Button, Icon, Popconfirm, notification } from 'antd'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import uuidv4 from 'uuid/v4'
import { ContentCard } from "../../components/Card";
import { db } from '../../components/firebase'

const categoryDbRef = db.collection('categories')

const Category = props => {
  const [isLoading, setLoading] = useState(false)
  const [isModal, setModal] = useState(false)
  const [isEditing, setEditing] = useState(false)
  const [categories, isCategoriesLoading, error] = useCollectionData(categoryDbRef)

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Category failed to load',
        placement: 'bottomRight'
      });
    }
  }, [error])

  const handleTriggerEdit = (category) => {
    setFieldsValue({ category: category.text })
    setModal(true)
    setEditing(true)
  }

  const handleTriggerAdd = () => {
    setFieldsValue({ category: '' })
    setModal(true)
  }

  const handleCancel = () => {
    setModal(false)
    setEditing(false)
  }

  const handleOk = () => {
    props.form.validateFields(async (err, { category: _category }) => {
      if (!err) {
        try {
          setLoading(true)
          const category = {
            uid: uuidv4(),
            text: _category
          }
          await categoryDbRef.doc(category.uid).set(category, { merge: true })
          await handleCancel()
          await notification.success({
            message: 'Category is saved',
            placement: 'bottomRight'
          })
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleConfirmDelete = async category => {
    try {
      setLoading(true)
      await categoryDbRef.doc(category.uid).delete()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const actionRenderer = (text, record) => {
    return (
      <>
        <Button onClick={() => handleTriggerEdit(record)} type="primary" style={{ marginRight: '5px' }}>
          Edit
          <Icon type="edit"/>
        </Button>
        <Popconfirm
          title="Are you sure delete this category?"
          onConfirm={() => handleConfirmDelete(record)}
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
    { title: 'Name', dataIndex: 'text', key: 'text' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: actionRenderer }
  ])

  const { getFieldDecorator, setFieldsValue } = props.form;

  return (
    <ContentCard
      title="Category"
      extra={
        <Button type="primary" onClick={handleTriggerAdd}>
          Add
          <Icon type="plus" />
        </Button>
      }
    >
      <Table
        dataSource={categories}
        columns={columns}
        loading={isCategoriesLoading}
        rowKey="id"/>
      <Modal
        title={`${isEditing ? `Edit` : 'Save'} Category`}
        visible={isModal}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <Form 
          onSubmit={handleOk}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 20 },
          }}
          layout="horizontal"
        >
          <Form.Item label="Category">
            {getFieldDecorator('category', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Please input category.'
                }
              ]
            })(
              <Input placeholder="Ex: Mini Dress" allowClear />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </ContentCard>
  )
}

const WrappedCategory = Form.create({ name: 'category_form' })(Category)
export default WrappedCategory
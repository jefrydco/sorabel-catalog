import ProductForm from '../../../../components/ProductForm'

export default props => {
  return (
    <ProductForm id={props.match.params.id} />
  )
}
import { useState } from 'react'
import { Card } from 'antd'
import Link from 'umi/link'

export default (props) => {
  const [newProducts] = useState([])

  const NewProducts = newProducts.map(product => (
    <Card key={product.id}>
      <img
        src={product.image}
        alt={product.title} />
    </Card>
  ))

  return (
    <>
      <Card
        title="Terbaru"
        extra={
          <Link to="/">Lihat Semua</Link>
        }>
        {NewProducts}
      </Card>
    </>
  );
}

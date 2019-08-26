import { Button, Icon } from 'antd'
import { ContentCard } from "../../components/Card";

export default props => {
  return (
    <ContentCard
      title="Category"
      extra={
        <Button type="primary">
          Add
          <Icon type="plus" />
        </Button>
      }
    >
      <div>Category</div>
    </ContentCard>
  )
}
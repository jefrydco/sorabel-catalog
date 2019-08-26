import { Card } from "antd";

export const ContentCard = props => (
  <Card style={{ marginTop: '30px' }} {...props}>
    {props.children}
  </Card>
)
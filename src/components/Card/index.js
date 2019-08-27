import { Card } from "antd";
import styles from './index.css'

export const ContentCard = props => (
  <Card style={{ marginTop: '30px' }} {...props}>
    {props.children}
  </Card>
)

export const BaseCard = props => (
  <Card className={styles.BaseCard} {...props}>{props.children}</Card>
)
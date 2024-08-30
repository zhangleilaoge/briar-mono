import { Button, Result } from "antd"
import s from "./style.module.scss"
import { useNavigate } from "react-router-dom"
const Page404 = () => {
  const navigate = useNavigate()
  return (
    <Result
      className={s.ErrorContainer}
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  )
}

export default Page404

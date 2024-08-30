import CommonContext from "@/context/common"
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons"
import { Avatar, Dropdown, message, Modal } from "antd"
import { useContext, useMemo, useState } from "react"
import GoogleLogin from "react-google-login"
import { clientId } from "@/constants/login"
import s from "./style.module.scss"

enum OperationEnum {
  Login = "login",
  Logout = "logout",
}

const Profile = () => {
  const { profileImg } = useContext(CommonContext)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onSuccess = (res: any) => {
    console.log("success:", res)
  }
  const onFailure = (err: any) => {
    console.log("failed:", err)
  }

  const dropdownItems = useMemo(() => {
    return [
      {
        key: OperationEnum.Login,
        icon: <LoginOutlined />,
        label: (
          <a
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            login
          </a>
        ),
      },
      {
        key: OperationEnum.Logout,
        icon: <LogoutOutlined />,
        label: (
          <a
            onClick={() => {
              message.success("成功登出")
            }}
          >
            logout
          </a>
        ),
      },
    ]
  }, [])

  return (
    <>
      <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
        <Avatar size={40} src={profileImg} />
      </Dropdown>
      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
        onCancel={() => {
          setIsModalOpen(false)
        }}
      >
        <div className={s.ModalContent}>
          <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
        </div>
      </Modal>
    </>
  )
}

export default Profile

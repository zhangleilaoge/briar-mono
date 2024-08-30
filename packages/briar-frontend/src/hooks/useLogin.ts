import { clientId } from '@/constants/login';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';

const useLogin = () => {
  // 后面改成在localStorage中存储
  const profileImg = 'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/%E8%B4%9D%E8%95%BE%E4%BA%9A%E4%B8%8A%E8%BA%AB64.png'
  const fullName = '123'

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId,
        scope: "",
      })
    }
    gapi.load("client:auth2", initClient)
  })

  return {
    profileImg,
    fullName
  }
}

export default useLogin
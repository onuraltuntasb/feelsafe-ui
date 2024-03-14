import React, {
  Children,
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react"
import { useSnackbar } from "notistack"
import { useAppDispatch } from "../redux/hooks"
import LoadingToRedirect from "./LoadingToRedirect"
import { sendAuthUserData } from "../redux/features/authSlice"
import { PrivateRouteProps } from "../types/types"

const PrivateRoute = (props: PrivateRouteProps) => {
  const { children, notRedirect } = props

  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const [isTokenValid, setisTokenValid] = useState(false)

  async function fetchText() {
    try {
      let response = await fetch("/api/user/check")
      if (response.status === 200) {
        const result = await response.json()
        dispatch(sendAuthUserData(result))
        setisTokenValid(true)
      }
    } catch (error) {
      dispatch(sendAuthUserData(null))
      enqueueSnackbar("Authentication failed!", { variant: "error" })
    }
  }

  useEffect(() => {
    fetchText()
  }, [])

  const childrenWithProps = Children.map(
    children,
    (child: ReactElement<any, string | JSXElementConstructor<any>>) =>
      React.cloneElement(child, {
        isAuthenticated: isTokenValid,
      }),
  )

  const renderReturn = () => {
    if (isTokenValid) {
      return childrenWithProps
    } else {
      if (notRedirect) {
        return childrenWithProps
      } else {
        return <LoadingToRedirect />
      }
    }
  }

  return renderReturn()
}

export default PrivateRoute

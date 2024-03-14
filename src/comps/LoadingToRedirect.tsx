import { CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const LoadingToRedirect = () => {
  const [count, setCount] = useState<number>(5)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(currentCount => currentCount - 1)
    }, 1000)

    count === 0 && navigate("/signin")

    return () => clearInterval(interval)
  }, [count])

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <CircularProgress size={150} />
    </div>
  )
}

export default LoadingToRedirect

import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"
import Appbar from "../comps/Appbar"
import Container from "@mui/material/Container"
import { StyledBox } from "./auth/SignupPage"

const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <Appbar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <StyledBox sx={{ p: 4, width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
            }}
          >
            Sorry for error :( page you want to see is not in our server or some
            unchecked error happened :/
          </Typography>
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={() => {
                navigate("/")
              }}
              variant="outlined"
            >
              Return to main page
            </Button>
          </div>
        </StyledBox>
      </Container>
    </>
  )
}

export default ErrorPage

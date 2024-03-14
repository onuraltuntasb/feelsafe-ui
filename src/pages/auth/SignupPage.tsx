import { useEffect, useState } from "react"
import { useAppDispatch } from "../../redux/hooks"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { object, string } from "zod"
import { FormProvider, useForm } from "react-hook-form"
import FormInput from "../../comps/mui-rhf/FormInput"
import {
  Box,
  BoxProps,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  alpha,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { useRegisterUserMutation } from "../../redux/services/authApi"
import { useSnackbar } from "notistack"
import { sendAuthUserData } from "../../redux/features/authSlice"
import Appbar from "../../comps/Appbar"

export const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginTop: "1rem",
  alignSelf: "center",
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  borderRadius: "0.625rem",
  outline: "0.0625rem solid",
  outlineColor:
    theme.palette.mode === "light"
      ? alpha("#BFCCD9", 0.5)
      : alpha("#9CCCFC", 0.1),
  boxShadow:
    theme.palette.mode === "light"
      ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
      : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
}))

//TODO: http 500 error goes as http proxy error on vite

const SignupPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setshowConfirmPassword] = useState(false)

  const signupSchema = object({
    email: string().min(1, "Email is required").email("Email is invalid"),
    password: string()
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string().min(1, "Please confirm your password"),
  }).refine(data => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  })

  const defaultValues = {
    email: "",
    password: "",
    passwordConfirm: "",
  }

  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

  const onSubmitHandler = (values: any) => {
    // console.log("values :",values)
    registerUser({
      email: values.email,
      password: values.password,
    })
  }

  const [
    registerUser,
    {
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerErrorData,
      isLoading: isRegisterLoading,
    },
  ] = useRegisterUserMutation()

  useEffect(() => {
    if (isRegisterSuccess && registerData) {
      enqueueSnackbar("User signup successfull!", { variant: "success" })
      localStorage.setItem("feelsafe-auth-infos", registerData.email)
      dispatch(sendAuthUserData(registerData))
      navigate("/dashboard/diary-add")
    } else if (isRegisterError && registerErrorData) {
      let registerErrorDataObj: any = registerErrorData
      console.log(
        "error : ",
        JSON.stringify(registerErrorDataObj?.data?.errors),
      )
      enqueueSnackbar("User signup error!", {
        variant: "error",
      })
    }
  }, [isRegisterSuccess, isRegisterError, registerData, registerErrorData])

  return (
    <div>
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
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            component="h4"
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            Sign up
          </Typography>

          <StyledBox sx={{ width: { xs: "100%", sm: "70%" } }}>
            <Stack
              direction={{ xs: "column" }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ p: 4, width: { xs: "100%" } }}
            >
              <FormProvider {...methods}>
                <form
                  style={{ display: "contents" }}
                  onSubmit={methods.handleSubmit(onSubmitHandler)}
                >
                  <FormInput
                    aria-label="Email"
                    placeholder="Email"
                    hiddenLabel
                    type="email"
                    name="email"
                    required
                    sx={{ mb: "16px" }}
                  />
                  <FormInput
                    aria-label="Password"
                    placeholder="Password"
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    sx={{ mb: "16px" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setShowPassword(show => !show)
                            }}
                            onMouseDown={event => {
                              event.preventDefault()
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormInput
                    aria-label="Confirm Password"
                    placeholder="Confirm Password"
                    name="passwordConfirm"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setshowConfirmPassword(show => !show)
                            }}
                            onMouseDown={event => {
                              event.preventDefault()
                            }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <LoadingButton
                    loading={isRegisterLoading}
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: "8px",
                      width: "100%",
                      marginInline: "auto",
                    }}
                  >
                    Sign Up
                  </LoadingButton>
                </form>
              </FormProvider>
            </Stack>
          </StyledBox>
        </Stack>
      </Container>
    </div>
  )
}

export default SignupPage

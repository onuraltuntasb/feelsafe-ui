import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { useLoginUserMutation } from "../../redux/services/authApi";
import { sendAuthUserData } from "../../redux/features/authSlice";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
	Container,
	IconButton,
	InputAdornment,
	Stack,
	Typography,
} from "@mui/material";
import { StyledBox } from "./SignupPage";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Appbar from "../../comps/Appbar";
import FormInput from "../../comps/mui-rhf/FormInput";

const SigninPage = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useAppDispatch();

	const [showPassword, setShowPassword] = useState(false);

	// const isFetchBaseQueryErrorType = (
	//   error: any,
	// ): error is FetchBaseQueryError => "status" in error

	const [
		loginUser,
		{
			data: loginData,
			isSuccess: isLoginSuccess,
			isError: isLoginError,
			error: loginErrorData,
			isLoading: isLoginLoading,
		},
	] = useLoginUserMutation();

	useEffect(() => {
		if (isLoginSuccess && loginData) {
			//console.log('User login successfull!', loginData);
			enqueueSnackbar("User login successfull!", { variant: "success" });
			localStorage.setItem("feelsafe-auth-infos", loginData.email);
			dispatch(sendAuthUserData(loginData));
			navigate("/dashboard/diary");
		} else if (isLoginError && loginErrorData) {
			//console.log('User login error!', JSON.stringify(loginErrorData));
			let loginErrorDataObj: any = loginErrorData;
			enqueueSnackbar(JSON.stringify(loginErrorDataObj?.data?.errors), {
				variant: "error",
			});
		}
	}, [isLoginSuccess, isLoginError, loginData, loginErrorData]);

	const onSubmitHandler = (values: any) => {
		loginUser({
			email: values.email,
			password: values.password,
		});
		//console.log(values);
	};

	const defaultValues = {
		email: "",
		password: "",
	};

	const loginSchema = object({
		email: string().min(1, "Email is required").email("Email is invalid"),
		password: string()
			.min(1, "Password is required")
			.min(8, "Password must be more than 8 characters")
			.max(32, "Password must be less than 32 characters"),
	});

	const methods = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues,
	});

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
				<Stack
					spacing={2}
					useFlexGap
					sx={{ width: { xs: "100%", sm: "70%" } }}
				>
					<Typography
						component="h4"
						variant="h4"
						sx={{
							textAlign: "center",
						}}
					>
						Sign in
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
									onSubmit={methods.handleSubmit(
										onSubmitHandler
									)}
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
										type={
											showPassword ? "text" : "password"
										}
										sx={{ mb: "16px" }}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={() => {
															setShowPassword(
																(show) => !show
															);
														}}
														onMouseDown={(
															event
														) => {
															event.preventDefault();
														}}
													>
														{showPassword ? (
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
										loading={isLoginLoading}
										type="submit"
										variant="contained"
										sx={{
											mt: "8px",
											width: "100%",
											marginInline: "auto",
										}}
									>
										Sign in
									</LoadingButton>
								</form>
							</FormProvider>
						</Stack>
					</StyledBox>
				</Stack>
			</Container>
		</div>
	);
};

export default SigninPage;

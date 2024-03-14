import { TextField } from "@mui/material"
import { useFormContext, Controller } from "react-hook-form"

//NOTE: props type is any because i want to give text field or controller props
//i dont know which is which so it's any for flexibility
const FormInput = ({ name, ...otherProps }: any) => {
  // ? Utilizing useFormContext to have access to the form Context
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          {...otherProps}
          variant="outlined"
          error={!!errors[name]}
          helperText={errors[name] ? errors[name]?.message?.toString() : ""}
        />
      )}
    />
  )
}

export default FormInput

import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  useAddDiaryMutation,
  useLazyGetAllDiariesUsersQuery,
  useUpdateDiaryMutation,
} from "../../redux/services/diaryApi"
import { sendSelectedDiaryData } from "../../redux/features/diarySlice"
import { Container, Stack, TextField, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { StyledBox } from "../../pages/auth/SignupPage"
import { IDiary } from "../../types/models"
import { DiaryFormProps } from "../../types/types"

const AddEditDiaryForm = (props: DiaryFormProps) => {
  const { operationType, setIsOpen } = props

  const [trigger] = useLazyGetAllDiariesUsersQuery()
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()

  const [content, setContent] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const [id, setId] = useState<number>(-1)
  //NOTE:i know any is to generic but it really depends on backend error so
  //without strict backend error classification we gonna continue from any
  const [addDiaryErrorData, setaddDiaryErrorData] = useState<any>(null)

  const selectedDiaryData: IDiary  = useAppSelector(
    state => state?.diary?.sendSelectedDiaryData,
  )

  useEffect(() => {
    if (selectedDiaryData) {
      setHeader(selectedDiaryData.header)
      setContent(selectedDiaryData.content)
      setId(selectedDiaryData.id)
    }
  }, [selectedDiaryData])

  const [
    addDiary,
    {
      data: addDiaryData,
      isSuccess: isAddDiarySuccess,
      isError: isAddDiaryError,
      error: addDiaryError,
      isLoading: isAddDiaryLoading,
    },
  ] = useAddDiaryMutation()

  useEffect(() => {
    if (isAddDiaryError && addDiaryErrorData) {
      //NOTE: i dont want to extend rtk query type and it's doesn't matter
      //because i am using any for errors that come from backend
      let addDiaryErrorDataObj: any = addDiaryError
      setaddDiaryErrorData(addDiaryErrorDataObj?.data?.errors)
    }
  }, [isAddDiaryError, addDiaryError, addDiaryErrorData])

  useEffect(() => {
    if (isAddDiarySuccess) {
      enqueueSnackbar("Adding diary is successfull!", { variant: "success" })
      dispatch(sendSelectedDiaryData(addDiaryData))
      trigger(false)
      setIsOpen(false)
    } else if (isAddDiaryError) {
      enqueueSnackbar("Adding diary error!", { variant: "error" })
    }
  }, [
    isAddDiarySuccess,
    isAddDiaryError,
    enqueueSnackbar,
    dispatch,
    addDiaryData,
    trigger,
    setIsOpen,
  ])

  const [updateDiaryErrorData, setUpdateDiaryErrorData] = useState(null)

  const [
    updateDiary,
    {
      data: updateDiaryData,
      isSuccess: isUpdateDiarySuccess,
      isError: isUpdateDiaryError,
      error: updateDiaryError,
      isLoading: isUpdateDiaryLoading,
    },
  ] = useUpdateDiaryMutation()

  useEffect(() => {
    if (isUpdateDiaryError && updateDiaryErrorData) {
      let updateDiaryErrorDataObj: any = updateDiaryError
      setUpdateDiaryErrorData(updateDiaryErrorDataObj?.data?.errors)
    }
  }, [isUpdateDiaryError, updateDiaryError, updateDiaryErrorData])

  useEffect(() => {
    if (isUpdateDiarySuccess) {
      enqueueSnackbar("updateing diary is successfull!", { variant: "success" })
      dispatch(sendSelectedDiaryData(updateDiaryData))
      trigger(false)
    } else if (isUpdateDiaryError) {
      enqueueSnackbar("updateing diary error!", { variant: "error" })
    }
  }, [
    isUpdateDiarySuccess,
    isUpdateDiaryError,
    enqueueSnackbar,
    dispatch,
    updateDiaryData,
    trigger,
  ])

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StyledBox sx={{ width: { xs: "100%", sm: "70%" } }}>
        <Stack spacing={2} useFlexGap>
          <Typography
            component="h4"
            variant="h4"
            fontSize="1.5rem"
            sx={{
              textAlign: "center",
            }}
          >
            {new Date().toDateString()}
          </Typography>

          <TextField
            aria-label="Diary Header"
            placeholder="Header"
            hiddenLabel
            id="headerInputId"
            value={header}
            onChange={e => {
              setHeader(e.target.value)
            }}
          />

          <TextField
            aria-label="Diary Content"
            placeholder="Diary"
            hiddenLabel
            id="contentInputId"
            multiline
            rows={20}
            value={content}
            onChange={e => {
              setContent(e.target.value)
            }}
          />
          <LoadingButton
            loading={
              operationType === "edit"
                ? isUpdateDiaryLoading
                : isAddDiaryLoading
            }
            type="submit"
            variant="contained"
            sx={{
              mt: ".5rem",
              width: "100%",
              marginInline: "auto",
            }}
            onClick={() => {
              let payload = { id, header, content }
              operationType === "edit"
                ? updateDiary(payload)
                : addDiary(payload)
            }}
          >
            Submit
          </LoadingButton>
        </Stack>
      </StyledBox>
    </Container>
  )
}

export default AddEditDiaryForm

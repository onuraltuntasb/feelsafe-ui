import { useEffect, useState } from "react"
import {
  useDeleteDiaryMutation,
  useLazyGetAllDiariesUsersQuery,
} from "../../redux/services/diaryApi"
import { useSnackbar } from "notistack"
import { useAppSelector } from "../../redux/hooks"
import { Alert, LoadingButton } from "@mui/lab"
import { DiaryFormProps } from "../../types/types"
import { IDiary } from "../../types/models"

const DeleteDiaryForm = (props: DiaryFormProps) => {
  const selectedDiaryData: IDiary = useAppSelector(
    state => state?.diary?.sendSelectedDiaryData,
  )
  const [trigger] = useLazyGetAllDiariesUsersQuery()

  const [deleteDiaryErrorData, setdeleteDiaryErrorData] = useState(null)

  const { setIsOpen } = props
  const { enqueueSnackbar } = useSnackbar()

  const [
    deleteDiary,
    {
      // data: deleteDiaryData,
      isSuccess: isdeleteDiarySuccess,
      isError: isdeleteDiaryError,
      error: deleteDiaryError,
      isLoading: isdeleteDiaryLoading,
    },
  ] = useDeleteDiaryMutation()

  useEffect(() => {
    if (isdeleteDiaryError && deleteDiaryErrorData) {
      let deleteDiaryErrorDataObj: any = deleteDiaryError
      setdeleteDiaryErrorData(deleteDiaryErrorDataObj?.data?.errors)
    } else if (isdeleteDiarySuccess) {
      enqueueSnackbar("Deleting diary is successfull!", { variant: "success" })
      trigger(false)
      setIsOpen(false)
    }
  }, [
    isdeleteDiaryError,
    deleteDiaryError,
    deleteDiaryErrorData,
    isdeleteDiarySuccess,
    enqueueSnackbar,
    trigger,
    setIsOpen,
  ])

  return (
    <div>
      <Alert sx={{ mt: "1rem" }} severity="warning">
        Are you sure you want to delete diary : {selectedDiaryData?.header}
      </Alert>
      <LoadingButton
        loading={isdeleteDiaryLoading}
        type="submit"
        variant="outlined"
        sx={{
          mt: ".5rem",
          width: "100%",
          marginInline: "auto",
        }}
        onClick={() => {
          deleteDiary({
            id: selectedDiaryData?.id,
          })
        }}
      >
        Delete
      </LoadingButton>
    </div>
  )
}

export default DeleteDiaryForm

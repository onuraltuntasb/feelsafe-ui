import { forwardRef, useEffect, useState } from "react"
import { ModalBaseType } from "../types/types"
import { Box, styled } from "@mui/system"
import Fade from "@mui/material/Fade"
import { Divider, IconButton, Modal, SxProps } from "@mui/material"
import { Close } from "@mui/icons-material"

export default function ModalBase(props: ModalBaseType) {
  let {
    isOpen,
    setIsOpen,
    modalHeader,
    childComp,
    modalTop,
    modalWidth,
    modalHeight,
  } = props

  //NOTE: strict theme type is unnecessary but if some generic way to restrict
  //props as just get style stuff, it would be good
  const style: SxProps<any> | undefined = theme => ({
    position: "absolute",
    top: modalTop,
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: modalWidth ? modalWidth : 400,
    height: modalHeight ? modalHeight : "auto",
    borderRadius: ".75rem",
    textAlign: "center",
    padding: "1rem 2rem 1.5rem 2rem",
    backgroundColor: theme.palette.mode === "dark" ? "#0A1929" : "white",
    boxShadow: `0rem .125rem 1.5rem ${theme.palette.mode === "dark" ? "#000" : "#383838"}`,
    maxHeight: "98vh",
  })

  const [open, setOpen] = useState<boolean>(false)

  const handleClose = (reason: string) => {
    if (reason && reason === "backdropClick" && "escapeKeyDown") return
    setOpen(false)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen !== null && isOpen !== undefined) {
      setOpen(isOpen)
    }
  }, [isOpen])

  return (
    <div>
      <StyledModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableScrollLock={false}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {modalHeader ? (
              <span
                style={{
                  marginTop: "8px",
                  fontSize: "1.25rem",
                  textAlign: "center",
                }}
                id="transition-modal-title"
              >
                {modalHeader}
              </span>
            ) : null}

            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ position: "absolute", top: "8px", right: 0 }}
            >
              <Close />
            </IconButton>

            <Divider />
            {childComp}
          </Box>
        </Fade>
      </StyledModal>
    </div>
  )
}

const Backdrop = forwardRef((props: { open: boolean }, ref: any) => {
  const { open, ...other } = props
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  )
})

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: block;
  align-items: center;
  justify-content: center;
`

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`

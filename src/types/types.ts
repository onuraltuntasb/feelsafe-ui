import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react"

export type DiaryFormProps = {
  operationType?: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setSelectedProp: Dispatch<SetStateAction<readonly number[]>>
}

export type AppbarProps = {
  setleftMenuOpen?: Dispatch<SetStateAction<boolean>>
  leftMenuOpenState?: boolean
  position?: string
}

export type ModalBaseType = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  modalHeader: string
  childComp: ReactNode
  modalTop: string
  modalWidth: string
  modalHeight: string
}

export type PrivateRouteProps = {
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | readonly ReactElement<any, string | JSXElementConstructor<any>>[]
  notRedirect: boolean
}

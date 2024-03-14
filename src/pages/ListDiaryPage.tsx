import * as React from "react"
import { useLazyGetAllDiariesUsersQuery } from "../redux/services/diaryApi"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../redux/hooks"
import { sendSelectedDiaryData } from "../redux/features/diarySlice"
import { alpha } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import { visuallyHidden } from "@mui/utils"
import EditIcon from "@mui/icons-material/Edit"
import AddEditDiaryForm from "../comps/forms/AddEditDiaryForm"
import ModalBase from "../comps/ModalBase"
import DeleteDiaryForm from "../comps/forms/DeleteDiaryForm"
import { AddCircle } from "@mui/icons-material"

interface Data {
  id: number
  header: string
  content: string
  createdAt: string
  updatedAt: string
}

function createData(
  id: number,
  header: string,
  content: string,
  createdAt: string,
  updatedAt: string,
): Data {
  return {
    id,
    header,
    content,
    createdAt,
    updatedAt,
  }
}

type Order = "asc" | "desc"

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: "header",
    numeric: false,
    disablePadding: true,
    label: "Header",
  },
  {
    id: "content",
    numeric: true,
    disablePadding: false,
    label: "Content",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Created At",
  },
  {
    id: "updatedAt",
    numeric: true,
    disablePadding: false,
    label: "Updated At",
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: readonly number[]
  setIsOpenProp: any
  setOperationType: any
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected, setIsOpenProp, setOperationType } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Diaries
        </Typography>
      )}
      <Tooltip title="Add">
        <IconButton
          onClick={() => {
            setIsOpenProp(true)
            setOperationType("add")
          }}
        >
          <AddCircle />
        </IconButton>
      </Tooltip>
      {selected?.length === 1 ? (
        <>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setIsOpenProp(true)
                setOperationType("delete")
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setIsOpenProp(true)
                setOperationType("edit")
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Toolbar>
  )
}
export default function ListDiaryPage() {
  const dispatch = useAppDispatch()
  const [trigger, { data: diaryListData }] = useLazyGetAllDiariesUsersQuery()

  useEffect(() => {
    trigger(false)
  }, [])

  useEffect(() => {
    if (diaryListData) {
      let temp: any = []
      diaryListData.forEach((el: any) => {
        temp = [
          ...temp,
          createData(el.id, el.header, el.content, el.createdAt, el.updatedAt),
        ]
      })
      setRows(temp)
    }
  }, [diaryListData])

  const [rows, setRows] = useState<any>([])
  const [order, setOrder] = useState<Order>("asc")
  const [orderBy, setOrderBy] = useState<keyof Data>("header")
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [operationType, setOperationType] = useState<string>("add")

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n: any) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setIsOpenProp={setIsOpen}
          setOperationType={setOperationType}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows &&
                rows.map((row: any, index: any) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => {
                        handleClick(event, row.id)
                        dispatch(sendSelectedDiaryData(row))
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.header}
                      </TableCell>
                      <TableCell align="right">{row.content}</TableCell>
                      <TableCell align="right">
                        {new Date(row.createdAt)?.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {new Date(row.updatedAt)?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* {diaryListData ? JSON.stringify(diaryListData) : null}
      <br />
      {JSON.stringify(selected)} */}

      <ModalBase
        modalHeader={
          operationType[0].toUpperCase() +
          operationType.slice(1, operationType.length) +
          " " +
          "Operation"
        }
        modalTop={operationType === "delete" ? "20%" : "50%"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalWidth={operationType !== "delete" ? "800px" : "400px"}
        modalHeight={operationType !== "delete" ? "98vh" : "auto"}
        childComp={
          operationType !== "delete" ? (
            <AddEditDiaryForm
              setSelectedProp={setSelected}
              setIsOpen={setIsOpen}
              operationType={operationType}
            />
          ) : (
            <DeleteDiaryForm
              setSelectedProp={setSelected}
              setIsOpen={setIsOpen}
            ></DeleteDiaryForm>
          )
        }
      />
    </Box>
  )
}

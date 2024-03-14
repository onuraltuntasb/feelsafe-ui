import {
  Divider,
  Drawer,
  Fade,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material"
import Appbar from "../comps/Appbar"
import { useEffect, useState } from "react"
import { AddCircleOutline } from "@mui/icons-material"
import { Outlet, useNavigate } from "react-router-dom"
import { useTheme } from "@emotion/react"

export const StyledListItemButton = styled(ListItemButton)<ListItemButtonProps>(
  () => ({
    borderRadius: "0.625rem",
    //TODO: dark mode font color
  }),
)

const DashboardPage = () => {
  const navigate = useNavigate()
  const theme: any = useTheme()

  const [leftMenuOpen, setleftMenuOpen] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState("/diary")
  const [newRoute, setNewRoute] = useState("")

  useEffect(() => {
    if (window.location.href.split("/").pop() === "dashboard") {
      navigate("/dashboard/diary")
    }
    if (window.innerWidth <= 768) {
      setleftMenuOpen(false)
      console.log("window innerWidth :", window.innerWidth)
    }
    mountRouteSelection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (newRoute) {
      let selectedEl = document.getElementById(selectedRoute)
      if (selectedEl) {
        selectedEl.style.backgroundColor = ""
      }

      let newEl = document.getElementById(newRoute)
      if (newEl) {
        newEl.style.backgroundColor =
          theme.palette.mode === "light"
            ? theme.palette.primary.light
            : theme.palette.primary.dark
        setSelectedRoute(newRoute)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRoute])

  const mountRouteSelection = () => {
    let url = window.location.href
    let route = url?.split("dashboard").pop()
    if (route) {
      setSelectedRoute(route)
      console.log("route :", route)
      let selectedEl = document.getElementById(route)
      if (selectedEl) {
        selectedEl.style.backgroundColor =
          theme.palette.mode === "light"
            ? theme.palette.primary.light
            : theme.palette.primary.dark
      }
    }
  }

  return (
    <>
      <Appbar
        setleftMenuOpen={setleftMenuOpen}
        leftMenuOpenState={leftMenuOpen}
        position={"static"}
      />

      <div>
        <Fade in={leftMenuOpen}>
          <Drawer
            sx={{
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "15rem",
                boxSizing: "border-box",
                marginTop: "6.25rem",
                borderRadius: ".625rem",
                bgcolor: "transparent",
                marginLeft: ".25rem",
                boxShadow:
                  "0rem .125rem .25rem -0.0625rem rgba(0,0,0,0.2), 0rem .25rem .3125rem 0rem rgba(0,0,0,0.14), 0rem .0625rem .625rem 0rem rgba(0,0,0,0.12)",
              },
            }}
            variant="persistent"
            anchor="left"
            open={leftMenuOpen}
          >
            <ListItem>
              <StyledListItemButton
                id="/diary"
                onClick={() => {
                  navigate("/dashboard/diary")
                  setNewRoute("/diary")
                }}
              >
                <ListItemIcon>
                  <AddCircleOutline />
                </ListItemIcon>
                <ListItemText primary="Diaries" />
              </StyledListItemButton>
            </ListItem>
            <Divider />
          </Drawer>
        </Fade>

        <div
          className={leftMenuOpen ? "main-content" : "main-content-expanded"}
        >
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardPage

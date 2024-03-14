import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../redux/hooks"
import { sendAuthUserData } from "../redux/features/authSlice"
import { useSnackbar } from "notistack"
import { AppbarProps } from "../types/types"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import { Avatar, IconButton } from "@mui/material"
import feelsafe from "../assets/feelsafe-logo.png"

function Appbar(props: AppbarProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const logoStyle = {
    marginBottom: ".375rem",
    width: "8.75rem",
    height: "auto",
    cursor: "pointer",
  }

  const [open, setOpen] = useState<boolean>(false)
  const [auth, setAuth] = useState<string>("")
  const [dashboardSidebar, setDashboardSidebar] = useState<boolean>(true)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
    if (window.location.href.includes("dashboard")) {
      setDashboardSidebar(true)
    } else {
      setDashboardSidebar(false)
    }

    let auth = localStorage.getItem("feelsafe-auth-infos")
    if (auth) {
      setAuth(auth)
    }
  }, [])

  async function fetchLogout() {
    try {
      let response = await fetch("/api/user/logout")
      if (response.status === 200) {
        let data = await response.text()
        if (data === "true") {
          dispatch(sendAuthUserData(null))
          navigate("/signin")
          enqueueSnackbar("Log out successfull!", { variant: "success" })
          localStorage.removeItem("feelsafe-auth-infos")
        }
      }
    } catch (error) {
      enqueueSnackbar("Log out error!", { variant: "error" })
    }
  }

  return (
    <div>
      <Container>
        <AppBar
          sx={{
            marginTop: "1rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            borderRadius: "62.4375rem",
            bgcolor: "transparent",
            backdropFilter: "blur(1.5rem)",
          }}
          position={"fixed"}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {dashboardSidebar ? (
                <IconButton
                  sx={{ marginBottom: ".375rem", marginRight: ".5rem" }}
                  color="primary"
                  aria-label="open drawer"
                  onClick={() => {
                    if (props?.setleftMenuOpen !== undefined) {
                      props?.setleftMenuOpen(!props?.leftMenuOpenState)
                    }
                  }}
                  edge="start"
                >
                  <MenuIcon />
                </IconButton>
              ) : null}

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  ml: "-1.125rem",
                }}
              >
                <img src={feelsafe} style={logoStyle} alt="logo of sitemark" />
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <MenuItem
                    //onClick={() => scrollToSection('features')}
                    sx={{ px: ".75rem" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Features
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    //onClick={() => scrollToSection('testimonials')}
                    sx={{ py: ".375rem", px: ".75rem" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Testimonials
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    //onClick={() => scrollToSection('highlights')}
                    sx={{ py: ".375rem", px: ".75rem" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Highlights
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    //onClick={() => scrollToSection('pricing')}
                    sx={{ py: ".375rem", px: ".75rem" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Pricing
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    //onClick={() => scrollToSection('faq')}
                    sx={{ py: ".375rem", px: ".75rem" }}
                  >
                    <Typography variant="body2" color="text.primary">
                      FAQ
                    </Typography>
                  </MenuItem>
                </Box>
              </Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
                {auth ? (
                  <>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      component="a"
                      onClick={() => {
                        fetchLogout()
                      }}
                    >
                      Log out
                    </Button>
                    <IconButton
                      onClick={() => {
                        navigate("/dashboard/account")
                      }}
                      sx={{ p: 0 }}
                    >
                      <Avatar
                        alt={auth.slice(0, 1).toUpperCase()}
                        src="/static"
                      />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      variant="text"
                      size="small"
                      component="a"
                      onClick={() => {
                        navigate("/signin")
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      component="a"
                      onClick={() => {
                        navigate("/signup")
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </Box>
              <Box sx={{ display: { sm: "", md: "none" } }}>
                <Button
                  variant="text"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ minWidth: "1.875rem", p: ".25rem" }}
                >
                  <MenuIcon />
                </Button>
                <Drawer
                  anchor="right"
                  open={open}
                  onClose={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      minWidth: "60dvw",
                      p: 2,
                      backgroundColor: "background.paper",
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                        flexGrow: 1,
                      }}
                    >
                      {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
                    </Box>
                    <MenuItem>
                      <IconButton
                        onClick={() => {
                          navigate("/dashboard/account")
                        }}
                        sx={{ p: 0 }}
                      >
                        <Avatar
                          alt={auth.slice(0, 1).toUpperCase()}
                          src="/static"
                        />
                      </IconButton>
                      <Button
                        sx={{ position: "absolute", right: 0 }}
                        color="primary"
                        variant="contained"
                        size="small"
                        component="a"
                        onClick={() => {
                          fetchLogout()
                        }}
                      >
                        Log out
                      </Button>
                    </MenuItem>
                    <MenuItem>Features</MenuItem>
                    <MenuItem>Testimonials</MenuItem>
                    <MenuItem>Highlights</MenuItem>
                    <MenuItem>Pricing</MenuItem>
                    <MenuItem>FAQ</MenuItem>
                    <Divider />
                  </Box>
                </Drawer>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Container>
    </div>
  )
}
export default Appbar

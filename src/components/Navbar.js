import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Button,
  Container,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { connect } from "react-redux";
import { signOut } from "../redux/actions/authenticationActions";
import { useLocation } from "react-router-dom"

const Navbar = ({ loggedIn, signedInEmail, signOut, signoutError }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation()
  useEffect(() => {
    setPath(location.pathname)
  }, [location])

  const [path, setPath] = useState(location);
  return (
    <Container sx={{ pb: 8 }}>
      <Box sx={{ display: "flex", textAlign: "center" }}>
        <Box sx={{ minWidth: 100 }}>
          <Button
            variant="text"
            component={Link}
            to="/"
            sx={{ bgcolor: path === "/" ? "lightblue" : undefined }}
          >
            Home
          </Button>
        </Box>

        <Box sx={{ minWidth: 100 }}>
          <Button
            variant="text"
            component={Link}
            to="/details"
            sx={{ bgcolor: path === "/details" ? "lightblue" : undefined }}
          >
            Details
          </Button>
        </Box>

        <Box sx={{ minWidth: 100 }}>
          <Button
            variant="text"
            component={Link}
            to="/compare"
            sx={{ bgcolor: path === "/compare" ? "lightblue" : undefined }}
          >
            Comparison
          </Button>
        </Box>
        <Box sx={{ minWidth: 100, marginLeft: "auto" }}>
          {loggedIn ? (
            <span>
              <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, margin: "0 10px 0 0" }}>
                    {signedInEmail.substring(0, 1)}
                  </Avatar>
                  {signedInEmail.substring(0, signedInEmail.lastIndexOf("@"))}
                </IconButton>
              </Tooltip>
            </span>
          ) : (
            <span className="loginNavBar">
              {signoutError ? { signoutError } : <span></span>}
              <Button
                variant="text"
                component={Link}
                to="/account"
                sx={{ bgcolor: path === "/account" ? "lightblue" : undefined }}
              >
                Sign in
              </Button>
            </span>
          )}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem component={Link} to="/account">
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => signOut()} variant="text">
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedIn: !state.firebase.auth.isEmpty,
    signedInEmail: state.firebase.auth.email,
    signoutError: state.authentication.signoutError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

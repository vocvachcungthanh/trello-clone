import React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

// Icons
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { useSelector, useDispatch } from "react-redux";
import { useConfirm } from "material-ui-confirm";

import { selectCurrentUser, logoutUserAPI } from "~/redux/user/userSlice";

function Profiles() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const confirmLogout = useConfirm();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // logout đăng xuất

  const handleLogout = () => {
    confirmLogout({
      title: "Log out of your account?",
      confirmationText: "confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch(logoutUserAPI());
      })
      .catch(() => {});
  };
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "basic-menu-profile" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 34, height: 34 }}
            alt="vvct"
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profile",
        }}
      >
        <MenuItem
          sx={{
            "&:hover": {
              color: "success.light",
            },
          }}
        >
          <Avatar
            sx={{ width: 25, height: 25, mr: 2 }}
            src={currentUser?.avatar}
          />{" "}
          Profile
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              color: "warning.dark",
              "& .logout-icon": { color: "warning.dark" },
            },
          }}
        >
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Profiles;

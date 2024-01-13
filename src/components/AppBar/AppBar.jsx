import React from "react";

import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import { ReactComponent as TrelloIcon } from "~/assets/trello.svg";
import { ModeSelect } from "~/components/ModeSelect";
import Workspaces from "./Menus/Workspaces";
import Recents from "./Menus/Recents";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Profiles from "./Menus/Profiles";
import CloseIcon from "@mui/icons-material/Close";

function AppBar() {
  const [searchValue, setSearchValue] = React.useState("");

  const renderClose = React.useMemo(() => {
    if (searchValue.length > 0) {
      return (
        <CloseIcon
          sx={{ color: "white", fontSize: "small", cursor: "pointer" }}
          onClick={() => setSearchValue("")}
        />
      );
    }
  }, [searchValue]);

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        px: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
        "&::-webkit-scrollbar-track": {
          m: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AppsIcon sx={{ color: "white" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <SvgIcon
            component={TrelloIcon}
            viewBox="0 0 24 24"
            fontSize="small"
            sx={{ color: "white" }}
          />
          <Typography
            variant="span"
            sx={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Trello
          </Typography>
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            gap: 1,
          }}
        >
          <Workspaces />
          <Recents />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: "white",
            }}
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          id="outlined-search"
          label="Search field ..."
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: renderClose,
          }}
          sx={{
            minWidth: 120,
            maxWidth: 180,
            "& label": {
              color: "white",
            },
            "& input": {
              color: "white",
            },

            "& label.Mui-focused": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
        />

        <ModeSelect />

        <Tooltip title="Notifications">
          <Badge
            color="warning"
            variant="dot"
            sx={{
              cursor: "pointer",
            }}
          >
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon
            sx={{
              cursor: "pointer",
              color: "white",
            }}
          />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;

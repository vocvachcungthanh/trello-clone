import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Tooltip } from "@mui/material";

const MENU_STYLES = {
  color: "white",
  bgcolor: "transparent",
  px: "5px",
  border: "none",
  borderRadius: "5px",
  ".MuiSvgIcon-root": {
    color: "white",
  },

  "&:hover": {
    bgcolor: "primary.50",
  },
};

function BoardBar() {
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 2,

        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#31495e" : "#1976d2",

        "&::-webkit-scrollbar-track": {
          m: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="vocvachungthanh MERN Stack board"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Dirver"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "white",
            },
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              cursor: "pointer",
              "&:first-of-type": {
                bgcolor: "#a4b0de",
              },
            },
          }}
        >
          <Tooltip title="vvct">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/410352623_1526773314767571_3335901399217478063_n.jpg?_nc_cat=107&cb=99be929b-b574a898&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=Gfj7s3d3NDUAX-Pzz4O&_nc_ht=scontent.fhan14-1.fna&oh=00_AfCeEwb3zCFV536OPrsMBP6xOye0Yww3Ldz4nG_6G-FimA&oe=65A4908C"
            />
          </Tooltip>
          <Tooltip title="Mèo Tiên">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/400695097_307957682173606_2041368810858718566_n.jpg?_nc_cat=109&cb=99be929b-b574a898&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=3hoKZdYWxloAX9Tgfo3&_nc_ht=scontent.fhan14-4.fna&oh=00_AfC2oalIQografgLdhfrSBRXIBInOzMD1OQzoPHP74kG1g&oe=65A5F7CF"
            />
          </Tooltip>
          <Tooltip title="Lan Anh">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/415523494_3770486003196197_1561579831201851721_n.jpg?stp=c0.0.480.480a_dst-jpg_p480x480&_nc_cat=107&cb=99be929b-b574a898&ccb=1-7&_nc_sid=5740b7&_nc_ohc=08eIvKKDNRQAX-kXIJx&_nc_ht=scontent.fhan14-1.fna&oh=00_AfCp5YfCCVUnJ34yzN96hMLB2BdjentCjGWyMQFTmSi4zw&oe=65A68976"
            />
          </Tooltip>
          <Tooltip title="Thanh Hà">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/354449489_1662364807523801_1662695671078830825_n.jpg?stp=dst-jpg_p480x480&_nc_cat=111&cb=99be929b-b574a898&ccb=1-7&_nc_sid=5740b7&_nc_ohc=-wvnqWu5Q5sAX_ozJop&_nc_ht=scontent.fhan14-4.fna&oh=00_AfDDPQiO6VPLP30PMZajuBR00mtzIhY7EeW7PJdeQocsMQ&oe=65A6FBBC"
            />
          </Tooltip>
          <Tooltip title="Xuân Phong">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/414426857_2670829179740111_2558553744658634849_n.jpg?stp=dst-jpg_s480x480&_nc_cat=101&cb=99be929b-b574a898&ccb=1-7&_nc_sid=5740b7&_nc_ohc=-aKQJhizktUAX8Old2r&_nc_ht=scontent.fhan14-1.fna&oh=00_AfBqf5kA_o0wagKzXWrMc4xXmbVcyxvYv0miKZU5hHl8LQ&oe=65A5B0B4"
            />
          </Tooltip>
          <Tooltip title="Lan Khương">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/409419623_1068324281184206_7418602399253170342_n.jpg?stp=dst-jpg_s480x480&_nc_cat=111&cb=99be929b-b574a898&ccb=1-7&_nc_sid=5740b7&_nc_ohc=diHcvp6-qcUAX8H-FPb&_nc_ht=scontent.fhan14-4.fna&oh=00_AfDInWBPDv0I-BKTWFgI93Z8a25gcUKTr9RJbchgc8zZDA&oe=65A5647C"
            />
          </Tooltip>
          <Tooltip title="vvct">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/417194717_1444216002825965_1959605569311359115_n.jpg?stp=dst-jpg_p480x480&_nc_cat=111&cb=99be929b-b574a898&ccb=1-7&_nc_sid=5740b7&_nc_ohc=8r0H5p7OgwIAX8xJnBh&_nc_ht=scontent.fhan14-4.fna&oh=00_AfCTO76bNLmHmGXmryY-eQdQ6-0SoNFrLuuYnjDfR2n0xA&oe=65A66EE8"
            />
          </Tooltip>
          <Tooltip title="vvct">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/393681203_3664668433822054_1889772834557786657_n.jpg?_nc_cat=100&cb=99be929b-b574a898&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=ytPpFGdwMjAAX9mbuRW&_nc_ht=scontent.fhan14-2.fna&oh=00_AfC4IFOVqHdLVAsu4ucZuqbJaLlpkZOO4GCT2Bp7FiGVfw&oe=65A5F0F2"
            />
          </Tooltip>
          <Tooltip title="vvct">
            <Avatar
              alt="vvct"
              src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/410352623_1526773314767571_3335901399217478063_n.jpg?_nc_cat=107&cb=99be929b-b574a898&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=Gfj7s3d3NDUAX-Pzz4O&_nc_ht=scontent.fhan14-1.fna&oh=00_AfCeEwb3zCFV536OPrsMBP6xOye0Yww3Ldz4nG_6G-FimA&oe=65A4908C"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;

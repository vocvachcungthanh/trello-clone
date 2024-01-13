import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import NoteAddIcon from "@mui/icons-material/NoteAdd";

import { Column } from "./Column";

const LIST_COLUMNS_STYLES = {
  bgcolor: "inherit",
  width: "100%",
  height: "100%",
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  gap: 2,
  px: 2,
  "&::-webkit-scrollbar-track": {
    m: 2,
  },
};

function ListColumns() {
  return (
    <Box sx={LIST_COLUMNS_STYLES}>
      <Column />
      <Box
        sx={{
          minWidth: "200px",
          maxWidth: "200px",
          borderRadius: "6px",
          height: "fit-content",
          bgcolor: "#ffffff3d",
        }}
      >
        <Button
          startIcon={<NoteAddIcon />}
          sx={{
            color: "white",
            width: "100%",
            justifyContent: "flex-start",
            pl: 2.5,
            py: 1,
          }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  );
}

export default ListColumns;

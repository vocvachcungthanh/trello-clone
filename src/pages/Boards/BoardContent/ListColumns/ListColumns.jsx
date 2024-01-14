import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import NoteAddIcon from "@mui/icons-material/NoteAdd";

import { Column } from "./Column";
import { useMemo } from "react";

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

function ListColumns({ columns }) {
  const renderColumn = useMemo(() => {
    return columns?.map((item) => <Column key={item._id} column={item} />);
  }, [columns]);

  return (
    <Box sx={LIST_COLUMNS_STYLES}>
      {renderColumn}
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

import Box from "@mui/material/Box";
import { ListColums } from "./ListColumns";

const BOARD_CONTENT_STYLES = {
  backgroundColor: (theme) =>
    theme.palette.mode === "dark" ? "#344954" : "#1976d2",
  width: "100%",
  height: (theme) => theme.trello.boardContentHeight,
  p: "10px 0",
};

function BoardContent() {
  return (
    <Box sx={BOARD_CONTENT_STYLES}>
      <ListColums />
    </Box>
  );
}

export default BoardContent;

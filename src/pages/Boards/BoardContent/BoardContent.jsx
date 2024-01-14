import Box from "@mui/material/Box";
import { ListColums } from "./ListColumns";
import { mapOrder } from "~/utils/sorts.js";

const BOARD_CONTENT_STYLES = {
  backgroundColor: (theme) =>
    theme.palette.mode === "dark" ? "#344954" : "#1976d2",
  width: "100%",
  height: (theme) => theme.trello.boardContentHeight,
  p: "10px 0",
};

function BoardContent({ board }) {
  const orderedColums = mapOrder(board.columns, board.columnOrderIds, "_id");

  return (
    <Box sx={BOARD_CONTENT_STYLES}>
      <ListColums columns={orderedColums} />
    </Box>
  );
}

export default BoardContent;

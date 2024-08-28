import React from "react";

import Container from "@mui/material/Container";

import { AppBar } from "~/components/AppBar";
import { BoardBar } from "./BoardBar";
import { BoardContent } from "./BoardContent";

// api
import { fetchBoardDetailAPI } from "~/apis";

function Board() {
  const [board, setBoard] = React.useState(null);

  React.useEffect(() => {
    const boardId = "66cf410e2abd4dfa2dbe589b";
    fetchBoardDetailAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}

export default Board;

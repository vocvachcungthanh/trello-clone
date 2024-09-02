import React from "react";

import Container from "@mui/material/Container";

import { AppBar } from "~/components/AppBar";
import { BoardBar } from "./BoardBar";
import { BoardContent } from "./BoardContent";
import { generatePalaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";

// api
import {
  createNewColumnAPI,
  fetchBoardDetailAPI,
  createNewCardAPI,
} from "~/apis";

function Board() {
  const [board, setBoard] = React.useState(null);

  React.useEffect(() => {
    const boardId = "66d3ddacc467f451c060e5d4";
    fetchBoardDetailAPI(boardId).then((board) => {
      // Keo tha vao 1 column Rỗng

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePalaceholderCard(column)];
          column.cardOrderIds = [generatePalaceholderCard(column)._id];
        }
      });
      setBoard(board);
    });
  }, []);

  // createNewColumn này có nhiện vụ gọi API tạo mới Column và làm mới lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    createdNewColumn.cards = [generatePalaceholderCard(createdNewColumn)];
    createdNewColumn.cardOrderIds = [
      generatePalaceholderCard(createdNewColumn)._id,
    ];

    const newBoard = { ...board };

    newBoard.columns.push(createdNewColumn);
    newBoard.columnOrderIds.push(createdNewColumn._id);

    setBoard(newBoard);
  };

  // createNewColumn này có nhiện vụ gọi API tạo mới Column và làm mới lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdNewCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    const newBoard = { ...board };

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdNewCard.columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards.push(createdNewCard);
      columnToUpdate.cardOrderIds.push(createdNewCard._id);
    }
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  );
}

export default Board;

import React from "react";

import Container from "@mui/material/Container";

import { AppBar } from "~/components/AppBar";
import { BoardBar } from "./BoardBar";
import { BoardContent } from "./BoardContent";
import { generatePalaceholderCard } from "~/utils/formatters";
import { isEmpty } from "lodash";
import { mapOrder } from "~/utils/sorts.js";

// api
import {
  createNewColumnAPI,
  fetchBoardDetailAPI,
  createNewCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function Board() {
  const [board, setBoard] = React.useState(null);

  React.useEffect(() => {
    const boardId = "66d7415119318bb6a7007e3b";
    fetchBoardDetailAPI(boardId).then((board) => {
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Keo tha vao 1 column Rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePalaceholderCard(column)];
          column.cardOrderIds = [generatePalaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");
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

  // moveColumn

  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;

    newBoard.columnOrderIds = dndOrderedColumnsIds;

    setBoard(newBoard);

    // goi api uplodate board

    await updateBoardDetailAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  // moveCardInTheSameColumn xử lý dịch chuyển card trong cùng column
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chưa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = async (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Update cho chuẩn set board

    const newBoard = { ...board };

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    setBoard(newBoard);

    // Goi Api update column

    await updateColumnDetailAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };

  /**
   * Khi di chuyển card sang Column khác:
   * B1: Cập nhật mảng  của column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
   * B2. Cập nhật mản cardOrderIds của column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
   * B3. Cập nhật lại trương columnId mới của cái Card đã kéo
   * => Làm một API support riêng
   */
  const moveCardToDifferentColumn = async (
    currenCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;

    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Goi API xủ lý

    // xóa placeholder-card

    const removePlaceholderCard = (cardOrderIds) => {
      if (cardOrderIds.includes("placeholder-card")) {
        return cardOrderIds;
      } else {
        return [];
      }
    };

    await moveCardToDifferentColumnAPI({
      currenCardId,
      prevColumnId,
      prevCardOrderIds: removePlaceholderCard(
        dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
      ),
      nextColumnId,
      nextCardOrderIds: removePlaceholderCard(
        dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
      ),
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;

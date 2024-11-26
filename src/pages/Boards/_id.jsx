import React from "react";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { useParams } from "react-router-dom";

import { AppBar } from "~/components/AppBar";
import { BoardBar } from "./BoardBar";
import { BoardContent } from "./BoardContent";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";

import {
  fetchBoardDetailAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";

// api
import {
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardToDifferentColumnAPI,
} from "~/apis";

function Board() {
  const dispatch = useDispatch();

  const board = useSelector(selectCurrentActiveBoard);

  const { boardId } = useParams();

  React.useEffect(() => {
    // const boardId = "6723af75e1476bf9a55e3ce7";

    dispatch(fetchBoardDetailAPI(boardId));
  }, [dispatch, boardId]);

  // moveColumn

  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;

    newBoard.columnOrderIds = dndOrderedColumnsIds;

    dispatch(updateCurrentActiveBoard(newBoard));

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

    const newBoard = cloneDeep(board);

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    dispatch(updateCurrentActiveBoard(newBoard));

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
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

    const newBoard = { ...board };

    newBoard.columns = dndOrderedColumns;

    newBoard.columnOrderIds = dndOrderedColumnsIds;

    dispatch(updateCurrentActiveBoard(newBoard));

    // Goi API xủ lý
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;

    let nextCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === nextColumnId
    )?.cardOrderIds;

    // xóa placeholder-card placeholder-card
    prevCardOrderIds = prevCardOrderIds.filter(
      (id) => !id.includes("placeholder-card")
    );
    nextCardOrderIds = nextCardOrderIds.filter(
      (id) => !id.includes("placeholder-card")
    );

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds,
    });
  };

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />;
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;

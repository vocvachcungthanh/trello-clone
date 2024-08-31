/* eslint-disable indent */
import React from "react";

import Box from "@mui/material/Box";

// thư viện kéo thả
import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  closestCorners,
  getFirstCollision,
} from "@dnd-kit/core";

import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";

import { ListColums } from "./ListColumns";
import { Column } from "./ListColumns/Column";
import { Card } from "./ListColumns/Column/ListCards/Card";
import { mapOrder } from "~/utils/sorts.js";
import { generatePalaceholderCard } from "~/utils/formatters";

const BOARD_CONTENT_STYLES = {
  backgroundColor: (theme) =>
    theme.palette.mode === "dark" ? "#344954" : "#1976d2",
  width: "100%",
  height: (theme) => theme.trello.boardContentHeight,
  p: "10px 0",
};

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  // Yêu cầu chuội dịch chuyển 10px mới kích hoạn event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  // Nhân giữ 250ms và dung sia của cảm ứng (dễ hiểu là di chuyển/ chênh lệch 500px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = React.useState([]);
  const [activeDragItemId, setActiveDragItemId] = React.useState(null);
  const [activeDragItemType, setActiveDrageItemType] = React.useState(null);
  const [activeDragItemData, setActiveDragItemData] = React.useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    React.useState(null);

  // Điểm va chạm cuối cùng trước đó
  const lastOverId = React.useRef(null);

  React.useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  const moveCardBetweenDifferentColums = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card?._id === overCardId
      );

      let newCardIndex;

      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.lenght + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column?._id === activeColumn?._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column?._id === overColumn?._id
      );

      if (nextActiveColumn) {
        //
        nextActiveColumn.cards = nextActiveColumn?.cards.filter(
          (card) => card?._id !== activeDraggingCardId
        );

        // thêm placeholde car nếu column rỗng

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePalaceholderCard(nextActiveColumn)];
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card?._id
        );
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn?.cards.filter(
          (card) => card?._id !== activeDraggingCardId
        );

        const rebuild_activeGraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeGraggingCardData
        );

        // Xóa placeholer Card di nếu nó tồn tại

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card?._id
        );
      }

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDrageItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );

    setActiveDragItemData(event?.active?.data?.current);

    // Nều là card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // Trigger trong qúa trình kéo (drag) một phần tử
  const handleDrgOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    const { active, over } = event;

    if (!active || !over) return;

    // activeGraggingCardId: Laf card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn?._id !== overColumn?._id) {
      moveCardBetweenDifferentColums(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Xử lý kẻo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: Là cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;

      // overCard: Là cái card đang tương tác trên hoặc hoặc dưới so với card được kéo ở trên
      const { id: overCardId } = over;

      // Tìm 2 cái colums theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // Nếu không tồn tại thì không làm gì hết
      if (!activeColumn || !overColumn) return;

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Hành động kéo thả card giữa 2 column khác nhau
        moveCardBetweenDifferentColums(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // lấy vị trị cũ (từ thăng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );

        // lấy vị trí mới
        const newCaridIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );

        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCaridIndex
        );

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);

          //Tìm tới colums đang thang

          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );

          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }

    // Xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Kiểm tra nếu không tồn tài over khi khéo thả linh tinh
      if (!active || !over) return;

      // Nếu vị trí over tồn tại thì xử lý
      if (active.id !== over.id) {
        // lấy vị trị cũ
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );

        // lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );

        // / Cái này sau dùng để gọi api
        // const dndOrderedColumsIds = dndOrderedColumns.map((c) => c._id);

        // set lại khi kéo thả
        return setOrderedColumns(dndOrderedColumns);
      }
    }

    // Nhữ dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemData(null);
    setActiveDrageItemType(null);
    setActiveDragItemId(null);
    setOldColumnWhenDraggingCard(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: 0.5,
        },
      },
    }),
  };

  const collisionDetectionStrategy = React.useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      const pointerCollisions = pointerWithin(args);

      if (!pointerCollisions?.length) return;

      let overId = getFirstCollision(pointerCollisions, "id");

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column?._id === overId
        );

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container?.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      return lastOverId.current
        ? [
            {
              id: lastOverId.current,
            },
          ]
        : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragMove={handleDrgOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={BOARD_CONTENT_STYLES}>
        <ListColums columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;

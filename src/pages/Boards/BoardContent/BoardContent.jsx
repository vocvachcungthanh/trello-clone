import React from "react";

import Box from "@mui/material/Box";

// thư viện kéo thả
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { ListColums } from "./ListColumns";
import { Column } from "./ListColumns/Column";
import { Card } from "./ListColumns/Column/ListCards/Card";
import { mapOrder } from "~/utils/sorts.js";

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

  React.useEffect(() => {
    setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, "_id"));
  }, [board]);

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDrageItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );

    setActiveDragItemData(event?.active?.data?.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Kiểm tra nếu không tồn tài over khi khéo thả linh tinh
    if (!over) return;

    // Nếu vị trí over tồn tại thì xử lý
    if (active.id !== over.id) {
      // lấy vị trị cũ
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);

      // lấy vị trí mới
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);

      // / Cái này sau dùng để gọi api
      // const dndOrderedColumsIds = dndOrderedColumns.map((c) => c._id);

      // set lại khi kéo thả
      return setOrderedColumns(dndOrderedColumns);
    }

    setActiveDragItemData(null);
    setActiveDrageItemType(null);
    setActiveDragItemId(null);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Box sx={BOARD_CONTENT_STYLES}>
        <ListColums columns={orderedColumns} />
        <DragOverlay>
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

import React from "react";

import { toast } from "react-toastify";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";

// api
import { createNewColumnAPI } from "~/apis";
import { generatePlaceholderCard } from "~/utils/formatters";
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";

import { Column } from "./Column";

const LIST_COLUMNS_STYLES = {
  bgColor: "inherit",
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
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const [openNewColumnForm, setOpenNewColumnForm] = React.useState(false);
  const [newColumnTitle, setNewColumnTitle] = React.useState("");

  const toggleOpenNewColumnForm = React.useCallback(
    () => setOpenNewColumnForm(!openNewColumnForm),
    [openNewColumnForm]
  );

  const addNewColumn = React.useCallback(async () => {
    if (!newColumnTitle) {
      toast.error("Please enter Column title", {
        position: "bottom-left",
      });
      return;
    }

    const newColumnData = {
      title: newColumnTitle,
    };

    // Call API to create new column and refresh board state
    const createdNewColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    createdNewColumn.cards = [generatePlaceholderCard(createdNewColumn)];
    createdNewColumn.cardOrderIds = [
      generatePlaceholderCard(createdNewColumn)._id,
    ];

    const newBoard = cloneDeep(board); // Deep copy to maintain immutability

    newBoard.columns.push(createdNewColumn);
    newBoard.columnOrderIds.push(createdNewColumn._id);

    dispatch(updateCurrentActiveBoard(newBoard));
    toggleOpenNewColumnForm();
    setNewColumnTitle("");
  }, [board, newColumnTitle, toggleOpenNewColumnForm, dispatch]); // Dependencies

  const renderColumn = React.useMemo(() => {
    if (!columns) return null;

    return (
      columns && columns?.map((item) => <Column key={item._id} column={item} />)
    );
  }, [columns]);

  const renderFormColum = React.useMemo(() => {
    return (
      <Box
        sx={{
          minWidth: "250px",
          maxWidth: "250px",
          mx: 2,
          p: 1,
          borderRadius: "6px",
          height: "fit-content",
          bgColor: "#ffffff3d",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <TextField
          label="Enter column title ..."
          type="text"
          size="small"
          variant="outlined"
          autoFocus
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          sx={{
            "& label": {
              color: "white",
            },
            "& input": {
              color: "white",
            },

            "& label.Mui-focused": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            className="interceptor-loading"
            onClick={addNewColumn}
            variant="contained"
            color="success"
            size="small"
            sx={{
              boxShadow: "none",
              border: "0.5px solid",
              borderColor: (theme) => theme.palette.success.main,
              "&:hover": {
                bgColor: (theme) => theme.palette.success.main,
              },
            }}
          >
            Add Column
          </Button>
          <CloseIcon
            sx={{
              color: "white",
              fontSize: "small",
              cursor: "pointer",
              "&:hover": { color: (theme) => theme.palette.warning.light },
            }}
            onClick={toggleOpenNewColumnForm}
          />
        </Box>
      </Box>
    );
  }, [newColumnTitle, addNewColumn, toggleOpenNewColumnForm]);

  const renderAddNewColumn = React.useMemo(() => {
    return (
      <Box
        sx={{
          minWidth: "250px",
          maxWidth: "250px",
          mx: 2,
          borderRadius: "6px",
          height: "fit-content",
          bgColor: "#ffffff3d",
        }}
        onClick={toggleOpenNewColumnForm}
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
    );
  }, [toggleOpenNewColumnForm]);

  const renderAddNewColumnForm = React.useMemo(
    () => (!openNewColumnForm ? renderAddNewColumn : renderFormColum),
    [openNewColumnForm, renderAddNewColumn, renderFormColum]
  );
  47;
  return (
    <SortableContext
      items={columns ? columns.map((c) => c._id) : []}
      strategy={horizontalListSortingStrategy}
    >
      <Box sx={LIST_COLUMNS_STYLES}>
        {renderColumn}
        {renderAddNewColumnForm}
      </Box>
    </SortableContext>
  );
}

export default ListColumns;

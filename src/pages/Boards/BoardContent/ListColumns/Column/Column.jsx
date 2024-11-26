import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
// thư viên kéo thả
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AddCardIcon from "@mui/icons-material/AddCard";
import CloudIcon from "@mui/icons-material/Cloud";
import CloseIcon from "@mui/icons-material/Close";
// api
import { createNewCardAPI, deleteColumnDetailAPI } from "~/apis";
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";

import { ListCards } from "./ListCards";
import { useConfirm } from "material-ui-confirm";

const COLUMN_STYLES = {
  minWidth: 300,
  maxWidth: 300,
  backgroundColor: (theme) =>
    theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
  borderRadius: "6px",
  height: "fit-content",
  maxHeight: (theme) =>
    `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
};

const COLUMN_HEADER_STYLES = {
  height: (theme) => theme.trello.columnHeaderHeight,
  p: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const COLUMN_FOOTER_STYLES = {
  height: (theme) => theme.trello.columnFooterHeight,
  p: 2,
};

function Column({ column }) {
  const dispatch = useDispatch();

  const board = useSelector(selectCurrentActiveBoard);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column?._id, data: { ...column } });

  const dndKitColumnStyles = {
    touchActive: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const orderedCards = column.cards;

  const [openNewCardForm, setOpenNewCardForm] = React.useState(false);
  const [newCardTitle, setNewCardTitle] = React.useState("");

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("Pleas enter Column title", {
        position: "bottom-left",
      });
      return;
    }

    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };

    const createdNewCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    const newBoard = cloneDeep(board);

    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdNewCard.columnId
    );

    if (columnToUpdate) {
      // Nếu column rỗng: Bản chất là đang chứa một cái Placeholder Card
      if (columnToUpdate.cards.some((card) => card.FE_PLACEHOLDER_CARD)) {
        columnToUpdate.cards = [createdNewCard];
        columnToUpdate.cardOrderIds = [createdNewCard._id];
      } else {
        columnToUpdate.cards.push(createdNewCard);
        columnToUpdate.cardOrderIds.push(createdNewCard._id);
      }
    }

    dispatch(updateCurrentActiveBoard(newBoard));

    // createNewCard này có nhiện vụ gọi API tạo mới Column và làm mới lại dữ liệu State Board

    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  // Xử lý xóa một Column và Cards trong nó
  const confirm = useConfirm();

  const handleDeleteColumn = () => {
    confirm({
      title: "Xóa column ?",
      description:
        "Hành động nay sẽ xóa vinh viên column và card bên trong. Bạn chắc chưa ?",

      confirmationText: "Confirm",
      cancellationText: "Cancel",
    })
      .then(() => {
        // Xử lý xóa một Column và Cards bên trong nó
        const newBoard = { ...board };

        newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);

        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (_id) => _id !== column._id
        );

        dispatch(updateCurrentActiveBoard(newBoard));

        deleteColumnDetailAPI(column._id).then((res) => {
          toast.success(res?.deleteResult);
        });
      })
      .catch(() => {
        /* ... */
      });
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box {...listeners} sx={COLUMN_STYLES}>
        {/* Box Column header */}
        <Box sx={COLUMN_HEADER_STYLES}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
          >
            {column?.title}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: "text.primary", cursor: "pointer" }}
                id="basic-column-dropdown"
                aria-controls={open ? "basic-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-column-dropdown",
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  display: "flex",
                  alignItems: "center",

                  "&:hover": {
                    color: "success.light",

                    "& .add-card-icon": {
                      color: "success.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPasteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Path</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  display: "flex",
                  alignItems: "center",

                  "&:hover": {
                    color: "warning.dark",

                    "& .delete-forever-icon": {
                      color: "warning.dark",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon
                    className="delete-forever-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <CloudIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Box list cards */}
        <ListCards cards={orderedCards} />

        {/* Box column footer */}
        <Box sx={COLUMN_FOOTER_STYLES}>
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={toggleOpenNewCardForm}
                startIcon={<AddCardIcon />}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title ..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  "& label": {
                    color: "text.primary",
                  },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },

                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },

                  "& .MuiOutlinedInput-input": {
                    borderRadius: 1,
                  },
                }}
              />

              <Box
                data-no-dnd="true"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  className="interceptor-loading"
                  onClick={addNewCard}
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
                  Add
                </Button>
                <CloseIcon
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    fontSize: "small",
                    cursor: "pointer",
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;

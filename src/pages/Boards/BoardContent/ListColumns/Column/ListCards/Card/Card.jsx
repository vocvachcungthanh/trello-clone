import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";

// thư viên kéo thả
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Icons
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import GroupIcon from "@mui/icons-material/Group";
import { useMemo } from "react";

const CARD_STYLES = {
  cursor: "pointer",
  boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
  overflow: "unset",
};

function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card?._id, data: { ...card } });

  const dndKitCardStyles = {
    touchActive: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
    borderRadius: "4px",
  };

  const renderCardMedia = useMemo(() => {
    if (card.cover) {
      return (
        <CardMedia
          sx={{ height: 140 }}
          image={card.cover}
          title="green iguana"
        />
      );
    }
  }, [card.cover]);

  const renderActions = useMemo(() => {
    if (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    ) {
      return (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}

          {!!card?.comments?.length && (
            <Button size="small" startIcon={<CommentIcon />}>
              {card?.comments?.length}
            </Button>
          )}

          {!!card?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      );
    }
  }, [card]);

  return (
    <div ref={setNodeRef} style={dndKitCardStyles} {...attributes}>
      <MuiCard {...listeners} sx={CARD_STYLES}>
        {renderCardMedia}
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Typography>{card.title}</Typography>
        </CardContent>
        {renderActions}
      </MuiCard>
    </div>
  );
}

export default Card;

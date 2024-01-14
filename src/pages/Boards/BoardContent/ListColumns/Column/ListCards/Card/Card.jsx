import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";

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
    <MuiCard sx={CARD_STYLES}>
      {renderCardMedia}
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography>{card.title}</Typography>
      </CardContent>
      {renderActions}
    </MuiCard>
  );
}

export default Card;

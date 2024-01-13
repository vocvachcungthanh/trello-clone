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

const CARD_STYLES = {
  cursor: "pointer",
  boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
  overflow: "unset",
};

function Card() {
  return (
    <MuiCard sx={CARD_STYLES}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://media.istockphoto.com/id/860715748/vi/anh/ch%C3%A2n-dung-g%C3%A0-t%C3%A2y-hoang-d%C3%A3-%C3%B3ng-%C3%A1nh.jpg?s=2048x2048&w=is&k=20&c=qbBRXkHBMh3B_-KUJDeMhWA76LULjXO3RxXuT16zFhg="
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography>vocvachcungthanh</Typography>
      </CardContent>
      <CardActions sx={{ p: "0 4px 8px 4px" }}>
        <Button size="small" startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<CommentIcon />}>
          15
        </Button>
        <Button size="small" startIcon={<AttachmentIcon />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;

import Box from "@mui/material/Box";
import { Card } from "./Card";

const LIST_CARDS_STYLES = {
  p: "0 5px",
  margin: "0 5px",
  display: "flex",
  flexDirection: "column",
  rowGap: 1,
  overflowX: "hidden",
  overflowY: "auto",
  maxHeight: (theme) => `calc(
        ${theme.trello.boardContentHeight} - 
        ${theme.spacing(5)} -
        ${theme.trello.columnHeaderHeight} -
        ${theme.trello.columnFooterHeight}
        )`,

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#ced0da",
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#bfc2cf",
  },
};

function ListCards() {
  return (
    <Box sx={LIST_CARDS_STYLES}>
      <Card />
    </Box>
  );
}

export default ListCards;

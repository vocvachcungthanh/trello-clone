import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import { Card } from "./Card";


const LIST_CARDS_STYLES = {
  p: "0 5px 5px 5px",
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

function ListCards({ cards }) {

  return (
    <SortableContext
      items={cards && cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box sx={LIST_CARDS_STYLES}>
        {cards && cards?.map((item) => (
          <Card key={item._id} card={item} />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;

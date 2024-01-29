// Viết hoa chữ cái đầu
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

export const generatePalaceholderCard = (colummn) => {
  return {
    _id: `${colummn._id}-placeholder-card`,
    boardId: colummn.boardId,
    colummnId: colummn._id,
    FE_PLACEHODER_CARD: true,
  };
};

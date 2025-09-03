export const POP_UP = {
  SHOW_POP_UP: 'SHOW_POP_UP',
  HIDE_POP_UP: 'HIDE_POP_UP',
};

export const ShowPopup = (content) => {
  return {type: POP_UP.SHOW_POP_UP, content, isShow: true};
};

export const HidePopup = {
  type: POP_UP.HIDE_POP_UP,
};

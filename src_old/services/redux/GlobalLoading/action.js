export const GLOBAL_LOADING_ACTION = {
  SHOW_GLOBAL_LOADING: 'SHOW_GLOBAL_LOADING',
  HIDE_GLOBAL_LOADING: 'HIDE_GLOBAL_LOADING',
};

export const ShowGlobalLoading = {
  type: GLOBAL_LOADING_ACTION.SHOW_GLOBAL_LOADING,
  isLoading: true,
};

export const HideGlobalLoading = {
  type: GLOBAL_LOADING_ACTION.HIDE_GLOBAL_LOADING,
  isLoading: false,
};

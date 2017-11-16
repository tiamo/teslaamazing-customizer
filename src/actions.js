const prefix = "@customizer/";

export const TOGGLE_FIRST_SCREEN = prefix + "TOGGLE_FIRST_SCREEN";
export const SET_SUCCESS_MESSAGE = prefix + "SET_SUCCESS_MESSAGE";
export const NEXT_STEP = prefix + "NEXT_STEP";
export const PREV_STEP = prefix + "PREV_STEP";
export const SET_PREVIEW = prefix + "SET_PREVIEW";
export const RESET_PREVIEW = prefix + "RESET_PREVIEW";

export const toggleFirstScreen = () => {
  return {
    type: TOGGLE_FIRST_SCREEN
  }
};

export const setSuccessMessage = (msg) => {
  return {
    type: SET_SUCCESS_MESSAGE,
    message: msg
  }
};

export const setPreview = (name, value) => {
  return {
    type: SET_PREVIEW,
    name: name,
    value: value,
  }
};

export const resetPreview = () => {
  return {
    type: RESET_PREVIEW,
  }
};

export const nextStep = () => {
  return {
    type: NEXT_STEP
  }
};

export const prevStep = () => {
  return {
    type: PREV_STEP
  }
};

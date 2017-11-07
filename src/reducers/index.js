import {
  NEXT_STEP,
  PREV_STEP, SET_PREVIEW,
  SET_SUCCESS_MESSAGE,
  TOGGLE_FIRST_SCREEN
} from "../actions";

const initialState = {
  firstScreen: process.env.NODE_ENV !== 'development',
  successMessage: null,
  step: 1,
  data: {
    // name: "test",
    // product: "M",
    items: {
      // fixme: redux-form remove items object
      "_": null
      // "009": 112
    }
  },
  preview: {
    // image url
    frontOuter: null,
    frontInner: null,
    backInner: null,
    backOuter: null,
  }
};

const reducer = (state = initialState, action) => {

  // console.log(action);

  switch (action.type) {
    case TOGGLE_FIRST_SCREEN:
      return {
        ...state,
        firstScreen: !state.firstScreen
      };
    case SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.message
      };
    case SET_PREVIEW:
      return {
        ...state,
        preview: {
          ...state.preview,
          [action.name]: action.value
        }
      };
    case PREV_STEP:
      return {
        ...state,
        step: state.step - 1
      };
    case NEXT_STEP:
      return {
        ...state,
        step: state.step + 1
      };
    default:
      return state
  }
};

export default reducer;

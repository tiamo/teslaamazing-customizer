import {
  NEXT_STEP,
  PREV_STEP,
  SET_PREVIEW,
  RESET_PREVIEW,
  SET_SUCCESS_MESSAGE,
  TOGGLE_FIRST_SCREEN
} from "../actions";

const initialState = {
  firstScreen: false,
  successMessage: null,
  step: 3,
  data: {
    name: "test",
    product: "M",
    items: {
      "_": null,
      "009": 111,
      // "012": 112,
    },
    frontInner: false,
    backInner: false,
    backOuter: false,
  },
  preview: {
    // image url
    frontOuter: null,
    frontInner: null,
    backInner: null,
    backOuter: null,
  }
};

// const initialState = {
//   firstScreen: process.env.NODE_ENV !== 'development',
//   successMessage: null,
//   step: 1,
//   data: {
//     items: {
//       // fixme: redux-form removes items object when it's empty
//       "_": null,
//     }
//   },
//   preview: {
//     // image url
//     frontOuter: null,
//     frontInner: null,
//     backInner: null,
//     backOuter: null,
//   }
// };

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
    case RESET_PREVIEW:
      return {
        ...state,
        preview: {
          frontOuter: null,
          frontInner: null,
          backInner: null,
          backOuter: null,
        }
      };
    case PREV_STEP:
      return {
        ...state,
        step: Math.max(state.step - 1, 1)
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

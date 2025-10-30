import React from "react";
import {useImmerReducer} from "use-immer";

function Testing() {
  const initialState = {
    appleCount: 1,
    bananaCount: 10,
    message: "Hello, world!",
    happy: false,
  };

  const ReducerFunction = (draft, action) => {
    switch (action.type) {
      case "addApple":
        draft.appleCount = draft.appleCount + 1;
        break;
      case "changeEverything":
        draft.appleCount += 10
        draft.bananaCount -= 50
          // message: "This dispatch changes everything",
        draft.message = action.value
        draft.happy = !draft.happy;
        break;
      default:
        return draft; // Return the current state if no action matches
    }
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  return (
    <>
      <div>Right now the count of apple is {state.appleCount}</div>
      <div>Right now the count of banana is {state.bananaCount}</div>
      <div>Message: {state.message}</div>
      <div>Happy: {state.happy ? "Yes" : "No"}</div>
      <br />
      <button onClick={() => dispatch({ type: "addApple" })}>Add apple</button>
      <br />
      <button
        onClick={() =>
          dispatch({
            type: "changeEverything",
            value: "The message is now coming from the dispatch",
          })
        }
      >
        Change everything
      </button>
    </>
  );
}

export default Testing;

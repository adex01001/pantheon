import { Dispatch, Store as ReduxStore } from 'redux';
import {
  CONFIRM_REGISTRATION_FAIL,
  CONFIRM_REGISTRATION_INIT,
  CONFIRM_REGISTRATION_SUCCESS,
  UPDATE_CURRENT_GAMES_INIT,
  SET_CREDENTIALS,
  AppActionsAll,
  UPDATE_CURRENT_GAMES_SUCCESS,
  UPDATE_CURRENT_GAMES_FAIL,
  GET_GAME_OVERVIEW_INIT,
  FORCE_LOGOUT,
  GET_GAME_OVERVIEW_SUCCESS, GET_GAME_OVERVIEW_FAIL
} from "../actions/interfaces";
import { RiichiApiService } from "../../riichiApi";
import { LCurrentGame, LGameConfig, LTimerState, LUser } from "../../../interfaces/local";
import { RemoteError } from "../../remoteError";

export const mimirClient = (api: RiichiApiService) => (store: ReduxStore) => (next: Dispatch<AppActionsAll>) => (action: AppActionsAll) => {
  switch (action.type) {
    case CONFIRM_REGISTRATION_INIT:
      loginWithRetry(action.payload, api, next);
      break;
    case SET_CREDENTIALS:
      api.setCredentials(action.payload);
      break;
    case UPDATE_CURRENT_GAMES_INIT:
      updateCurrentGames(api, next, store.dispatch);
      break;
    case GET_GAME_OVERVIEW_INIT:
      // TODO: check session hash in store; bailout if none
      getGameOverview(action.payload, api, next);
      break;
    default:
      return next(action);
  }
};

function loginWithRetry(pin: string, api: RiichiApiService, dispatch: Dispatch) {
  dispatch({ type: CONFIRM_REGISTRATION_INIT });

  let retriesCount = 0;
  const runWithRetry = () => {
    api.confirmRegistration(pin)
      .then((authToken: string) => {
        retriesCount = 0;
        dispatch({ type: CONFIRM_REGISTRATION_SUCCESS, payload: authToken });
      })
      .catch((e) => {
        retriesCount++;
        if (retriesCount < 5) {
          setTimeout(runWithRetry, 500);
          return;
        }

        retriesCount = 0;
        dispatch({ type: CONFIRM_REGISTRATION_FAIL, payload: e });
      });
  };

  runWithRetry();
}

function updateCurrentGames(api: RiichiApiService, dispatchNext: Dispatch, dispatchToStore: Dispatch) {
  dispatchNext({ type: UPDATE_CURRENT_GAMES_INIT });

  // TODO: make single method? should become faster!
  const promises: [Promise<LCurrentGame[]>, Promise<LUser>, Promise<LGameConfig>, Promise<LTimerState>] = [
    api.getCurrentGames(),
    api.getUserInfo(),
    api.getGameConfig(),
    api.getTimerState()
  ];

  Promise.all(promises).then(([games, playerInfo, gameConfig, timerState]) => {
    dispatchNext({ type: UPDATE_CURRENT_GAMES_SUCCESS, payload: { games, playerInfo, gameConfig, timerState }});
    if (games.length > 0) {
      dispatchToStore({ type: GET_GAME_OVERVIEW_INIT, payload: games[0].hashcode } );
    }
  }).catch((e) => {
    if (e.code === 401) { // token has rotten
      dispatchToStore({ type: FORCE_LOGOUT });
    } else {
      dispatchNext({ type: UPDATE_CURRENT_GAMES_FAIL, payload: e });
    }
  });
}

function getGameOverview(currentSessionHash: string, api: RiichiApiService, dispatch: Dispatch) {
  dispatch({ type: GET_GAME_OVERVIEW_INIT });
  api.getGameOverview(currentSessionHash)
    .then((overview) => dispatch({ type: GET_GAME_OVERVIEW_SUCCESS, payload: overview }))
    .catch((error: RemoteError) => dispatch({ type: GET_GAME_OVERVIEW_FAIL, payload: error }));
}

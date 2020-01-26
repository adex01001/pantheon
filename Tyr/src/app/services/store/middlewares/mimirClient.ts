import { Action, AnyAction, Dispatch, Store as ReduxStore } from 'redux';
import {
  CONFIRM_REGISTRATION_FAIL,
  CONFIRM_REGISTRATION_INIT,
  CONFIRM_REGISTRATION_SUCCESS,
  UPDATE_CURRENT_GAMES_INIT,
  isAsyncAction,
  SET_CREDENTIALS_INIT
} from "../actions/interfaces";
import { RiichiApiService } from "../../riichiApi";
import { LCurrentGame, LGameConfig, LTimerState, LUser } from "../../../interfaces/local";
import { isDevMode } from "@angular/core";

export const mimirClient = (store: ReduxStore) => (next: Dispatch<AnyAction>) => (action: Action) => {
  if (!isAsyncAction(action)) {
    return next(action);
  }

  switch (action.type) {
    case CONFIRM_REGISTRATION_INIT:
      loginWithRetry(action.payload, api)
        .then((authToken) => {
          // TODO: set loading = false;
          // TODO: set token to storage in next mw
          next({ type: CONFIRM_REGISTRATION_SUCCESS, payload: authToken });
        })
        .catch((e) => {
          // TODO: set loading = false;
          next({ type: CONFIRM_REGISTRATION_FAIL });
        });
      // TODO: set loading = true;
      next({ type: CONFIRM_REGISTRATION_INIT });
      break;
    case SET_CREDENTIALS_INIT:
      api.setCredentials(action.payload);
      break;
    case UPDATE_CURRENT_GAMES_INIT:

  }

  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
};

function loginWithRetry(pin: string, api: RiichiApiService) {
  let retriesCount = 0;

  return new Promise<string>((resolve, reject) => {
    const runWithRetry = () => {
      api.confirmRegistration(pin)
        .then((authToken: string) => {
          retriesCount = 0;
          resolve(authToken);
        })
        .catch((e) => {
          retriesCount++;
          if (retriesCount < 5) {
            setTimeout(runWithRetry, 500);
            return;
          }

          retriesCount = 0;
          reject(e);
        });
    };

    runWithRetry();
  });
}

function updateCurrentGames(api: RiichiApiService) {
  // TODO: make single method? should become faster!
  const promises: [Promise<LCurrentGame[]>, Promise<LUser>, Promise<LGameConfig>, Promise<LTimerState>] = [
    api.getCurrentGames(),
    api.getUserInfo(),
    api.getGameConfig(),
    api.getTimerState()
  ];

  Promise.all(promises).then(([games, playerInfo, gameConfig, timerState]) => {

    this._currentPlayerDisplayName = playerInfo.displayName;
    this._currentPlayerId = playerInfo.id;
    this._gameConfig = gameConfig;
    initYaku(this._gameConfig.withMultiYakumans);

    this.metrika.track(MetrikaService.CONFIG_RECEIVED);
    this.metrika.setUserId(playerInfo.id);

    if (games.length > 0) {
      // TODO: what if games > 1 ? Now it takes first one
      this._currentSessionHash = games[0].hashcode;
      this._players = games[0].players;
      for (let p of this._players) {
        this._mapIdToPlayer[p.id] = p;
      }

      if (gameConfig.useTimer) {
        initTimer(timerState);
      }

      // Player is now in game, so kick him to overview from watching
      if (this._currentScreen === 'otherTable' || this._currentScreen === 'otherTablesList') {
        this._currentScreen = 'overview';
      }

      this.updateOverview();
    } else {
      // no games! Or game ended just now
      this._reset();
    }

    this._loading.games = false;
  }).catch((e) => {
    if (e.code === 401) { // token has rotten
      this.storage.delete(['authToken']);
      this._reset();
      this.reinit();
    } else {
      if (isDevMode()) {
        console.error('Caught error or exception: ', e);
      }
    }
  });
}

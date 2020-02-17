import { YakuId } from "../../../primitives/yaku";
import { AnyAction } from "redux";
import { RemoteError } from "../../remoteError";
import { LCurrentGame, LGameConfig, LTimerState, LUser } from "../../../interfaces/local";
import {RRoundPaymentsInfoMulti, RRoundPaymentsInfoSingle, RSessionOverview} from "../../../interfaces/remote";
import {Table} from "../../../interfaces/common";

export const RESET_STATE = 'RESET_STATE';
export const START_NEW_GAME = 'START_NEW_GAME';
export const SHOW_LAST_RESULTS = 'SHOW_LAST_RESULTS';
export const SHOW_LAST_ROUND = 'SHOW_LAST_ROUND';
export const SHOW_OTHER_TABLES_LIST = 'SHOW_OTHER_TABLES_LIST';
export const SHOW_OTHER_TABLE = 'SHOW_OTHER_TABLE';
export const OPEN_SETTINGS = 'OPEN_SETTINGS';
export const GOTO_NEXT_SCREEN = 'GOTO_NEXT_SCREEN';
export const GOTO_PREV_SCREEN = 'GOTO_PREV_SCREEN';
export const SET_DORA_COUNT = 'SET_DORA_COUNT';
export const SET_FU_COUNT = 'SET_FU_COUNT';
export const ADD_YAKU = 'ADD_YAKU';
export const REMOVE_YAKU = 'REMOVE_YAKU';
export const TOGGLE_RIICHI = 'TOGGLE_RIICHI';
export const TOGGLE_WINNER = 'TOGGLE_WINNER';
export const TOGGLE_LOSER = 'TOGGLE_LOSER';
export const TOGGLE_PAO = 'TOGGLE_PAO';
export const TOGGLE_DEADHAND = 'TOGGLE_DEADHAND';
export const TOGGLE_NAGASHI = 'TOGGLE_NAGASHI';
export const CONFIRM_REGISTRATION_INIT = 'CONFIRM_REGISTRATION_INIT';
export const CONFIRM_REGISTRATION_SUCCESS = 'CONFIRM_REGISTRATION_SUCCESS';
export const CONFIRM_REGISTRATION_FAIL = 'CONFIRM_REGISTRATION_FAIL';
export const SET_CREDENTIALS = 'SET_CREDENTIALS_INIT';
export const UPDATE_CURRENT_GAMES_INIT = 'GET_CURRENT_GAMES_INIT';
export const UPDATE_CURRENT_GAMES_SUCCESS = 'GET_CURRENT_GAMES_SUCCESS';
export const UPDATE_CURRENT_GAMES_FAIL = 'GET_CURRENT_GAMES_FAIL';
export const GET_GAME_OVERVIEW_INIT = 'GET_GAME_OVERVIEW_INIT';
export const GET_GAME_OVERVIEW_SUCCESS = 'GET_GAME_OVERVIEW_SUCCESS';
export const GET_GAME_OVERVIEW_FAIL = 'GET_GAME_OVERVIEW_FAIL';
export const FORCE_LOGOUT = 'FORCE_LOGOUT';
export const GET_OTHER_TABLES_LIST_INIT = 'GET_OTHER_TABLES_LIST_INIT';
export const GET_OTHER_TABLES_LIST_SUCCESS = 'GET_OTHER_TABLES_LIST_SUCCESS';
export const GET_OTHER_TABLES_LIST_FAIL = 'GET_OTHER_TABLES_LIST_FAIL';
export const GET_OTHER_TABLE_INIT = 'GET_OTHER_TABLE_INIT';
export const GET_OTHER_TABLE_SUCCESS = 'GET_OTHER_TABLE_SUCCESS';
export const GET_OTHER_TABLE_FAIL = 'GET_OTHER_TABLE_FAIL';
export const GET_LAST_ROUND_INIT = 'GET_LAST_ROUND_INIT';
export const GET_LAST_ROUND_SUCCESS = 'GET_LAST_ROUND_SUCCESS';
export const GET_LAST_ROUND_FAIL = 'GET_LAST_ROUND_FAIL';

interface ResetStateAction {
  type: typeof RESET_STATE;
}

interface StartNewGameAction {
  type: typeof START_NEW_GAME;
}

interface ShowLastResultsAction {
  type: typeof SHOW_LAST_RESULTS;
}

interface ShowLastRoundAction {
  type: typeof SHOW_LAST_ROUND;
}

interface ShowOtherTablesListAction {
  type: typeof SHOW_OTHER_TABLES_LIST;
}

interface ShowOtherTableAction {
  type: typeof SHOW_OTHER_TABLE;
  payload: {
    hash: string;
  }
}

interface OpenSettingsAction {
  type: typeof OPEN_SETTINGS;
}

interface GotoNextScreenAction {
  type: typeof GOTO_NEXT_SCREEN;
}

interface GotoPrevScreenAction {
  type: typeof GOTO_PREV_SCREEN;
}

interface SetDoraCountAction {
  type: typeof SET_DORA_COUNT;
  payload: {
    count: number,
    winner?: number
  };
}

interface SetFuCountAction {
  type: typeof SET_FU_COUNT;
  payload: {
    count: number,
    winner?: number
  };
}

interface AddYakuAction {
  type: typeof ADD_YAKU;
  payload: {
    id: YakuId,
    winner?: number
  };
}

interface RemoveYakuAction {
  type: typeof REMOVE_YAKU;
  payload: {
    id: YakuId,
    winner?: number
  };
}

interface ToggleRiichiAction {
  type: typeof TOGGLE_RIICHI;
  payload: number;
}

interface ToggleWinnerAction {
  type: typeof TOGGLE_WINNER;
  payload: number;
}

interface ToggleLoserAction {
  type: typeof TOGGLE_LOSER;
  payload: number;
}

interface TogglePaoAction {
  type: typeof TOGGLE_PAO;
  payload: {
    id: number,
    yakuWithPao: YakuId[]
  };
}

interface ToggleDeadhandAction {
  type: typeof TOGGLE_DEADHAND;
  payload: number;
}

interface ToggleNagashiAction {
  type: typeof TOGGLE_NAGASHI;
  payload: number;
}

interface ConfirmRegistrationActionInit {
  type: typeof CONFIRM_REGISTRATION_INIT;
  async: true;
  payload: string;
}
interface ConfirmRegistrationActionSuccess {
  type: typeof CONFIRM_REGISTRATION_SUCCESS;
  payload: string;
}
interface ConfirmRegistrationActionFail {
  type: typeof CONFIRM_REGISTRATION_FAIL;
  payload: RemoteError;
}
interface SetCredentialsAction {
  type: typeof SET_CREDENTIALS;
  payload: string;
}
interface UpdateCurrentGamesActionInit {
  type: typeof UPDATE_CURRENT_GAMES_INIT;
  async: true;
}
interface UpdateCurrentGamesActionSuccess {
  type: typeof UPDATE_CURRENT_GAMES_SUCCESS;
  payload: {
    games: LCurrentGame[];
    playerInfo: LUser;
    gameConfig: LGameConfig;
    timerState: LTimerState;
  }
}
interface UpdateCurrentGamesActionFail {
  type: typeof UPDATE_CURRENT_GAMES_FAIL;
  payload: RemoteError;
}
interface GetGameOverviewActionInit {
  type: typeof GET_GAME_OVERVIEW_INIT;
  async: true;
  payload: string;
}
interface GetGameOverviewActionSuccess {
  type: typeof GET_GAME_OVERVIEW_SUCCESS;
  payload: RSessionOverview;
}
interface GetGameOverviewActionFail {
  type: typeof GET_GAME_OVERVIEW_FAIL;
  payload: RemoteError;
}
interface ForceLogoutAction {
  type: typeof FORCE_LOGOUT;
}
interface GetOtherTablesListAction {
  type: typeof GET_OTHER_TABLES_LIST_INIT;
  async: true;
}
interface GetOtherTablesListActionSuccess {
  type: typeof GET_OTHER_TABLES_LIST_SUCCESS;
  payload: Table[];
}
interface GetOtherTablesListActionFail {
  type: typeof GET_OTHER_TABLES_LIST_FAIL;
  payload: RemoteError;
}
interface GetOtherTableAction {
  type: typeof GET_OTHER_TABLE_INIT;
  async: true;
  payload: string;
}
interface GetOtherTableActionSuccess {
  type: typeof GET_OTHER_TABLE_SUCCESS;
  payload: RSessionOverview;
}
interface GetOtherTableActionFail {
  type: typeof GET_OTHER_TABLE_FAIL;
  payload: RemoteError;
}
interface GetLastRoundAction {
  type: typeof GET_LAST_ROUND_INIT;
  async: true;
  payload: string;
}
interface GetLastRoundActionSuccess {
  type: typeof GET_LAST_ROUND_SUCCESS;
  payload: RRoundPaymentsInfoSingle | RRoundPaymentsInfoMulti;
}
interface GetLastRoundActionFail {
  type: typeof GET_LAST_ROUND_FAIL;
  payload: RemoteError;
}

export type AppActionTypes =
  | ResetStateAction
  | StartNewGameAction
  | ShowLastResultsAction
  | ShowLastRoundAction
  | ShowOtherTablesListAction
  | ShowOtherTableAction
  | OpenSettingsAction
  | GotoNextScreenAction
  | GotoPrevScreenAction
  | SetDoraCountAction
  | SetFuCountAction
  | AddYakuAction
  | RemoveYakuAction
  | ToggleRiichiAction
  | ToggleWinnerAction
  | ToggleLoserAction
  | TogglePaoAction
  | ToggleDeadhandAction
  | ToggleNagashiAction
  | ConfirmRegistrationActionSuccess
  | UpdateCurrentGamesActionSuccess
  | GetGameOverviewActionSuccess
  | ConfirmRegistrationActionFail
  | UpdateCurrentGamesActionFail
  | GetGameOverviewActionFail
  | SetCredentialsAction
  | ForceLogoutAction
  | GetOtherTableActionSuccess
  | GetOtherTableActionFail
  | GetOtherTablesListActionSuccess
  | GetOtherTablesListActionFail
  | GetLastRoundActionSuccess
  | GetLastRoundActionFail
  ;

export type AppAsyncActions =
  | ConfirmRegistrationActionInit
  | UpdateCurrentGamesActionInit
  | GetGameOverviewActionInit
  | GetOtherTableAction
  | GetOtherTablesListAction
  | GetLastRoundAction
  ;

export type AppActionsAll = AppActionTypes | AppAsyncActions;

export function isAsyncAction(action: AnyAction): action is AppAsyncActions {
  return action.async === true;
}

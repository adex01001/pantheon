import {AppScreen, IAppState} from '../interfaces';
import { initialState } from "../state";
import {
  AppActionTypes,
  GOTO_NEXT_SCREEN,
  GOTO_PREV_SCREEN,
  OPEN_SETTINGS,
  RESET_STATE,
  SHOW_LAST_RESULTS,
  SHOW_LAST_ROUND,
  SHOW_OTHER_TABLE,
  SHOW_OTHER_TABLES_LIST,
  START_NEW_GAME
} from "../actions/interfaces";
import { winnerHasYakuWithPao } from "../util";

export function screenManageReducer(
  state = initialState,
  action: AppActionTypes
): IAppState {
  switch (action.type) {
    case RESET_STATE:
      return {
        ...state,
        currentScreen: (
          // Workaround: reset should not exit watching mode
          state.currentScreen === 'otherTable' ||
          state.currentScreen === 'otherTablesList'
            ? state.currentScreen
            : 'overview'
        ),
        currentRound: 1,
        currentOutcome: null,
        players: null,
        mapIdToPlayer: {},
        riichiOnTable: 0,
        honba: 0,
        currentSessionHash: null,
        multironCurrentWinner: null
      };
    case START_NEW_GAME:
      if (state.currentScreen !== 'overview') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'newGame'
      };
    case SHOW_LAST_RESULTS:
      if (state.currentScreen !== 'overview') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'lastResults'
      };
    case SHOW_LAST_ROUND:
      if (state.currentScreen !== 'overview') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'lastRound'
      };
    case SHOW_OTHER_TABLE:
      if (state.currentScreen !== 'otherTablesList') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'otherTable',
        currentOtherTableHash: action.payload.hash
      };
    case SHOW_OTHER_TABLES_LIST:
      if (state.currentScreen !== 'overview') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'otherTablesList'
      };
    case OPEN_SETTINGS:
      if (state.currentScreen !== 'overview') {
        return state;
      }

      return {
        ...state,
        currentScreen: 'otherTable'
      };
    case GOTO_NEXT_SCREEN:
      let nextScreen: AppScreen = state.currentScreen;
      switch (state.currentScreen) {
        case 'overview':
          nextScreen = 'outcomeSelect';
          break;
        case 'outcomeSelect':
          if (state.currentOutcome.selectedOutcome === 'nagashi') {
            nextScreen = 'nagashiSelect';
          } else {
            nextScreen = 'playersSelect';
          }
          break;
        case 'playersSelect':
          switch (state.currentOutcome.selectedOutcome) {
            case 'ron':
            case 'tsumo':
            case 'multiron':
              nextScreen = 'yakuSelect';
              break;
            case 'draw':
            case 'abort':
            case 'chombo':
            case 'nagashi':
              nextScreen = 'confirmation';
              break;
            default:
          }
          break;
        case 'yakuSelect':
          switch (state.currentOutcome.selectedOutcome) {
            case 'ron':
            case 'tsumo':
            case 'multiron':
              if (winnerHasYakuWithPao(state.currentOutcome, state.gameConfig)) {
                nextScreen = 'paoSelect';
              } else {
                nextScreen = 'confirmation';
              }
              break;
            default:
              nextScreen = 'confirmation';
          }
          break;
        case 'paoSelect':
          nextScreen = 'confirmation';
          break;
        case 'nagashiSelect':
          nextScreen = 'playersSelect';
          break;
        case 'lastResults':
        case 'lastRound':
        case 'confirmation':
          nextScreen = 'overview';
          break;
      }

      return {
        ...state,
        currentScreen: nextScreen
      };
    case GOTO_PREV_SCREEN:
      let prevScreen: AppScreen = state.currentScreen;
      switch (state.currentScreen) {
        case 'outcomeSelect':
        case 'lastRound':
        case 'otherTablesList':
        case 'settings':
        case 'newGame':
          prevScreen = 'overview';
          break;
        case 'playersSelect':
          if (state.currentOutcome.selectedOutcome === 'nagashi') {
            prevScreen = 'nagashiSelect';
          } else {
            prevScreen = 'outcomeSelect';
          }
          break;
        case 'yakuSelect':
          prevScreen = 'playersSelect';
          break;
        case 'confirmation':
          switch (state.currentOutcome.selectedOutcome) {
            case 'ron':
            case 'tsumo':
            case 'multiron':
              if (winnerHasYakuWithPao(state.currentOutcome, state.gameConfig)) {
                prevScreen = 'paoSelect';
              } else {
                prevScreen = 'yakuSelect';
              }
              break;
            case 'draw':
            case 'abort':
            case 'chombo':
            case 'nagashi':
              prevScreen = 'playersSelect';
              break;
            default:
          }
          break;
        case 'paoSelect':
          prevScreen = 'yakuSelect';
          break;
        case 'nagashiSelect':
          prevScreen = 'outcomeSelect';
          break;
        case 'otherTable':
          prevScreen = 'otherTablesList';
          break;
        default:
      }

      return {
        ...state,
        currentScreen: prevScreen
      };
    default:
      return state;
  }
}

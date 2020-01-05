import { initialState } from "../state";
import { ADD_YAKU, AppActionTypes, REMOVE_YAKU, SET_DORA_COUNT, SET_FU_COUNT } from "../actions/interfaces";
import { IAppState } from "../interfaces";
import { addYakuToProps, modifyWinOutcome, removeYakuFromProps } from "./util";
import { getRequiredYaku } from "../../../primitives/appstate/yaku";

export function winOutcomeReducer(
  state = initialState,
  action: AppActionTypes
): IAppState {
  let winProps;
  switch (action.type) {
    case SET_DORA_COUNT:
      return modifyWinOutcome(state, { 'dora': action.payload.count }, () => action.payload.winner);
    case SET_FU_COUNT:
      return modifyWinOutcome(state, { 'fu': action.payload.count }, () => action.payload.winner);
    case ADD_YAKU:
      // TODO: riichi and double-riichi checks; should be done in UI
      /*
       if (!bypassChecks && id === YakuId.RIICHI && props.yaku.indexOf(YakuId.RIICHI) === -1) {
          alert(i18n._t('If you want to select a riichi, return back and press riichi button for the winner'));
          return false;
        }

        if (
          !bypassChecks &&
          id === YakuId.DOUBLERIICHI && (
            outcome.selectedOutcome === 'ron' ||
            outcome.selectedOutcome === 'tsumo' ||
            outcome.selectedOutcome === 'multiron'
          ) &&
          outcome.riichiBets.indexOf(props.winner) === -1
        ) {
          alert(i18n._t('If you want to select a riichi, return back and press riichi button for the winner'));
          return false;
        }
      */

      switch (state.currentOutcome.selectedOutcome) {
        case "ron":
        case "tsumo":
          winProps = addYakuToProps(state.currentOutcome, state.currentOutcome.selectedOutcome, action.payload.id);
          if (!winProps) {
            return state;
          }
          break;
        case "multiron":
          winProps = addYakuToProps(state.currentOutcome.wins[action.payload.winner], state.currentOutcome.selectedOutcome, action.payload.id);
          if (!winProps) {
            return state;
          }
          break;
        default:
          return state;
      }

      return modifyWinOutcome(state, winProps, () => action.payload.winner);
    case REMOVE_YAKU:
      if (getRequiredYaku(state.currentOutcome, action.payload.winner).indexOf(action.payload.id) !== -1) {
        // do not allow to disable required yaku
        return state;
      }

      switch (state.currentOutcome.selectedOutcome) {
        case "ron":
        case "tsumo":
          winProps = removeYakuFromProps(state.currentOutcome, state.currentOutcome.selectedOutcome, action.payload.id);
          if (!winProps) {
            return state;
          }
          break;
        case "multiron":
          winProps = removeYakuFromProps(state.currentOutcome.wins[action.payload.winner], state.currentOutcome.selectedOutcome, action.payload.id);
          if (!winProps) {
            return state;
          }
          break;
        default:
          return state;
      }

      return modifyWinOutcome(state, winProps, () => action.payload.winner);
    default:
      return state;
  }
}

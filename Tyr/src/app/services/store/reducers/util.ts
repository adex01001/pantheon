import { IAppState } from "../interfaces";
import { AppOutcome, WinProps } from "../../../interfaces/app";
import { YakuId } from "../../../primitives/yaku";
import { addYakuToList, limits, pack, unpack } from "../../../primitives/yaku-compat";
import { getFixedFu, getHan } from "../../../primitives/yaku-values";
import { getRequiredYaku } from "../../../primitives/appstate/yaku";

export function modifyWinOutcome(state: IAppState, fields: { [key: string]: any }, winnerIdGetter?: () => number) {
  switch (state.currentOutcome.selectedOutcome) {
    case "ron":
    case "tsumo":
      return {
        ...state,
        currentOutcome: {
          ...state.currentOutcome,
          ...fields
        }
      };
    case "multiron":
      return {
        ...state,
        currentOutcome: {
          ...state.currentOutcome,
          wins: {
            ...state.currentOutcome.wins,
            [winnerIdGetter()]: {
              ...state.currentOutcome.wins[winnerIdGetter()],
              ...fields
            }
          }
        }
      };
    default:
      throw new Error('No yaku may exist on this outcome');
  }
}

export function addYakuToProps(
  winProps: WinProps,
  selectedOutcome: AppOutcome['selectedOutcome'],
  yakuId: YakuId
): WinProps | null {

  let yakuList = unpack(winProps.yaku);
  if (yakuList[yakuId]) {
    return null;
  }

  // reset dora count if limit is added
  if (limits.indexOf(yakuId) !== -1) {
    winProps = {
      ...winProps,
      dora: 0
    };
  }

  yakuList = addYakuToList(yakuId, yakuList);

  if (selectedOutcome === 'tsumo') {
    if (
      (yakuId === YakuId.MENZENTSUMO && yakuList.indexOf(YakuId.__OPENHAND) !== -1) ||
      (yakuId === YakuId.__OPENHAND && yakuList.indexOf(YakuId.MENZENTSUMO) !== -1)
    ) {
      // Remove open hand if we checked tsumo, and vice versa
      const pIdx = yakuList.indexOf(yakuId);
      if (pIdx !== -1) {
        yakuList.splice(pIdx, 1);
      }
    }
  }

  const packedList = pack(yakuList);

  if (winProps.yaku !== packedList) {
    let fu = winProps.fu;
    const han = getHan(yakuList);
    const possibleFu = getFixedFu(yakuList, selectedOutcome);
    if (
      -1 === possibleFu.indexOf(winProps.fu) ||
      yakuId === YakuId.__OPENHAND // if open hand added, 40 fu must become 30 by default
    ) {
      fu = possibleFu[0];
    }

    winProps = {
      ...winProps,
      yaku: packedList,
      han,
      fu,
      possibleFu
    };
  }

  return winProps;
}

export function removeYakuFromProps(
  winProps: WinProps,
  selectedOutcome: AppOutcome['selectedOutcome'],
  yakuId: YakuId
): WinProps | null {

  let yakuList = unpack(winProps.yaku);
  if (!yakuList[yakuId]) {
    return null;
  }

  const pIdx = yakuList.indexOf(yakuId);
  if (pIdx !== -1) {
    yakuList.splice(pIdx, 1);
  }

  const packedList = pack(yakuList);

  if (winProps.yaku !== packedList) {
    let fu = winProps.fu;
    const han = getHan(yakuList);
    const possibleFu = getFixedFu(yakuList, selectedOutcome);
    if (possibleFu.indexOf(fu) === -1) {
      fu = possibleFu[0];
    }

    winProps = {
      ...winProps,
      yaku: packedList,
      han,
      fu,
      possibleFu
    };
  }

  return winProps;
}

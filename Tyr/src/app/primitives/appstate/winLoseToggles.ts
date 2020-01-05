/*
 * Tyr - Allows online game recording in japanese (riichi) mahjong sessions
 * Copyright (C) 2016 Oleg Klimenko aka ctizen <me@ctizen.net>
 *
 * This file is part of Tyr.
 *
 * Tyr is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Tyr is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tyr.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Player } from '../../interfaces/common';
import { AppOutcome } from '../../interfaces/app';
import { YakuId } from '../yaku';
import { intersection } from 'lodash';z

export type PMap = { [key: number]: Player };

export function getWinningUsers(outcome: AppOutcome, playerIdMap: PMap): Player[] {
  switch (outcome.selectedOutcome) {
    case 'ron':
    case 'tsumo':
      return outcome.winner
        ? [playerIdMap[outcome.winner]]
        : [];
    case 'multiron':
      let users = [];
      for (let w in outcome.wins) {
        users.push(playerIdMap[outcome.wins[w].winner]);
      }
      return users;
    case 'draw':
    case 'nagashi':
      return outcome.tempai.map((t) => playerIdMap[t]);
    default:
      return [];
  }
}

export function getLosingUsers(outcome: AppOutcome, playerIdMap: PMap): Player[] {
  switch (outcome.selectedOutcome) {
    case 'ron':
    case 'multiron':
    case 'chombo':
      return outcome.loser
        ? [playerIdMap[outcome.loser]]
        : [];
    default:
      return [];
  }
}

export function getPaoUsers(outcome: AppOutcome, playerIdMap: PMap): Player[] {
  switch (outcome.selectedOutcome) {
    case 'ron':
    case 'tsumo':
      return outcome.paoPlayerId
        ? [playerIdMap[outcome.paoPlayerId]]
        : [];
    case 'multiron':
      return Object.keys(outcome.wins).reduce<Player[]>((acc, playerId) => {
        if (outcome.wins[playerId].paoPlayerId) {
          acc.push(playerIdMap[outcome.wins[playerId].paoPlayerId]);
        }
        return acc;
      }, []);
    default:
      return [];
  }
}

export function getDeadhandUsers(outcome: AppOutcome, playerIdMap: PMap): Player[] {
  switch (outcome.selectedOutcome) {
    case 'draw':
    case 'nagashi':
      return outcome.deadhands.map((t) => playerIdMap[t]);
    default:
      return [];
  }
}

export function getNagashiUsers(outcome: AppOutcome, playerIdMap: PMap): Player[] {
  switch (outcome.selectedOutcome) {
    case 'nagashi':
      return outcome.nagashi.map((t) => playerIdMap[t]);
    default:
      return [];
  }
}

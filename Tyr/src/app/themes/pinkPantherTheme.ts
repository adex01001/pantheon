import { Theme } from './interface';

export const pinkPantherTheme: Theme = {
  name: 'pinkPantherTheme',
  humanReadableTitle: 'Pink Panther theme',
  properties: {
    '--main-bg-color': '#d89ab5',
    '--main-button-bg-color': '#b43e69',
    '--main-button-bg-color-hl': '#b43e69',
    '--main-text-color': 'white',
    '--main-border-color': '#9B8573',

    '--main-bg-color-lite': '#8BA98B',
    '--main-button-bg-color-lite': '#BDA48E',
    '--main-text-color-lite': '#DFE0DE',
    '--main-border-color-lite': '#C8BCB2',

    '--secondary-bg-color': '#e6cbb0',
    '--secondary-bg-color-active': '#ebe6d9',
    '--secondary-text-color': '#7e1037',

    '--secondary-button-bg-color': '#2B4162',

    '--navbar-bg-color': '#4b0c3b',

    '--emergency-color': 'rgb(179, 0, 27)',
    '--warning-color': 'rgb(255, 245, 122)',
    '--safe-color': 'rgb(44, 99, 44)',

    '--emergency-color-semi': 'rgba(179, 0, 27, 0.2)',
    '--warning-color-semi': 'rgba(255, 245, 122, 0.2)',
    '--safe-color-semi': 'rgba(44, 99, 44, 0.2)',

    '--button-background-style': 'linear-gradient(to bottom, var(--main-button-bg-color) 0%, var(--main-button-bg-color-hl) 50%, var(--main-button-bg-color) 51%, var(--main-button-bg-color) 100%)',

    '--button-border-radius': '5px',
    '--button-box-shadow': '6px 6px 13px 0 var(--secondary-text-color)',
    '--button-border': 'none',
    '--button-text-color': 'var(--main-text-color)',
    '--button-font-size': '15px',
    '--button-padding': '6px 15px',
    '--button-text-decoration': 'none',
    '--button-text-shadow': '0 1px 0 var(--navbar-bg-color)',

    '--button-active-box-shadow': '2px 2px 3px 0 var(--secondary-text-color)',
    '--button-active-border': 'none',
    '--button-active-text-color': 'var(--main-text-color)',
  }
};

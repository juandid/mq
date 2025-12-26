// UI-Zustandsverwaltung und Sichtbarkeitssteuerung

import { DOM } from './dom-helpers.js';

export class UIStateManager {
  constructor(selectors) {
    // Elemente cachen
    this.completeNavItem = DOM.select(selectors.completeNavItem);
    this.showNavItem = DOM.select(selectors.showNavItem);
    this.hideNavItem = DOM.select(selectors.hideNavItem);
    this.aliasFormDiv = DOM.select(selectors.aliasFormDiv);
    this.invalidAlert = DOM.select(selectors.invalidAlert);
    this.incompleteInputAlert = DOM.select(selectors.incompleteInputAlert);
  }

  showInitialState() {
    DOM.show(this.completeNavItem);
    DOM.hide(this.showNavItem);
    DOM.hide(this.hideNavItem);
    DOM.show(this.aliasFormDiv);
    DOM.hide(this.invalidAlert);
    DOM.hide(this.incompleteInputAlert);
  }

  transitionToCompleteMode() {
    DOM.show(this.showNavItem);
    DOM.hide(this.completeNavItem);
    DOM.hide(this.aliasFormDiv);
  }

  transitionToShowMode() {
    DOM.hide(this.showNavItem);
    DOM.show(this.hideNavItem);
  }

  transitionToHideMode() {
    DOM.show(this.showNavItem);
    DOM.hide(this.hideNavItem);
  }

  transitionToClearMode() {
    DOM.hide(this.showNavItem);
    DOM.hide(this.hideNavItem);
    DOM.show(this.completeNavItem);
    DOM.show(this.aliasFormDiv);
    DOM.hide(this.invalidAlert);
    DOM.hide(this.incompleteInputAlert);
  }

  showInvalidAlert() {
    DOM.hide(this.incompleteInputAlert);
    DOM.show(this.invalidAlert);
  }

  hideInvalidAlert() {
    DOM.hide(this.invalidAlert);
  }

  showIncompleteInputAlert() {
    DOM.hide(this.invalidAlert);
    DOM.show(this.incompleteInputAlert);
  }

  hideIncompleteInputAlert() {
    DOM.hide(this.incompleteInputAlert);
  }

  hideAllAlerts() {
    DOM.hide(this.invalidAlert);
    DOM.hide(this.incompleteInputAlert);
  }
}

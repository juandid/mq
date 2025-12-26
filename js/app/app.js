// Haupt-Orchestrator für die MQ PWA

import { DB_CONFIG, DOM_SELECTORS, VALIDATION, UI_TEXT } from './constants.js';
import { AliasDatabase } from './db.js';
import { UIStateManager } from './ui-state-manager.js';
import { AliasManager } from './alias-manager.js';
import { DOM, ModalHelper } from './dom-helpers.js';
import { AliasValidator } from './validators.js';

class MQApp {
  constructor() {
    // Services initialisieren
    this.database = new AliasDatabase(DB_CONFIG);
    this.aliasManager = new AliasManager(this.database);
    this.uiState = new UIStateManager(DOM_SELECTORS);
    this.validator = new AliasValidator(VALIDATION);

    // DOM-Elemente cachen
    this.aliasForm = DOM.select(DOM_SELECTORS.aliasForm);
    this.aliasInput = DOM.select(DOM_SELECTORS.aliasInput);
    this.aliasList = DOM.select(DOM_SELECTORS.aliasList);
    this.clearLink = DOM.select(DOM_SELECTORS.clearLink);
    this.clearButton = DOM.select(DOM_SELECTORS.clearButton);
    this.completeLink = DOM.select(DOM_SELECTORS.completeLink);
    this.showLink = DOM.select(DOM_SELECTORS.showLink);
    this.hideLink = DOM.select(DOM_SELECTORS.hideLink);

    // Modal initialisieren
    this.clearModal = new ModalHelper(DOM.select(DOM_SELECTORS.clearModal));
  }

  async init() {
    try {
      // Datenbank initialisieren
      await this.database.initialize();

      // Event-Handler registrieren
      this.registerEventHandlers();

      // Service Worker registrieren
      this.registerServiceWorker();

      // Initialer UI-Zustand
      this.uiState.showInitialState();

      // Alias-Liste initial rendern (versteckt)
      await this.renderAliasList(true);
    } catch (error) {
      console.error('Fehler bei der App-Initialisierung:', error);
    }
  }

  registerEventHandlers() {
    this.setupFormSubmission();
    this.setupClearHandler();
    this.setupCompleteHandler();
    this.setupShowHideHandlers();
  }

  setupFormSubmission() {
    this.aliasForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.handleAliasSubmission();
    });

    // Alert verstecken wenn User beginnt zu tippen
    this.aliasInput.addEventListener('input', () => {
      this.uiState.hideIncompleteInputAlert();
    });
  }

  async handleAliasSubmission() {
    const aliasValue = DOM.getValue(this.aliasInput);

    if (!this.validator.validate(aliasValue)) {
      this.uiState.showInvalidAlert();
      return;
    }

    this.uiState.hideInvalidAlert();

    try {
      await this.aliasManager.addAlias(aliasValue);
      await this.renderAliasList(true);
      DOM.setValue(this.aliasInput, '');
      this.aliasInput.focus();
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Alias:', error);
    }
  }

  setupClearHandler() {
    this.clearLink.addEventListener('click', async () => {
      // Prüfen, ob Aliases vorhanden sind
      const aliases = await this.aliasManager.getAllAliases();
      if (aliases.length > 0) {
        this.clearModal.show();
      }
      // Wenn keine Aliases, keine Aktion nötig
    });

    this.clearButton.addEventListener('click', async () => {
      await this.handleClear();
    });
  }

  async handleClear() {
    try {
      await this.aliasManager.clearAll();
      await this.renderAliasList(true);
      this.uiState.transitionToClearMode();
      this.clearModal.hide();
    } catch (error) {
      console.error('Fehler beim Löschen der Aliases:', error);
    }
  }

  setupCompleteHandler() {
    this.completeLink.addEventListener('click', async () => {
      await this.handleComplete();
    });
  }

  async handleComplete() {
    // Prüfen, ob noch Text im Eingabefeld steht
    const currentInput = DOM.getValue(this.aliasInput).trim();
    if (currentInput !== '') {
      // Warnung anzeigen und Fokus auf Input setzen
      this.uiState.showIncompleteInputAlert();
      this.aliasInput.focus();
      return;
    }

    // Prüfen, ob mindestens ein Alias vorhanden ist
    const aliasCount = await this.aliasManager.getAllAliases();
    if (aliasCount.length === 0) {
      return; // Keine Aktion, wenn keine Aliases vorhanden
    }

    try {
      this.uiState.hideAllAlerts();
      await this.aliasManager.shuffleAliases();
      this.uiState.transitionToCompleteMode();
    } catch (error) {
      console.error('Fehler beim Mischen der Aliases:', error);
    }
  }

  setupShowHideHandlers() {
    this.showLink.addEventListener('click', async () => {
      await this.renderAliasList(false);
      this.uiState.transitionToShowMode();
    });

    this.hideLink.addEventListener('click', async () => {
      await this.renderAliasList(true);
      this.uiState.transitionToHideMode();
    });
  }

  async renderAliasList(hidden = true) {
    DOM.clearChildren(this.aliasList);

    try {
      if (hidden) {
        await this.renderHiddenList();
      } else {
        await this.renderShuffledList();
      }
    } catch (error) {
      console.error('Fehler beim Rendern der Alias-Liste:', error);
    }
  }

  async renderHiddenList() {
    const aliases = await this.aliasManager.getAllAliases();

    aliases.forEach((alias, index) => {
      const text = `${index + 1}. ${UI_TEXT.hiddenAlias}`;
      const li = DOM.createListItem(text, 'list-group-item');
      this.aliasList.appendChild(li);
    });
  }

  async renderShuffledList() {
    const shuffledIndices = this.aliasManager.getShuffledIndices();

    for (const id of shuffledIndices) {
      const alias = await this.aliasManager.getAlias(id);
      if (alias) {
        const li = DOM.createListItem(alias.name, 'list-group-item');
        this.aliasList.appendChild(li);
      }
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.error('Service Worker Registrierung fehlgeschlagen:', error);
      });
    }
  }
}

// App initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', async () => {
  const app = new MQApp();
  await app.init();
});

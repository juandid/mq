// Konfiguration und Konstanten für die MQ PWA

export const DB_CONFIG = {
  name: 'MQ_DB',
  version: 1,
  stores: {
    aliases: {
      name: 'aliases',
      keyPath: 'id',
      autoIncrement: true
    }
  }
};

export const DOM_SELECTORS = {
  aliasForm: '#aliasForm',
  aliasInput: '#alias',
  aliasList: '#aliasList',
  invalidAlert: '#invalidValueAlert',
  incompleteInputAlert: '#incompleteInputAlert',
  clearModal: '#clearModal',
  clearLink: '#clearLink',
  clearButton: '#clearButton',
  completeLink: '#completeLink',
  showLink: '#showLink',
  hideLink: '#hideLink',
  completeNavItem: '#completeNavItem',
  showNavItem: '#showNavItem',
  hideNavItem: '#hideNavItem',
  aliasFormDiv: '#aliasFormDiv'
};

export const VALIDATION = {
  aliasMinLetters: 2,
  aliasPattern: /.*[A-Za-z]{2}.*/
};

export const UI_TEXT = {
  hiddenAlias: '*************'
};

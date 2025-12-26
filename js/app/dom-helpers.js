// DOM-Manipulations-Utilities (Vanilla JavaScript)

export const DOM = {
  select(selector) {
    return document.querySelector(selector);
  },

  selectAll(selector) {
    return document.querySelectorAll(selector);
  },

  addClass(element, className) {
    element.classList.add(className);
  },

  removeClass(element, className) {
    element.classList.remove(className);
  },

  show(element) {
    element.style.display = 'block';
    // Für Bootstrap-Alerts die "show" Klasse hinzufügen
    if (element.classList.contains('alert')) {
      element.classList.add('show');
    }
  },

  hide(element) {
    element.style.display = 'none';
    // Für Bootstrap-Alerts die "show" Klasse entfernen
    if (element.classList.contains('alert')) {
      element.classList.remove('show');
    }
  },

  setValue(element, value) {
    element.value = value;
  },

  getValue(element) {
    return element.value;
  },

  clearChildren(element) {
    element.innerHTML = '';
  },

  createListItem(text, className) {
    const li = document.createElement('li');
    li.textContent = text;
    if (className) {
      li.className = className;
    }
    return li;
  }
};

export class ModalHelper {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.modal = new bootstrap.Modal(modalElement);
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }
}

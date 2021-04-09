import icons from "url:../../img/icons.svg";
export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param { Object | Object[]} data recipe
   * @returns {undefined}
   * @this {Object} View instance
   * @author anhquancao
   */
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // virtual DOM in memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*")); // convert NodeList to Array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll("*")
    );

    newElements.forEach((newElement, index) => {
      const currentElement = currentElements[index];
      // optional chaining
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ""
      ) {
        currentElement.textContent = newElement.textContent;
      }

      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach((attr) =>
          currentElement.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(errorMessage = this._errorMessage) {
    const markup = `
    <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${errorMessage}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>
        ${message}
      </p>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

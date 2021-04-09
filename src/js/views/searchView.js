class SearchView {
  _parentElement = document.querySelector(".search__field");
  getQuery() {
    const query = this._parentElement.value;
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentElement.value = "";
  }
  addHandlerSearchResults(handler) {
    document.querySelector(".search").addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();

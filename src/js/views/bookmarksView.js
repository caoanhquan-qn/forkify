import PreviewView from "./previewView.js";
class BookmarksView extends PreviewView {
  _parentElement = document.querySelector(".bookmarks__list");
  _message = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  addHandlerInitialBookmark(handler) {
    window.addEventListener("load", handler);
  }
}

export default new BookmarksView();

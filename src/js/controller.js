import * as model from "./model.js";
import { MODAL_CLOSE_SECOND } from "../js/config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0. update results view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. loading recipe
    await model.loadRecipe(id); // async function => return a promise

    // 2. rendering recipe on UI
    recipeView.render(model.state.recipe);

    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // 1. loading search results
    await model.loadSearchResults(query);

    // 2. rendering search results on UI
    if (!model.state.search.results.length) {
      return resultsView.renderError();
    }

    resultsView.render(model.getSearchResultsPage(1));
    // 3. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPaginationClick = function (num) {
  // 1. render new search results
  resultsView.render(model.getSearchResultsPage(num));
  // 2. render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  // update the recipe serving in state
  model.updateServings(servings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  }

  console.log(model.state.recipe);
  console.log(model.state.bookmarks);

  // render a bookmark on UI
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookmarksView.render(model.state.bookmarks);

  // no bookmark
  if (model.state.bookmarks.length === 0) {
    bookmarksView.renderMessage();
  }
};

const controlInitialBookmark = function () {
  bookmarksView.render(model.state.bookmarks);

  // no bookmark when the page is initialized
  if (model.state.bookmarks.length === 0) {
    bookmarksView.renderMessage();
  }
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // add bookmark view
    bookmarksView.render(model.state.bookmarks);

    // successful message
    addRecipeView.renderMessage();

    // change ID in url
    //history API
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    console.log(model.state.recipe);

    // close form window
    setTimeout(function () {
      addRecipeView.handlerHideWindow();
    }, MODAL_CLOSE_SECOND * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerInitialBookmark(controlInitialBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearchResults(controlSearchResults);
  paginationView.addHandlerClick(controlPaginationClick);

  ////
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

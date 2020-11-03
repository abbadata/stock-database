import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import TopReducer from "../reducers/TopReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(TopReducer, composeEnhancers(
  applyMiddleware(thunk)
));

export default store;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { createStore ,applyMiddleware,compose} from 'redux'
import Reducers from './Reducers'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { composeWithDevTools } from 'redux-devtools-extension'


const persistConfig = {
  key: 'root',
  storage,
}
function saveToLocalStorage(state){
  try{
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state',serializedState)
  }catch(e){
    console.log(e)
  }
}
function loadFromLocalStorage(){
  try{
    const serializedState = localStorage.getItem('state')
    if(serializedState===null) return undefined
    return JSON.parse(serializedState)

  }catch(e){
    console.log(e)
    return undefined
  }
}
const persistedState = loadFromLocalStorage();
const persistedReducer = persistReducer(persistConfig, Reducers)
let persistor = persistStore(createStore(persistedReducer))
const store=createStore(persistedReducer,persistedState,composeWithDevTools( ))
store.subscribe(()=>saveToLocalStorage(store.getState()))
ReactDOM.render(
<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
  <App />
  </PersistGate>
</Provider>
  ,
  
  document.getElementById('root')
);

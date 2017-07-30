import * as env from '../actions/documentActions';

import {DataStore, Dispatcher} from 'react-cms-data-view';

let notifications_store = new DataStore(new Dispatcher());

const initialState = {
  document: false,
  document_initialization_requested: false,
  document_view: 'Index',
  informerMessage: '',
  requested_url: '',
  item_drawer_opened: false,
  notifications_store: notifications_store,
};

/*
 * */

export default function (state = initialState, action) {

  var st = Object.assign({},state);

  switch (action.type) {

    case env.INITIALIZATION_REQUESTED:

      st.document_initialization_requested = true;
      st.document_initialized = false;
      st.document_initialization_failed = false;
      break;


    case env.INFORMER_MESSAGE_ADDED:

      var dispatcher = notifications_store.getDispatcher();

      var {message} = action;


      if(typeof message != "object"){
        message = {
          text: message,
        };
      }


      var {autohide} = message;

      console.log("CREATED", message);

      if(!message.handleClose){
        message.handleClose = () => {
          dispatcher.dispatch(notifications_store.actions['REMOVE'], message);
        }
      }

      if(autohide && autohide > 0){
        setTimeout(message.handleClose, autohide);
      }

      dispatcher.dispatch(notifications_store.actions['CREATE'], message);

      break;

    case env.INFORMER_MESSAGE_REMOVED:

      var dispatcher = notifications_store.getDispatcher();

      dispatcher.dispatch(notifications_store.actions['REMOVE'], action.message);

      break;


    case env.LOAD_DOCUMENT_REQUESTED:

      st.requested_url = action.url;
      break;

    case env.DOCUMENT_LOADED:

      st.document = action.document;
      break;

    case env.ITEM_DRAWER_CLOSED:

      st.add_location = false;
      st.item_drawer_opened = false;

      break;

    case env.ADD_LOCATION_CLICKED:

      st.add_location = true;
      st.item_drawer_opened = true;

      break;

    case env.ADD_LOCATION_CLOSED:

      st.add_location = false;
      st.item_drawer_opened = false;

      break;


    default:
      ;
  }
  return st
}

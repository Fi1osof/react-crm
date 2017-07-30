export const INITIALIZATION_REQUESTED = 'INITIALIZATION_REQUESTED';
export const INFORMER_MESSAGE_ADDED = 'INFORMER_MESSAGE_ADDED';
export const INFORMER_MESSAGE_REMOVED = 'INFORMER_MESSAGE_REMOVED';
export const LOAD_DOCUMENT_REQUESTED = 'LOAD_DOCUMENT_REQUESTED';
export const DOCUMENT_LOADED = 'DOCUMENT_LOADED';
export const ITEM_DRAWER_CLOSED = 'ITEM_DRAWER_CLOSED';
export const ADD_LOCATION_CLICKED = 'ADD_LOCATION_CLICKED';
export const ADD_LOCATION_CLOSED = 'ADD_LOCATION_CLOSED';

export function InitializeDocument() {
  return {
    type: INITIALIZATION_REQUESTED,
  };
}

export function addInformerMessage(message) {

  return {
    type: INFORMER_MESSAGE_ADDED,
    message,
  };
}

export function removeInformerMessage(message) {

  return {
    type: INFORMER_MESSAGE_REMOVED,
    message,
  };
}

export function LoadDocument(url) {

  return {
    type: LOAD_DOCUMENT_REQUESTED,
    url,
  };
}

export function DocumentLoaded(document) {

  return {
    type: DOCUMENT_LOADED,
    document,
  };
}

export function AddLocation() {
  return {
    type: ADD_LOCATION_CLICKED,
  };
}

export function CloseAddLocation() {
  return {
    type: ADD_LOCATION_CLOSED,
  };
}

export function CloseItemDrawer() {
  return {
    type: ITEM_DRAWER_CLOSED,
  };
}

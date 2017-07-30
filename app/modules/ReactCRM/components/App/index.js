

import './styles/styles.less';

import React from "react";

import PropTypes from 'prop-types';

import cookie from 'js-cookie';

// import {DataStore, Dispatcher} from 'react-cms-data-view';

import {request, loadItems, saveItem, removeItem} from 'react-cms-data-view/src/Utils';

import { App as TemplatesApp, Auth, Informer } from "modules/Templates";


import {DataStore, Dispatcher} from 'react-cms-data-view';

import {browserHistory} from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as proxyActions from 'modules/Redux/actions/proxyActions';
import * as userActions from 'modules/Redux/actions/userActions';
import * as documentActions from 'modules/Redux/actions/documentActions';


class MainApp extends React.Component {

  static childContextTypes = {

    request: PropTypes.func,
    stopTimer: PropTypes.func,
    projectsStore: PropTypes.object,
    tasksStore: PropTypes.object,
    timersStore: PropTypes.object,
  };

  getChildContext() {

    let {
    } = this.props;

    let {
      projectsStore,
      tasksStore,
      timersStore,
    } = this.state;

    let context = {
      request: this.request,
      stopTimer: this.stopTimer,
      projectsStore,
      tasksStore,
      timersStore,
    };

    console.log('getChildContext', context);

    return context;
  }


  constructor(props){

    super(props);

    let {document, user} = props;

    let {
      notifications_store,
    } = document;

    let state = {
      notifications_store,
      projectsStore: new DataStore(new Dispatcher()),
      tasksStore: new DataStore(new Dispatcher()),
      timersStore: new DataStore(new Dispatcher()),
    };

    this.state = state;
  }


  componentDidMount(){

    let {
      user,
      router,
      userActions, 
      documentActions
    } = this.props;

    let {
      projectsStore,
      tasksStore,
      timersStore,
    } = this.state;


    if(!user.user && user.token){
      userActions.GetOwnData();
    }

    
 
    projectsStore.getDispatcher().register((payload) => {

      console.log('projectsStore Dispatch', payload);
      this.forceUpdate();
    });
 
 
    tasksStore.getDispatcher().register((payload) => {

      console.log('tasksStore Dispatch', payload);
      this.forceUpdate();
    });
 
    timersStore.getDispatcher().register((payload) => {

      console.log('timersStore Dispatch', payload);
      this.forceUpdate();
    });


    this.loadAllData();
  }



  //   return true;
  // }

  componentWillReceiveProps(nextProps){

    

    return true;
  }


  componentDidUpdate(prevProps, prevState){

  }

 
  request = (context, allowMultiRequest, connector_path, params, options) => {

    context = context || 'request';

    if(allowMultiRequest === undefined){
      allowMultiRequest = false;
    }

    if(this.state[context] === undefined){
      this.state[context] = {};
    }

    if(!allowMultiRequest && this.state[context].inRequest === true){
      return;
    }


    let {
      connector_url,
      user,
    } = this.props;

    params = params || {}

    Object.assign(params, {
    });
    
    var newState = {};

    newState[context] = this.state[context];

    newState[context].inRequest = true;

    this.setState(newState);

    options = options || {};

    let callback2 = options.callback;

    let callback = (data, errors) => {

      // let errors = {};

      var newState = {};

      newState[context] = this.state[context];

      newState[context].inRequest = false;
      newState[context].errors = errors; 

      this.setState(newState, () => {

        callback2 && callback2(data, errors);
      });

    }
    
    options.callback = callback;

    request.call(this, connector_url, connector_path, params, options);
  }


  loadData(connector_path, params, callback, context, allowMultyRequests){

    // let defaultParams = this.getDefaultParams();
    // let defaultParams = {};

    console.log('loadData params', params, this);

    // let {
    //   connector_path,
    // } = this.state;

    if(!connector_path){
      console.error("Не указан connector_path");
      return;
    }

    params = params || {};

    console.log('defaultParams params', params);

    this.request(context, allowMultyRequests, connector_path, params, {
      callback: (data, errors) => {
        
        if(store){
          this.onLoad(data, errors, store);
        }
      }
    });
  }

  loadMore(){
    // alert('loadMore');
    this.loadData({
      // element_id: this.state.element_id,
    });
  }

  onLoad(data, errors, store){
    // let {store} = this.state;

    if(!store){
      return;
    }

    // console.log('onLoad', this, data, errors);

    if(data.success){

      let element_id;

      // if(data.object && data.object && data.object.length){

      //  element_id = data.object[data.object.length - 1].id;
      // }


      // let newState = {
      //   total: data.object,
      //   // hasMore: data.object.hasMore,
      // };

      // if(element_id){
      //  newState.element_id = element_id;
      // }
      
      let storeState = store.getState(); 

      // storeState = storeState.concat(data.object);

      data.object.map(item => {
        if(!storeState.find(n => {return n.id == item.id})){
          storeState = storeState.push(item);
        }
      })

      store.getDispatcher().dispatch(store.actions['SET_DATA'], storeState);

      this.setState(newState, this.forceUpdate);
    }
  }

  /*
    Eof DataView
  */


  loadItems = (connector_path, store, params) => {
    let {
      connector_url
    } = this.props;

    loadItems.call(this, connector_url, connector_path, store, params);
  }


  saveItem = (store, item, connector_path, callback) => {

    console.log('saveItem', store, item, connector_path);

    if(!store){
      console.error("Store is not defined", this);
      return;
    }

    let {connector_url} = this.props;

    return saveItem.call(this, connector_url, connector_path, store, item, callback);
  }
 

  /*
    Эти данные должны загрузиться изначально, и если пользователь авторизовался
  */
  loadAllData = () => {

    this.loadTimers();
    this.loadProjects();
    this.loadTasks();
  }

  loadTimers(){

    let {
      timersStore,
    } = this.state;


    this.request('timers', false, 'timers/getdata', {}, {
      callback: (data, errors) => {

        if(data.success){

          timersStore.getDispatcher().dispatch(timersStore.actions['SET_DATA'], data.object || []);
        }
      }
    });
  }

  stopTimer = (timer, callback) => {

    let {
    } = this.context;

    let {
      timersStore,
    } = this.state;

    this.request('stop_time', false, 'timer/stop', {
      id: timer && timer.id,
    }, {
      callback: (data, errors) => {
        if(data.success){
          timersStore.getDispatcher().dispatch(timersStore.actions['UPDATE'], timer, data.object);
        }

        callback && callback(data, errors);
      }
    });

    return;
  }
 
  loadProjects(){

    let {
      projectsStore,
    } = this.state;



    this.request('projects', false, 'projects/getdata', {}, {
      callback: (data, errors) => {

        if(data.success){

          projectsStore.getDispatcher().dispatch(projectsStore.actions['SET_DATA'], data.object || []);
        }
      }
    });
  }
 

  loadTasks(){

    let {
      tasksStore,
    } = this.state;

    // connector_path, params, callback, store, context, allowMultyRequests

    this.request(null, true, 'tasks/getdata', {}, {
      callback: (data, errors) => {

        console.log('callback', data, errors);

        if(data.success){
          tasksStore.getDispatcher().dispatch(tasksStore.actions['SET_DATA'], data.object || []);
        }
      }
    });
  }


  loadUserData = () => {
  }
    


  prepareChild(Clone){
    let {
      // children, 
      route,
      user, 
      classes, 
      document,
      userActions: _userActions,
      documentActions: _documentActions,
      connector_url,
      assets_url,
      ...other
    } = this.props;

    let {
      ...cloneProps
    } = this.props.children.props;

    let {
    } = document;
 
    return <Clone
      user={user}
      document={document}
      userActions={_userActions}
      documentActions={_documentActions}
      connector_url={connector_url}
      assets_url={assets_url}
      request={this.request}
      loadData={this.loadData}
      loadMore={this.loadMore}
      onLoad={this.onLoad}
      saveItem={this.saveItem}
      classes={classes || {}}
      {...cloneProps}
    />
  }

  render() {

    let {
      user,
      document,
      documentActions,
      userActions,
      assets_url,
      connector_url,
      ...other
    } = this.props;

    let {
    } = document;

    let {
      notifications_store,
    } = this.state;

    let child;
 
    if(this.props.children){

      let Clone = (this.props.children && this.props.children.type);

      if(Clone){

        child = this.prepareChild(Clone);

      }
    }

 
    // let authOpen = user && user.loginModalOpened || false;
    let authOpen = user && user.user ? false : true;

    return (
      <TemplatesApp {...this.other}>

        {child}
  

        <Auth
          connector_url={connector_url}
          open={authOpen}
        />


        <Informer
          store={notifications_store}
        />  

      </TemplatesApp>
    );
  }
}

MainApp.propTypes = {
  connector_url: PropTypes.string.isRequired,
  documentActions: PropTypes.object.isRequired,
}

MainApp.defaultProps = {
  connector_url: "/api/",
}

function mapDispatchToProps(dispatch) {
  return {
    proxyActions: bindActionCreators(proxyActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    documentActions: bindActionCreators(documentActions, dispatch),
  }
}

function mapStateToProps(state) {

  var currentState = {};

  Object.assign(currentState, state.document);

  currentState.user = state.user;
  currentState.document = state.document;

  return currentState;
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
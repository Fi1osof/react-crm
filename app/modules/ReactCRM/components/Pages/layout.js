import React, {Component} from 'react';

import PropTypes from 'prop-types';

const defaultProps = {}

export default class Page extends Component{

	constructor(props){

		super(props);

		this.state = {}
	}

	componentWillMount(){

	}

	componentDidMount(){

		this.setPagetitle();
	}

  componentDidUpdate(){

    if(this.props.debug){
      console.log("Page componentDidUpdate", this);
    }
  }

  setPagetitle(title){
  	title = title || 'Главная страница';

  	if(typeof window != "undefined"){
  		window.document.title = title;
  	}
  }

  request(context, allowMultiRequest, connector_path, params, options){

    return this.props.request(context, allowMultiRequest, connector_path, params, options);
  }

  loadData(connector_path, params, callback, context, allowMultyRequests){
    let {
      loadData,
    } = this.props;

    return loadData(connector_path, params, callback, context, allowMultyRequests);
  }

  saveItem(store, item, connector_path, callback){

    console.log('saveItem 2', store, item, connector_path);

    let {
    	saveItem,
    } = this.props;

    return saveItem(store, item, connector_path, callback);
  }

	render(){

		return null;
	}
}

Page.defaultProps = defaultProps;

Page.propTypes = {
	// saveItem: PropTypes.func.isRequired,
}

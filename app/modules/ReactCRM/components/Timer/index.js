import React, {Component} from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';

const defaultProps = {}

export default class Timer extends Component{

	constructor(props){

		super(props);

 
		this.state = {
			now: new Date().getTime(),
		}
	}

	componentWillMount(){

	}

	componentDidMount(){
    this.timer = setInterval(() => {
      this.forceUpdate();
    }, 1000);
	}

  componentDidUpdate(){

    if(this.props.debug){
      console.log("Timer componentDidUpdate", this);
    }
  }

  componentWillUnmount(){
    if(this.timer){
      clearInterval(this.timer);
    }
  }

  getTimer(start, format){

    start = Number(start);

    format = format || 'HH:mm:ss';

    let timer = null 

    if(start){

      let diff = new Date().getTime() - start;
    
      if(diff > 0){
        // getTimezoneOffset нужен, так как в данном случае moment.js не учитывает таймзону
        timer = moment(new Date().getTimezoneOffset() * 60 * 1000 + Number(diff)).format(format)
      }
    }



 		if(typeof window != "undefined"){
 			window.document.title = timer;
 		}

    return timer;
  }

  getCountdownTimer(start, delay, format){

    start = Number(start);

    format = format || 'mm:ss';

    let timer = null 

    if(start){

      let diff = delay - (new Date().getTime() - start);
    
      if(diff > 0){
        // getTimezoneOffset нужен, так как в данном случае moment.js не учитывает таймзону
        timer = moment(new Date().getTimezoneOffset() * 60 * 1000 + Number(diff)).format(format)
      }
    }

    return timer;
  }

	render(){

		let {
			now,
		} = this.state;

    let timer = this.getTimer(now);

		return <i>{timer}</i>;
	}
}

Timer.defaultProps = defaultProps;

Timer.propTypes = {}

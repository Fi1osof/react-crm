import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {DataStore, Dispatcher} from 'react-cms-data-view';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'material-ui-icons/AddCircle';
import PlayIcon from 'material-ui-icons/PlayArrow';
import SaveIcon from 'material-ui-icons/Save';
import StopIcon from 'material-ui-icons/Stop';
import DeleteIcon from 'material-ui-icons/Delete';

import Timer from 'modules/ReactCRM/components/Timer';

import AutoComplete from 'material-ui-components/src/AutoComplete';

import ProjectsField from './inc/Projects';
import TasksField from './inc/Tasks';

const defaultProps = {}

export default class QueuePanel extends Component{

	static contextTypes = {
		request: PropTypes.func.isRequired,
		stopTimer: PropTypes.func.isRequired,
		projectsStore: PropTypes.object.isRequired,
		timersStore: PropTypes.object.isRequired,
	};

	constructor(props){

		super(props);

		this.state = {
			// task_name: '',
			// task: null,
			// projectName: '',
			project: null,
			timer: null,
		}
	}

	componentWillMount(){

	}

	componentDidMount(){

	}

  componentDidUpdate(){

    if(this.props.debug){
      console.log("QueuePanel componentDidUpdate", this);
    }
  }

  stateTimer(event){

  	let {
  		request,
  		timersStore,
  	} = this.context;

  	let {
  		task,
  	} = this.state;

  	let timer = {
  		task_id: task && task.id,
  	};

  	request('start_time', false, 'timer/create', timer, {
  		callback: (data, errors) => {
  			if(data.success){

  				Object.assign(timer, {
			  		task_title: task.title,
  				}, data.object);

			  	this.setState({
			  		timer,
			  	});

			  	timersStore.getDispatcher().dispatch(timersStore.actions['CREATE'], timer);
  			}
  		}
  	});
  }

  stopTimer(event){

  	// let {
  	// 	request,
  	// 	timersStore,
  	// } = this.context;

  	// let {
  	// 	timer,
  	// } = this.state;

  	// request('start_time', false, 'timer/stop', {
  	// 	id: timer && timer.id,
  	// }, {
  	// 	callback: (data, errors) => {
  	// 		if(data.success){

			//   	timersStore.getDispatcher().dispatch(timersStore.actions['UPDATE'], timer, data.object);

			//   	this.setState({
			//   		timer: null,
			//   	});
  	// 		}
  	// 	}
  	// });

  	let {
  		stopTimer,
  	} = this.context;

  	let {
  		timer,
  	} = this.state;

  	stopTimer(timer, (data, errors) => {
			if(data.success){

		  	this.setState({
		  		task: null,
		  		project: null,
		  		timer: null,
		  	});
			}
  	});

  	return;
  }

	render(){

 		let { 
 			task,
 			project,
 			timer,
 		} = this.state;

 		let timerAction;

 		if(task){

 			if(!timer || !timer.start){
 				timerAction = <IconButton
					onTouchTap={event => this.stateTimer()}
				>
					<PlayIcon 
					/>
				</IconButton>
 			}
 			else if(timer && !timer.end){
 				timerAction = <IconButton
					onTouchTap={event => this.stopTimer()}
				>
					<StopIcon 
					/>
				</IconButton>
 			}
 		}

		return <Grid
			container
			align="center"
		>
			<TasksField
				project={project}
				onTaskSelect={task => {
					console.log('onTaskSelect', task);
					this.setState({task});
				}}
			/>

			<ProjectsField
				onProjectSelect={project => {
					console.log('onProjectSelect', project);
					this.setState({project});
				}}
			/>

			{timer && timer.start && !timer.end
				?
				<Timer />
				:
				null}

			{timerAction}

			{task
				?
					<IconButton>
						<DeleteIcon />
					</IconButton>
				:
				null
			}


		</Grid>;
	}
}

QueuePanel.defaultProps = defaultProps;

QueuePanel.propTypes = {}

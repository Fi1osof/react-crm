import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'material-ui-icons/AddCircle';
import PlayIcon from 'material-ui-icons/PlayArrow';
import SaveIcon from 'material-ui-icons/Save';
import DeleteIcon from 'material-ui-icons/Delete';

import {DataStore, Dispatcher} from 'react-cms-data-view';
import AutoComplete from 'material-ui-components/src/AutoComplete';

const defaultProps = {}

export default class Tasks extends Component{

	static propTypes = {
		onTaskSelect: PropTypes.func.isRequired,
	}

	static contextTypes = {
		request: PropTypes.func.isRequired,
		tasksStore: PropTypes.object.isRequired,
	};

	constructor(props){

		super(props);

		this.state = {
			tasks_store: new DataStore(new Dispatcher()),
		}
	}

	componentWillMount(){

	}

	componentDidMount(){

	}

  componentDidUpdate(prevProps, prevState){

    let {
    	task,
    } = this.state;

    let {
    	onTaskSelect,
    } = this.props;
  
    if(
    	(task || prevState.task) 
    	&& task != prevState.task
    ){
    	onTaskSelect && onTaskSelect(task);
    }
  }

	updateCurrentTaskName(event){
		let{
			value
		} = event.target;

		this.setState({
			task_name: value,
			task: null,
		}, () => {
			this.findTask();
		});
	}

	findTask(){
		let {
			task_name,
			tasks_store,
		} = this.state;

		let {
			project,
		} = this.props;

		let {
			request,
		} = this.context;

		request('tasks', false, 'tasks/getdata', {
			query: task_name, 
			project: project && project.id, 
		},{
			callback: (data, errors) => {

				console.log('callback', data, errors);

				if(data.success){
					tasks_store.getDispatcher().dispatch(tasks_store.actions['SET_DATA'], data.object || []);
				}
			}
		});
	}

	setActiveTask(item){
		this.setState({
			task: item,
		});
	}

	createTask(event){

		let {
			project,
		} = this.props;

 		let {
 			task_name,
 			tasks_store,
 		} = this.state;

		let {
			request,
			tasksStore,
		} = this.context;

		let task = {
			project_id: project && project.id,
			title: task_name,
		}

		request('tasks', false, 'tasks/create', task,{
			callback: (data, errors) => {

				console.log('callback', data, errors);

				if(data.success){

					Object.assign(task, data.object, {
						project_title: project.title,
					});

					tasks_store.getDispatcher().dispatch(tasks_store.actions['CREATE'], task);
					tasksStore.getDispatcher().dispatch(tasksStore.actions['CREATE'], task);

					this.setState({task});
				}
			}
		});

	}

	render(){

		let {

 			project,
		} = this.props;

 		let {
 			tasks_store,
 			task_name,
 			task,
 			projectName,
 		} = this.state;

 		let dataSource = [];

 		tasks_store.getState().map(n => {
 			n.formattedField=<span><b>{n.id})</b> {n.title} / {n.project_title}</span>;
 			dataSource.push(n);
 		});

		return <Grid
			item
			xs
		>
			<Grid
				container
				gutter={0}
			>
				
				<AutoComplete
					placeholder="Укажите задачу"
					style={{
						flexGrow: 1,
						marginRight: 5,
					}}
					title={task_name}
					dataSource={dataSource}
					displayField="title"
					displayFormattedField="formattedField"
					onFocus={event => {
						this.findTask();
					}}
					onUpdateInput={event => {
						this.updateCurrentTaskName(event);
					}}
					onNewRequest={(event, value, item)=>{
						// console.log('onNewRequest 2', item);
						this.setActiveTask(item);
					}}
				/>

				{task_name && !task
					?
					<IconButton
						onTouchTap={event => {this.createTask(event)}}
					>
						<SaveIcon />
					</IconButton>
					:
					null
				}
			</Grid>

		</Grid>;
	}
}

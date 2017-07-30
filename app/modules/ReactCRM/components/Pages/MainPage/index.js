import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Page from '../layout'; 

import {DataStore, Dispatcher} from 'react-cms-data-view';

import Timer from 'modules/ReactCRM/components/Timer';

import moment from 'moment';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import AddIcon from 'material-ui-icons/AddCircle';
import PlayIcon from 'material-ui-icons/PlayArrow';
import StopIcon from 'material-ui-icons/Stop';
import SaveIcon from 'material-ui-icons/Save';
import DeleteIcon from 'material-ui-icons/Delete';

import QueuePanel from './inc/QueuePanel';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';


export default class MainPage extends Page{

	static contextTypes = {
		request: PropTypes.func.isRequired,
		stopTimer: PropTypes.func.isRequired,
		projectsStore: PropTypes.object.isRequired,
		tasksStore: PropTypes.object.isRequired,
		timersStore: PropTypes.object.isRequired,
	};

	constructor(props){

		super(props);

		Object.assign(this.state, {
		});
	}
 


	addTask(event){
		let {
			tasksStore,
		} = this.state;

		tasksStore.getDispatcher().dispatch(tasksStore.actions['CREATE'], {
			title: "",
		});

		this.forceUpdate();
	}

 
	saveTask(task){
// store, item, connector_path, callback
		this.saveItem(this.state.tasksStore, task, 'task/');
	}


 	render(){

 		let {
 		} = this.state;

 		let {
 			tasksStore,
 			projectsStore,
 			timersStore,
 			stopTimer,
 		} = this.context;

 		let format = 'YYYY-MM-DD HH:mm:ss';

 		let timers = [];
 		let tasks = [];
 		let projects = [];

 		timersStore.getState().map(timer => {
 			
 			let action;

 			if(timer.start && !timer.end){
	 			action = <IconButton
	 				onTouchTap={event => {
	 					stopTimer(timer);
	 				}}
	 			>
					<StopIcon />
				</IconButton>;
 			}


 			timers.push(<TableRow
 				key={timers.length}
 			>
				<TableCell>
					{action}
				</TableCell>

				<TableCell>
					{timer.id}
				</TableCell>

				<TableCell>
					{timer.task_title}
				</TableCell>

				<TableCell>
					{timer.project_title}
				</TableCell>

				<TableCell>
					{timer.start && moment(timer.start).format(format)}
				</TableCell>

				<TableCell>
					{timer.end && moment(timer.end).format(format)}
				</TableCell>

			</TableRow>);
 		});

 		tasksStore.getState().map(task => {
 			
 			let action;

 			if(task.id){
	 			action = <IconButton>
					<PlayIcon />
				</IconButton>;
 			}
 			else{
	 			action = <IconButton
	 				onTouchTap={event => this.saveTask(task)}
	 			>
					<SaveIcon />
				</IconButton>;
 			}


 			tasks.push(<TableRow
 				key={tasks.length}
 			>
				<TableCell>
					{action}
				</TableCell>

				<TableCell>
					{task.id}
				</TableCell>

				<TableCell>
					{task.project_title}
				</TableCell>

				<TableCell>
					{task.title}
				</TableCell>

				<TableCell>
					{task.duration}
				</TableCell>

			</TableRow>);
 		});

 		projectsStore.getState().map(project => {
 			
 			let action; 

 			projects.push(<TableRow
 				key={projects.length}
 			>
				<TableCell>
					{action}
				</TableCell>

				<TableCell>
					{project.id}
				</TableCell>

				<TableCell>
					{project.title}
				</TableCell>  

			</TableRow>);
 		});

		return <Grid
			container
		>
			<Grid 
				item
				xs={12}
			>
				
				<QueuePanel 
				/>

			</Grid>

			<Grid 
				item
				xs={12}
			>
				Таймеры

				<IconButton
					accent
					onTouchTap={event => {
						this.addTask();
					}}
				>
					<AddIcon />
				</IconButton>

				<div>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									
								</TableCell>
								<TableCell>
									ID
								</TableCell>
								<TableCell>
									Задача
								</TableCell>
								<TableCell>
									Проект
								</TableCell>
								<TableCell>
									Начало
								</TableCell>
								<TableCell>
									Конец
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{timers}
						</TableBody>

					</Table>

				</div>

			</Grid>


			<Grid 
				item
				xs={12}
				md={6}
			>
				Проекты

				<IconButton
					accent
				>
					<AddIcon />
				</IconButton>

				<div>

					<Table>

						<TableHead>
							<TableRow>
								<TableCell>
									
								</TableCell>
								<TableCell>
									ID
								</TableCell>
								<TableCell>
									Проект
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{projects}
						</TableBody>

					</Table>

				</div>

			</Grid>

			<Grid 
				item
				xs={12}
				md={6}
			>
				Задачи

				<IconButton
					accent
					onTouchTap={event => {
						this.addTask();
					}}
				>
					<AddIcon />
				</IconButton>

				<div>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									
								</TableCell>
								<TableCell>
									ID
								</TableCell>
								<TableCell>
									Проект
								</TableCell>
								<TableCell>
									Задача
								</TableCell>
								<TableCell>
									Время
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{tasks}
						</TableBody>

					</Table>

				</div>

			</Grid>

		</Grid>;
	}
}


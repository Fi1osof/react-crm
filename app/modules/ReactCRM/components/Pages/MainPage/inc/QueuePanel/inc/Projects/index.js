import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'material-ui-icons/AddCircle';
import PlayIcon from 'material-ui-icons/PlayArrow';
import SaveIcon from 'material-ui-icons/Save';
import DeleteIcon from 'material-ui-icons/Delete';

import AutoComplete from 'material-ui-components/src/AutoComplete';
// import Dialog from 'material-ui-components/src/ItemDialog';

// class Editor extends Component{

//   constructor(props){

//     super(props);

//     this.state = {
//     }
//   }


//   render() {

//     let {
//       open,
//       item,
//       ...other
//     } = this.props;

//     return open && item 
//       ?
//       <Dialog 
//         open={open}
//         item={item}
//         {...other}
//       >
//       	gdfdgfd
//       </Dialog>
//     : null;
//   }
// }


const defaultProps = {}

export default class Projects extends Component{

	static propTypes = {
		onProjectSelect: PropTypes.func.isRequired,
	}

	static contextTypes = {
		request: PropTypes.func.isRequired,
		projectsStore: PropTypes.object.isRequired,
	}

	constructor(props){

		super(props);

		this.state = {
			project_name: "",
		}
	}

	componentWillMount(){

	}

	componentDidMount(){

	}

  componentDidUpdate(prevProps, prevState){

    let {
    	project,
    } = this.state;

    let {
    	onProjectSelect,
    } = this.props;
 

    if(
    	(project || prevState.project) 
    	&& project != prevState.project
    ){
    	onProjectSelect && onProjectSelect(project);
    }
  }

	updateCurrentProjectName(event){
		let{
			value
		} = event.target;

		this.setState({
			project_name: value,
			project: null,
		}, () => {
			this.findProject();
		});
	}

	findProject(){
		let {
			project_name,
		} = this.state;

		let {
			projectsStore,
		} = this.context;

		// request('tasks', false, 'tasks/getdata', {
		// 	query: task_name, 
		// 	test: "FDSgfdg",
		// 	aaaa: "DSfdsfds",
		// },{
		// 	callback: (data, errors) => {

		// 		console.log('callback', data, errors);

		// 		if(data.success){
		// 			tasks_store.getDispatcher().dispatch(tasks_store.actions['SET_DATA'], data.object || []);
		// 		}
		// 	}
		// });
	}

	setActiveProject(item){
		this.setState({
			project: item,
		});
	}

	createProject(event){

		// let {
		// 	project_id,
		// } = this.props;

 		let {
 			project_name,
 		} = this.state;

		let {
			request,
			projectsStore,
		} = this.context;

		let project = {
			title: project_name,
		}

		request('project', false, 'projects/create', project,{
			callback: (data, errors) => {

				console.log('callback', data, errors);

				if(data.success){

					Object.assign(project, data.object);

					projectsStore.getDispatcher().dispatch(projectsStore.actions['CREATE'], project);

					this.setState({
						project,
					});
				}
			}
		});

	}

	render(){

 		let {
 			project_name,
 			project,
 		} = this.state;

 		let {
 			projectsStore,
 		} = this.context;

 		let projectsDataSource = [];

 		projectsStore.getState().map(n => {
 			projectsDataSource.push(Object.assign(n, {}));
 		});

		// return <Editor
		// 	open={true}
		// 	item={{}}
		// 	title="dsfdsf"
		// 	classes={{}}
		// 	onRequestClose={e => {}}
		// 	saveItem={e => {}}
		// >
		// 	wefewf
		// </Editor>

		return <Grid
			item
		>
			<Grid
				container
				gutter={0}
			>
				<AutoComplete
					dataSource={projectsDataSource}
					displayField="title"
					displayFormattedField="formattedField"
					// label="Проект"
					placeholder="Укажите проект"
					title={project_name}
					onFocus={event => {
						this.findProject();
					}}
					// onChange={event => {
					// 	console.log('onChange', event);
					// 	this.updateCurrentProjectName(event);
					// }}
					onUpdateInput={event => {
						console.log('onUpdateInput', event);
						this.updateCurrentProjectName(event);
					}}
					onNewRequest={(event, value, item)=>{
						// console.log('onNewRequest 2', item);
						this.setActiveProject(item);
					}}
				/>

				{project_name && !project
					?
					<IconButton
						onTouchTap={event => {this.createProject(event)}}
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


var debug = require('debug')("server:response");

// var knex = require('knex')({
//   dialect: 'sqlite3',
//   connection: {
//     filename: './db/data.db'
//   },
//   useNullAsDefault: true,
//   charset  : 'utf8',
// });


// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host : 'localhost',
//     user : 'react-crm',
//     password : 'react-crm',
//     database : 'react-crm',
//     // charset: charset ,
//   }
// });

import moment from 'moment';

var knex;

export default class Response{

  constructor(req, res, params, knexdb){
	// constructor(req, res, params){

    knex = knexdb;

		this.req = req;
    this.res = res;
		this.params = params;

		console.log('Response constructor', req.query, 'res');
	}

  process(){
    // let {
    //   pub_action,
    // } = this.req.query;


    let {
      pub_action,
      ...params 
    } = this.getRequestParams();

    console.log('Query params', params);

    switch(pub_action){

      case 'registration':

        return this.doRegistration(req.query);

        // return processResponse(req, res, response);
        break;

      case 'tasks/getdata':

        // return appRouter.doTaskGetdata(req.query);

        // console.log('this.req.query', this.req.query);
        // console.log('this.req.body', this.req.body);

        // let {
        //   query,
        // } = this.req.query;

        var {
          project,
          query,
        } = params;

        var q = knex('tasks')
          .select('tasks.*')
          .select([
            'projects.title as project_title',
          ])
          // .select(knex.raw('LOWER(title) as `lower`'))
          .innerJoin('projects', 'project_id', 'projects.id')
          ;

        if(project){
          q.where({
            project_id: parseInt(project),
          });
        }

        if(query){
            q.where('tasks.title', 'LIKE', `%${query}%`);
        }
          
          
          // if(query){
          //   // q.where('LOWER("title")', 'LIKE', `%${query.toLocaleLowerCase()}%`);
          //   q.where(
          //     // knex.raw('LOWER("title") = ?', `%${query.toLocaleLowerCase()}%`)
          //     // knex.raw(`LOWER("title") LIKE '%${query.toLocaleLowerCase()}%'`)
          //     knex.raw(`LOWER("title") LIKE 'Новая'`)
          //   );
          // }

          debug('.toSQL()', q.toSQL());

          q.then((result) => {
            debug('task', result);

            return this.success('', result);

            // success(req, res, {
            //   success: true,
            //   object: a,
            // });
          });

        return ;
        break;

      case 'tasks/create':

        if(!params.title){
          return this.failure("Не указано название задачи");
        }

        if(!params.project_id){
          return this.failure("Не указан проект");
        }

        knex('tasks')
          // .insert({
          //   title: "Новая задача",
          //   user_id: 1,
          // })
          .insert(params)
          .then((a) => {
            console.log('task insert', a);

            return this.success('Задача успешно создана', {
              id: a && a[0],
            });

            // knex('tasks')
            // .select()
            // .where({
            //   id: a[0]
            // })
            // .then((a) => {
            //   console.log('task select', a);

            //  return this.success('Задача успешно создана', {
            //    id: a && a[0],
            //  });
            //   // success(req, res, {
            //   //   success: true,
            //   //   object: a && a[0] || {},
            //   // });
            // });

            return;
          });

        return ;
        break;

      case 'projects/getdata':
 

        // let {
        //   query,
        // } = this.req.query;

        var q = knex('projects')
          .select()
          // .select([
          //   'id',
          //   'title',
          //   // 'LOWER("title")',
          //   // knex.lower("title"),
          // ])
          // .select(knex.raw('LOWER(title) as `lower`'))
          ;
          
          
          // if(query){
          //   // q.where('LOWER("title")', 'LIKE', `%${query.toLocaleLowerCase()}%`);
          //   q.where(
          //     // knex.raw('LOWER("title") = ?', `%${query.toLocaleLowerCase()}%`)
          //     // knex.raw(`LOWER("title") LIKE '%${query.toLocaleLowerCase()}%'`)
          //     knex.raw(`LOWER("title") LIKE 'Новая'`)
          //   );
          // }

          debug('.toSQL()', q.toSQL());

          q.then((result) => {
            debug('projects', result);

            return this.success('', result);
 
          });

        return ;
        break;

      case 'projects/create':

        if(!params.title){
          return this.failure("Не указано название проекта");
        }

        Object.assign(params, {
          owner: 1,
        });

        if(!params.owner){
          return this.failure("Не указан владелец проекта");
        }

        knex('projects')
          // .insert({
          //   title: "Новая задача",
          //   user_id: 1,
          // })
          .insert(params)
          .then((a) => {
            console.log('projects insert', a);

            return this.success('Проект успешно создан', {
              id: a && a[0],
            });

            // knex('tasks')
            // .select()
            // .where({
            //   id: a[0]
            // })
            // .then((a) => {
            //   console.log('task select', a);

            //  return this.success('Задача успешно создана', {
            //    id: a && a[0],
            //  });
            //   // success(req, res, {
            //   //   success: true,
            //   //   object: a && a[0] || {},
            //   // });
            // });

            return;
          });

        return ;
        break;

      case 'timers/getdata':

        // return appRouter.doTaskGetdata(req.query);

        // console.log('this.req.query', this.req.query);
        // console.log('this.req.body', this.req.body);

        // let {
        //   query,
        // } = this.req.query;

        var q = knex('timers')
          .select('timers.*')
          .select([
            'tasks.title as task_title',
            'projects.title as project_title',
          ])
          // .select(knex.raw('LOWER(title) as `lower`'))
          .innerJoin('tasks', 'task_id', 'tasks.id')
          .innerJoin('projects', 'tasks.project_id', 'projects.id')
          ;
          
          
          // if(query){
          //   // q.where('LOWER("title")', 'LIKE', `%${query.toLocaleLowerCase()}%`);
          //   q.where(
          //     // knex.raw('LOWER("title") = ?', `%${query.toLocaleLowerCase()}%`)
          //     // knex.raw(`LOWER("title") LIKE '%${query.toLocaleLowerCase()}%'`)
          //     knex.raw(`LOWER("title") LIKE 'Новая'`)
          //   );
          // }

          debug('timers/getdata .toSQL()', q.toSQL());

          q
            .then((result) => {
              debug('timers result', result);

              return this.success('', result);

              // success(req, res, {
              //   success: true,
              //   object: a,
              // });
            })
            .catch(error => {
              console.error("Error select timers.", error);
              return this.failure("Ошибка выполнения запроса");
            });

        return ;
        break;

      case 'timer/create':

        if(!params.task_id){
          return this.failure("Не указана задача");
        }

        Object.assign(params, {
          start: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        knex('timers')
          .insert(params)
          .then((a) => {
            console.log('timer insert', a);

            Object.assign(params, {
              id: a && a[0],
            });
            return this.success('Таймер успешно запущен', params);

            return;
          });

        return ;
        break;

      case 'timer/stop':

        if(!params.id){
          return this.failure("Не указан ID таймера");
        }

        // Object.assign(params, {
        //   ent: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });

        /*
          Пытаемся получить таймер
        */
        var q = knex('timers')
          .select()
          .limit(1)
          .where("id", params.id)
          ;
          
          
          // if(query){
          //   // q.where('LOWER("title")', 'LIKE', `%${query.toLocaleLowerCase()}%`);
          //   q.where(
          //     // knex.raw('LOWER("title") = ?', `%${query.toLocaleLowerCase()}%`)
          //     // knex.raw(`LOWER("title") LIKE '%${query.toLocaleLowerCase()}%'`)
          //     knex.raw(`LOWER("title") LIKE 'Новая'`)
          //   );
          // }

          debug('.toSQL()', q.toSQL());

          q.then((result) => {
            debug('timers', result);

            if(!result && !result.length){
              return this.failure("Не был получен таймер");
            }

            // else
            var timer = result[0];

            if(timer.end){
              
              return this.failure("Таймер уже был остановлен");
            }

            /*
              Если все ОК, обновляем таймер
            */

            var newData = {
              end: moment().format('YYYY-MM-DD HH:mm:ss'),
            };

            var q = knex('timers')
              .update(newData)
              .where("id", params.id)
              ;

              debug('Update timer .toSQL()', q.toSQL());


              q.then((result) => {
                debug('Update timer result', result);

                if(result){

                  return this.success("Таймер успешно остановлен", newData);
                }

                // else
                return this.failure("Не удалось обновить таймер");
              });

            // return this.success('', result);

            // success(req, res, {
            //   success: true,
            //   object: a,
            // });
          });

        // knex('timers')
        //   .insert(params)
        //   .then((a) => {
        //     console.log('timer insert', a);

        //     return this.success('Таймер успешно запущен', {
        //       id: a && a[0],
        //     });

        //     return;
        //   });

        return ;
        break;
    }

    return this.failure("Неизвестное действие");
  }

  getRequestParams(){
    let params = this.params || {};
    let query = this.req.query || {};

    return Object.assign(query, params);
  }

  success(message, object){

  	return this.outputResponse(true, message, object)
  }

  failure(message, object){

  	return this.outputResponse(false, message, object)
  }

  outputResponse(success, message, object){

  	let output = {
  		success,
  		message,
  		object,
  	}

    this.res.writeHead(200, {'Content-Type': 'application/json'});
    this.res.end(JSON.stringify(output));
  }



  doRegistration(data){

    return this.success('');
  }


  doTaskCreate(data){

    console.log('doTaskCreate', data);

    return this.success('');
  }

}
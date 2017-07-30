'use strict';

// import React    from 'react';
// import ReactDOMServer from 'react-dom/server';

var Model = require('objection').Model;

var bodyParser = require('body-parser');

// var runner = require('child_process');

// var php = require('phpjs');


import Response from './components/response';


// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();

// import Document      from '../../../src/components/templates/document/';
// import App      from '../../../src/components/templates/app';
// import InitialState  from '../../../src/redux/reducers/';

// Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2450.67 Safari/537.36
// global.navigator = global.navigator || {};
// global.navigator.userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2450.67 Safari/537.36';

// var AppHTML = () => ( < App / > );

// const componentHTML = ReactDOMServer.renderToString(<AppHTML />);


// import configureStore from '../../../src/redux/configureStore';

// var charset = 'utf8_general_ci';
// var charset = 'utf8mb4_unicode_ci';

// var knex = require('knex')({
//   dialect: 'sqlite3',
//   connection: {
//     filename: './db/data.db'
//   },
//   useNullAsDefault: true,
//   charset  : 'utf8',
// });

import {db as db_config} from '../../config/config';

// console.log('config', db_config);

var knex = require('knex')(db_config);


knex.schema.createTableIfNotExists('users', function(table) {
  // table.charset(charset);
  table.increments('id');
  table.string('username');
  table.string('fullname');
  table.string('password');
})
.then(function() {
  // return knex.insert({username: 'Tim'}).into('users');
  // let sql = knex.insert({id: 1}).into('users');

  // console.log('sql', sql);
  // // console.log('sql', sql.execute());

  // knex(sql);
  // return sql;
});


knex.schema.createTableIfNotExists('projects', function(table) {
  table.increments('id');
  table.string('title');  
  table.integer('owner').unsigned().references('users.id');
})
  .then(function(){ 
  })

knex.schema.createTableIfNotExists('tasks', function(table) {
  table.increments('id');
  table.string('title');
  table.datetime('start');
  table.datetime('end');
  table.integer('user_id').unsigned().references('users.id');
  table.integer('project_id').unsigned().references('projects.id');
})
  .then(function(){ 
  })

knex.schema.createTableIfNotExists('timers', function(table) {
  table.increments('id');
  table.integer('task_id').unsigned().references('tasks.id');
  table.datetime('start');  
  table.datetime('end');  
})
  .then(function(){ 
  })

// knex('users')
//   .insert({
//     id: 1,
//     username: 'Fi1osof',
//     fullname: 'Николай Ланец',
//   })
//   // .into('users')
//   .then();

// .then(function() {
//   // return knex.insert({username: 'Tim'}).into('users');
//   return knex.insert({id: null}).into('users');
// })

// Create a table 
// knex.schema.createTableIfNotExists('tasks', function(table) {
//   table.increments('id');
//   table.string('title');  
//   table.integer('user_id').unsigned().references('users.id');
// })
//   .then(function(){

// knex('tasks')
//   .insert({
//     title: "Новая задача",
//     user_id: 1,
//   })
//   .then();

// knex('tasks').select().then(function (a) { 
//   console.log('task', a);
// })
//   })



// class AppRouter{

//   // doTaskGetdata(data){

//   //   console.log('doTaskCreate', data);

//   //   return this.success();
//   // }
// }

// let appRouter = new AppRouter();



let styles = {};

module.exports = function (options) {



  var options = options || {};

  var express = require('express');
  var router = express.Router();

  var debug = require('debug')("server:router/modx");

  var querystring = require('querystring');

  var mime = require('mime-types');
  var path = require('path');

  var http = require('http');

  var fs = require('fs');
  // var md5 = require('md5');

  // var runner = require('child_process');


  /*
  * Надстройка WebSocket для роутера
  * */
  // var expressWs = require('express-ws')(options.app);
  require('express-ws')(options.app);

  let clients = [];
  let users = [];

  var host = options.host;
  let raw_host_port = options.raw_host_port;
  ;


  debug("Server started");


  var cfg = {
    hot_reload_debug: options.hot_reload_debug,
    hot_reload_port: options.hot_reload_port,
    ssl: false,
    // port: port,
    // ssl_key: '/opt/letsencrypt/certs/modxclub.ru/privkey.pem',
    // ssl_cert: '/opt/letsencrypt/certs/modxclub.ru/fullchain.pem'
  };

  // var host = options.host;

  var httpServ = (cfg.ssl) ? require('https') : require('http');


  // debug("WS Started");
  // ;
  //
  // router.ws('/api/', function(ws, req) {
  //
  //   console.log("Init On Message");
  //
  //   ws.on('message', function(msg) {
  //
  //     debug("WS OnMessage");
  //
  //     debug(msg);
  //
  //     ws.send(msg);
  //   });
  //
  //   ws.on('connection', function(socket) {
  //
  //     debug("WS OnConnection");
  //
  //     debug(socket);
  //   });
  // });

  /*
  * API
  * */
  //


  function SendMessage(client, message, original_message){
    if(client && client.readyState == client.OPEN){

      // console.log(client);

      if(typeof message !== "object"){
        message = {
          text: "message"
        };
      }

      if(!message.ts){
        message.ts = new Date().getTime();
      }

      delete message.cookie;
      delete message.password;

      if(original_message){

        delete original_message.cookie;
        delete original_message.password;

        message.original_message = original_message;
      }

      client.send(JSON.stringify(message));
    }

    // console.log(message);
  }

  // function SendUsersActivity(){

  //   var users_list = [];
  //   var ids = {};

  //   var total_active_clients = 0;

  //   for(var i in clients){
  //     var client = clients[i];

  //     if(
  //       client.readyState == client.OPEN
  //     ){

  //       total_active_clients++;

  //       if(
  //         client.user
  //         && client.user.id
  //         && !ids[client.user.id]
  //       ){
  //         ids[client.user.id] = true;
  //         users_list.push(client.user);
  //       }
  //     }
  //   }


  //   users_list.reverse();

  //   // for(var i in clients){
  //   //   SendMessage(clients[i], {
  //   //     type: "active_users_list",
  //   //     users: users_list,
  //   //   });
  //   // }

  //   /*
  //   * Если список пользователей изменился, отправляем статистику
  //   * */
  //   if(md5(users_list) != md5(users)){
  //     users = users_list;

  //     SendMessageToAll(client, {
  //       type: "active_users_list",
  //       users: users,
  //     });
  //   }


  //   debug('SendUsersActivity');
  //   debug('total_active_clients', total_active_clients);
  //   debug('users', users);
  //   return;
  // }


  // setInterval(SendUsersActivity, 10000);



  function SendMessageToAll(ws, message, original_message, exclude_current){

    delete message.cookie;
    delete message.password;

    if(original_message){
      delete original_message.cookie;
      delete original_message.password;
    }

    for(var i in clients){

      var client = clients[i];

      if(exclude_current && client == ws){
        continue;
      }

      SendMessage(client, message, original_message);
    }
  }


  function success(req, res, response, knex){
    

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
  }

  function failure(req, res, response){


    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
  }


  function processResponse(req, res, response){
    if(response.success){
      return success(req, res, response);
    }
    else{
      return failure(req, res, response);
    }
  }

  // router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //   extended: false,
  // })); 
  // router.use(bodyParser.json());       // to support JSON-encoded bodies


  // var urlencodedParser = bodyParser.urlencoded({ extended: false })
  // router.post('/api/', urlencodedParser, function(req, res) {

  router.post('/api/', function(req, res) {

    debug("Server. Request Requested");
    // console.log("Server. Request Requested", req.query);
    // console.log("Server. Request body", req.body);

    var body = "";

    let request = {};

    req.on('data', chunk => {
      // console.log('got data chunk', chunk);
      body += chunk;
    });

    req.on('end', () => {
      // console.log('got End', data);

      // console.log('got body', body, typeof body);

      // var result = bodyParser(body);

      // console.log('body parser', body);

      // var jsonObj = JSON.parse(body);

      // console.log('got body JSON', jsonObj);

      // var match = body.match(/form-data; name="(.+?)"(.*?)------/);

      /*
      ------WebKitFormBoundaryIotr7gIyuLHb3Xm0
Content-Disposition: form-data; name="query"
*/
      // var preg = 'Content-Disposition: form-data; name="(.+?)"(.*?)------WebKitFormBoundary';
      // var preg = 'Content-Disposition: form-data; name="(.+?)"([\s\S]+?)-------';
      var preg = 'name="(.+?)"([\s\S]+?)------';

      // var match = body.match(new RegExp(preg, 'mgu'));
      // var match = new RegExp(preg, 'gu').exec(body);
      var match = body.match(/Content-Disposition: form-data; name="(.+?)"([\s\S]+?)------/g)

      if(match && match.length){
        match.map(str => {
          // let result = str.match(new RegExp(preg, 'mu'));

          // let result = str.match(/Content-Disposition: form-data; name="(.+?)"((\s*)(\S*)(\s*)?)------/);
          let result = str.match(/Content-Disposition: form-data; name="(.+?)"[\s]*(.*)/);

          // console.log('result', result);

          if(result){
            let {
              1: name,
              2: value,
            } = result;

            // value = value.replace(//);

            request[name] = value;
          }
        });
      }

      // console.log('Match', match);
      // console.log('Match request', request);

      let response = new Response(req, res, request, knex);

      return response.process();
    });



    // let {
    //   pub_action,
    // } = req.query;

    // switch(pub_action){

    //   case 'registration':

    //     var response = appRouter.doRegistration(req.query);

    //     return processResponse(req, res, response);
    //     break;

    //   case 'tasks/getdata':

    //     // return appRouter.doTaskGetdata(req.query);


    //     knex('tasks')
    //       .select()
    //       .then((a) => {
    //         console.log('task', a);

    //         success(req, res, {
    //           success: true,
    //           object: a,
    //         });
    //       });

    //     return ;
    //     break;

    //   case 'task/create':

    //     knex('tasks')
    //       .insert({
    //         title: "Новая задача",
    //         user_id: 1,
    //       })
    //       .then((a) => {
    //         console.log('task insert', a);

    //         knex('tasks')
    //         .select()
    //         .where({
    //           id: a[0]
    //         })
    //         .then((a) => {
    //           console.log('task select', a);

    //           success(req, res, {
    //             success: true,
    //             object: a && a[0] || {},
    //           });
    //         });

    //         return;
    //       });

    //     return ;
    //     break;
    // }

    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.end("Sdfsdf");

    // return failure(req, res, {
    //   success: false,
    //   message: "Неизвестное действие",
    // });
  });


  router.ws('/api/', function(ws, req) {


    debug("Server. WS Requested");

    clients.push(ws);

    ws.on('message', function incoming(message) {

      debug('Я получил от вас сообщение: ' + message);

      try{
        var response = JSON.parse(message);

        debug("Server. Received message", response);

        var result = {};


        var raw_text = php.trim(response.text) || ''
          ,text = php.strip_tags(raw_text)
          .replace(/\[/g, '&#91;')
          .replace(/\]/g, '&#93;');

        var id = response.id;
        var name = response.name;


        switch(response.type){


          case 'form':

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=' + response.pub_action;
            SendMODXRequest(ws, url, response);

            break;


          case 'chat_message':

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=chat/postmessage';
            SendMODXRequest(ws, url, response, function(message){

              if(message.success && message.object){ 
                SendMessageToAll(ws, message, response, true);
              }

              return message;
            });

            break;

          /*
          * Запрошен документ
          * */

          case 'load_document':

            var url = /^\//.test(response.url) ? response.url : '/' + response.url;
            SendMODXRequest(ws, url, response);

            

            break;


            /*
            * Поиск топиков
            * */
          case 'search':
 

            var url = '/topics/?query=' + encodeURIComponent(response.query);
            SendMODXRequest(ws, url, response);

         

            break;


            /*
            * Поиск пользователя
            * */
          case 'find_user':
 

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=users/getdata&current=true&query=' + encodeURIComponent(response.query);
            SendMODXRequest(ws, url, response);

            


            break;

            /*
            * Получаем данные своего профиля (копия предыдущей функции)
            * */
          case 'user/get_own_data':

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=users/get_own_data&current=true';

            SendMODXRequest(ws, url, response, function(message){

              if(message.success && message.object && message.object.id){

                var user;

                var object = message.object;
                var user_id = object.id;

                for(var i in users){
                  if(users[i].id == user_id){
                    user = users[i];
                    break;
                  }
                }

                if(!user){
                  user = {
                    id: object.id,
                    username: object.username,
                    fullname: object.fullname,
                    photo:    object.photo,
                  };

                  
                }

                ws.user = user;

                // SendUsersActivity();
              }

              return message;
            });

 
            break;


            /*
            * Регистрация
            * */
          case 'signup':

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=users/create&username='+ response.login + '&password=' + response.password;

            // debug("Запрос на поиск пользователя", url);

            var options = {
              host: host,
              port: raw_host_port,
              path: url,
              // 'method': 'GET',
              'headers': {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // 'Content-Length': Buffer.byteLength(postData)
              }, 
            };

            if (ws.upgradeReq.headers.cookie) {
              options.headers.Cookie = ws.upgradeReq.headers.cookie;
            }


            var callback = function(request){

              // debug("load_document loaded response");

              var client = this;

              var str = '';
              //
              // //another chunk of data has been recieved, so append it to `str`
              request.on('data', function (chunk) {
                str += chunk;
              });
              //
              // //the whole response has been recieved, so we just print it out here
              request.on('end', function () {

                // var response_headers = request.headers;
                // debug("Response from MODX", str);

                var message;

                try{
                  var result = JSON.parse(str);

                  if(result.success && result.object && result.object.id){


                  }

                  // debug("Активные пользователи", users);

                  message = result;
                }
                catch(e){
                  console.error(e.message, e.stack);
                  console.log(str);

                  message = e.message + e.stack;
                }

                debug("Результат регистрации пользователя", result, message);

                SendMessage(client, message, response);

              });
            }

            var request = httpServ.request(options, callback.bind(ws));
            // request.write(postData);
            request.end();

            break;

            /*
            * Поиск пользователя
            * */
          case 'signin':


            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=login&username=' + encodeURIComponent(response.login) + '&password=' + (response.password);

            // (ws, url, original_message, process_message_callback)
            SendMODXRequest(ws, url, response, function(message){

              if(message.success && message.object){
                SendUsersActivity();
              }

              return message;
            });




            break;


            /*
            * Выход пользователя
            * */
          case 'signout':


            // console.log(ws.user);
            // return;

            var url = '/assets/components/modxsite/connectors/connector.php?pub_action=logout';

            SendMODXRequest(ws, url, response, function(message){

              if(message.success && ws.user && ws.user.id){
                var user_id = ws.user.id;
                for(var i in clients){
                  var client = clients[i];
                  if(client.user && client.user.id == user_id){
                    // clients.slice(i,1);
                    delete client.user;
                  }
                }

                SendUsersActivity();
              }

              return message;
            });
            break;

          /*
           Пользователь представляется
           */
          // case 'introdution': 
          //   break;


          case 'message':

            var client_id = response.client_id;


            if(!client_id){
              result = {
                type: "error"
                ,text: "Не был указан ID клиента"
              };
            }
            else if(!text){
              result = {
                type: "error"
                ,text: "Текст не может быть пустым"
              };
            }


            else{
              result = {
                type: "message"
                ,sender: {
                  id: client_id
                  ,guest: ws.client_data.guest
                  ,name: ws.client_data.name
                  ,photo: ws.client_data.photo
                }
                ,text: text
              };
            }

            debug('ws.client_data');
            debug(ws.client_data);

            if(result.type == "error"){
              ws.send(JSON.stringify(result));
            }
            else{
              for(var i in clients){
                if(clients[i].readyState == WebSocket.OPEN){
                  clients[i].send(JSON.stringify(result));

 

                }
              }

              var d = new Date();
              var n = d.getTime();

              Message.query().insert({
                text: text
                ,raw_text: raw_text
                ,ts: String(n).substr(0,10) + '.' + String(n).substr(10)
                ,user_id: ws.user_id
                ,channel_id: ws.channel_id
              }).then(function (record) {
                console.log(record);
              });
            }
            break;



          case 'joined':
 

            break;

          default:
           

            SendMessage(ws, {
              type: "error"
              ,text: "Неизвестный тип сообщения"
            }, response);
        }


      }
      catch(e){
        console.error(e);
      }
 
    });
 

    ws.on('close', function(){

      debug("Соединение закрыто");

      for(var i in clients){
        if(clients[i] === ws){
          clients.splice(i, 1);
          debug("Удален клиент из общего списка");
          break;
        }
      }

      // SendUsersActivity();
    });




    SendMessage(ws, {
      type: "hello"
    }, response);

  });

  /*
   * Static
   * */
  // router.use(/^.*\.(ico|gif|jp(e)?g|ttf|map|woff\d?)$/, function (req, res, next) {

  //   try{

  //     // var filename = req.path;
  //     var filename = req.originalUrl.replace(/\?.*/, '');

  //     var file = fs.readFileSync(path.join(options.path || __dirname, filename));
  //     res.writeHead(200, {'Content-Type': mime.lookup(filename)});
  //     res.end(file, 'binary');
  //   }
  //   catch(e){
  //     console.log(e.message);
  //     console.log(e.stack);
  //     res.send(e.stack);
  //   }
  // });


  return router;
}

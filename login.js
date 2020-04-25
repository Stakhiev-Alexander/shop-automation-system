const argon2 = require('argon2');
var ipcRenderer = require('electron').ipcRenderer;
let config = require('./config.js');
const log4js = require('log4js');

log4js.configure({
  appenders: { db_access: { type: 'file', filename: 'logs/db_access.log' } },
  categories: { default: { appenders: ['db_access'], level: 'ALL' } }
});

const logger = log4js.getLogger('db_access');
// logger.warn('warn');
// logger.info('info');

document.getElementById("loginBtn").addEventListener("click", loginBtnHandler);


document.onkeyup = function(e) {
  if (e.which == 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("loginBtn").click();
  } 
};


async function loginBtnHandler() {
  var oracledb = require('oracledb');
  const uid = document.getElementById("uid")
  const password = document.getElementById("password")
  
  oracledb.getConnection ( 
    {
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    },
    function(err, connection) {
      if (err) {
        console.error(err.message);
        logger.error('Failed to connect to db:' + err.message);
        return;
      }
      connection.execute(
        'SELECT * FROM USERS WHERE LOGIN = :login',
        [uid.value],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to login (login = ' + uid.value + ') :' + err.message);
            doRelease(connection);
            return;
          }
          var hash = undefined;
          if (result.rows.length > 0) {
            hash = result.rows[0][1]
          }
          doRelease(connection); 
          try {
            const prom = argon2.verify(hash, password.value)
            prom.then((res) => {
              if (res) {
                logger.info('User logged in (login = ' + uid.value + ')');
                ipcRenderer.send('show-main')
              } else {
                handleWrongInput('The username or password you entered is incorrect!', 2500)
                logger.error('Failed to login (login = ' + uid.value + ') :' + err.message);
              }
            },
            (err) => {
              handleWrongInput('The username or password you entered is incorrect!', 2500)
              logger.error('Failed to login (login = ' + uid.value + ') :' + err.message);
            })
          } catch (err) {
            handleWrongInput('The username or password you entered is incorrect!', 2500)
            logger.error('Failed to login (login = ' + uid.value + ') :' + err.message);
          }
        }
      );
    }
  );
}

function handleWrongInput(message, duration) {
  M.toast({html: message}, duration);
}    

function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.log(err.message);
      }
    }
  );
}
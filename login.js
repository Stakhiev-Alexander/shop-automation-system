const argon2 = require('argon2');
var ipcRenderer = require('electron').ipcRenderer;
let config = require('./config.js');

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
        return;
      }
      connection.execute(
        'SELECT * FROM USERS WHERE LOGIN = :login',
        [uid.value],
        function(err, result) {
          if (err) {
            console.error(err.message);
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
                ipcRenderer.send('show-main')
              } else {
                handleWrongInput('The username or password you entered is incorrect!', 2500)
              }
            },
            (err) => {
              handleWrongInput('The username or password you entered is incorrect!', 2500)
            })
          } catch (err) {
            handleWrongInput('The username or password you entered is incorrect!', 2500)
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
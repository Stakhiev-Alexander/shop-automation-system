var el = document.querySelector('.tabs');
M.Tabs.init(el, {});

const log4js = require('log4js');

log4js.configure({
  appenders: { db_access: { type: 'file', filename: 'logs/db_access.log' } },
  categories: { default: { appenders: ['db_access'], level: 'ALL' } }
});

const logger = log4js.getLogger('db_access');

let config = require('./config.js');
var oracledb = require('oracledb');

updateChargesTable();
updateExpenseItemsTable();
updateSalesTable();
updateWarehousesTable();

function updateChargesTable() {
  clearTable('ChargesTable');

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
        'SELECT ID, AMOUNT, CHARGE_DATE, EXPENSE_ITEM_ID FROM CHARGES',
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }

          if (result.rows.length > 0) {
            for (index = 0; index < result.rows.length; index++) { 
              addRowToChargesTable(result.rows[index][0], result.rows[index][1], result.rows[index][2], result.rows[index][3]);
            } 
          }
          logger.info('Updated charges table');
          doRelease(connection); 
        }
      );
    }
  );
  displayAddButtons();
}

function updateExpenseItemsTable() {
  clearTable('ExpenseItemsTable');

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
        'SELECT * FROM EXPENSE_ITEMS',
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }

          if (result.rows.length > 0) {
            for (index = 0; index < result.rows.length; index++) { 
              addRowToExpenseItemsTable(result.rows[index][0], result.rows[index][1]);
            } 
          }
          logger.info('Updated expense items table');
          doRelease(connection); 
        }
      );
    }
  );
  displayAddButtons();
}

function updateSalesTable() {
  clearTable('SalesTable');

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
        'SELECT * FROM SALES',
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }

          if (result.rows.length > 0) {
            for (index = 0; index < result.rows.length; index++) { 
              addRowToSalesTable(result.rows[index][0], result.rows[index][1], result.rows[index][2], result.rows[index][3], result.rows[index][4]);
            } 
          }
          logger.info('Updated sales table');
          doRelease(connection); 
        }
      );
    }
  );
  displayAddButtons();
}

function updateWarehousesTable() {
  clearTable('WarehousesTable');

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
        'SELECT * FROM WAREHOUSES',
        function(err, result) {
          if (err) {
            console.error(err.message);
            doRelease(connection);
            return;
          }

          if (result.rows.length > 0) {
            for (index = 0; index < result.rows.length; index++) { 
              addRowToWarehousesTable(result.rows[index][0], result.rows[index][1], result.rows[index][2], result.rows[index][3]);
            } 
          }
          logger.info('Updated warehouses table');
          doRelease(connection); 
        }
      );
    }
  );
  displayAddButtons();
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

function addRowToChargesTable(idValue, amountValue, chargeDateValue, expenseItemValue) {                 
  var chargesTable = document.getElementById("ChargesTable").getElementsByTagName('tbody')[0]; 
  
  // insert new row at the bottom of the table 
  var NewRow = chargesTable.insertRow(-1); 
  var idCell = NewRow.insertCell(0); 
  var amountCell = NewRow.insertCell(1); 
  var chargeDateCell = NewRow.insertCell(2); 
  var expenseItemCell = NewRow.insertCell(3); 
  var deleteCell = NewRow.insertCell(4); 
  var editCell = NewRow.insertCell(5); 
  idCell.innerHTML = idValue.toString(); 
  amountCell.innerHTML = amountValue.toString(); 
  chargeDateCell.innerHTML = chargeDateValue.toDateString(); 
  expenseItemCell.innerHTML = expenseItemValue.toString(); 
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDataBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons" onclick="editMode(this)">mode_edit</i>'; 
} 

function addRowToExpenseItemsTable(idValue, nameValue) {                 
  var expenseItemsTable = document.getElementById('ExpenseItemsTable').getElementsByTagName('tbody')[0];
  
  // insert new row at the bottom of the table 
  var NewRow = expenseItemsTable.insertRow(-1); 
  var idCell = NewRow.insertCell(0); 
  var nameCell = NewRow.insertCell(1); 
  var deleteCell = NewRow.insertCell(2); 
  var editCell = NewRow.insertCell(3); 
  idCell.innerHTML = idValue.toString(); 
  nameCell.innerHTML = nameValue.toString(); 
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDataBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons" onclick="editMode(this)">mode_edit</i>'; 
}

function addRowToSalesTable(idValue, amountValue, quantityValue, saleDateValue, warehouseIdValue) {                 
  var salesTable = document.getElementById("SalesTable").getElementsByTagName('tbody')[0]; 
  
  // insert new row at the bottom of the table 
  var NewRow = salesTable.insertRow(-1); 
  var idCell = NewRow.insertCell(0); 
  var amountCell = NewRow.insertCell(1);
  var quantityCell = NewRow.insertCell(2);
  var saleDateCell = NewRow.insertCell(3);
  var warehouseIdCell = NewRow.insertCell(4);
  var deleteCell = NewRow.insertCell(5); 
  var editCell = NewRow.insertCell(6); 
  idCell.innerHTML = idValue.toString(); 
  amountCell.innerHTML = amountValue.toString(); 
  quantityCell.innerHTML = quantityValue.toString(); 
  saleDateCell.innerHTML = saleDateValue.toDateString(); 
  warehouseIdCell.innerHTML = warehouseIdValue.toString(); 
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDataBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons" onclick="editMode(this)">mode_edit</i>'; 
}

function addRowToWarehousesTable(idValue, nameValue, quantityValue, amountValue) {                 
  var warehousesTable = document.getElementById("WarehousesTable").getElementsByTagName('tbody')[0]; 
  
  // insert new row at the bottom of the table 
  var NewRow = warehousesTable.insertRow(-1); 
  var idCell = NewRow.insertCell(0); 
  var nameCell = NewRow.insertCell(1); 
  var quantityCell = NewRow.insertCell(2);
  var amountCell = NewRow.insertCell(3);
  var deleteCell = NewRow.insertCell(4); 
  var editCell = NewRow.insertCell(5); 
  idCell.innerHTML = idValue.toString(); 
  nameCell.innerHTML = nameValue.toString(); 
  quantityCell.innerHTML = quantityValue.toString(); 
  amountCell.innerHTML = amountValue.toString(); 
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDataBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons" onclick="editMode(this)">mode_edit</i>'; 
}

function displayAddButtons() {
  var charges_add_button = document.getElementById("charges_add_button");
  var expense_items_add_button = document.getElementById("expense_items_add_button"); 
  var sales_add_button = document.getElementById("sales_add_button"); 
  var warehouses_add_button = document.getElementById("warehouses_add_button"); 
  charges_add_button.style.setProperty('display', 'inline-block');
  expense_items_add_button.style.setProperty('display', 'inline-block');
  sales_add_button.style.setProperty('display', 'inline-block');
  warehouses_add_button.style.setProperty('display', 'inline-block');
}

function hideAddButtons() {
  var charges_add_button = document.getElementById("charges_add_button");
  var expense_items_add_button = document.getElementById("expense_items_add_button"); 
  var sales_add_button = document.getElementById("sales_add_button"); 
  var warehouses_add_button = document.getElementById("warehouses_add_button"); 
  charges_add_button.style.setProperty('display', 'none');
  expense_items_add_button.style.setProperty('display', 'none');
  sales_add_button.style.setProperty('display', 'none');
  warehouses_add_button.style.setProperty('display', 'none');
}

function deleteFromDataBase(r) {
  const tableId = r.parentNode.parentNode.parentNode.parentNode.id;
  const row = r.parentNode.parentNode.cells
  const id = parseInt(row[0].innerText)

  switch(tableId) {
    case 'ChargesTable':
      removeFromCharges(id)
      setTimeout(() => { updateChargesTable(); }, 300); 
      break
    case 'ExpenseItemsTable':
      removeFromExpenseItems(id)
      setTimeout(() => { updateExpenseItemsTable(); }, 300);
      break
    case 'SalesTable': 
      removeFromSales(id)
      setTimeout(() => { updateSalesTable(); }, 300); 
      break
    case 'WarehousesTable':
      removeFromWarehouses(id)  
      setTimeout(() => { updateWarehousesTable(); }, 300);
      break
    default:
      break;   
  }
}

function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById(r.parentNode.parentNode.parentNode.parentNode.id).deleteRow(i);

  displayAddButtons();
}

function loadSelect() {
  // $("select").material_select();
  var sel = document.querySelector("select"); 
  var ins = M.FormSelect.init(sel, {});
}

function doneEditMode(r) {
  var tableId = r.parentNode.parentNode.parentNode.parentNode.id;

  switch(tableId) {
    case 'ChargesTable': 
      const idCT = parseInt(document.getElementById("idCell").innerHTML);
      const amountCT = document.getElementById("amountCell").value;
      if (amountCT < 1) {
        updateExpenseItemsTable();
        return;
      }
      const chargeDateCT = document.getElementById("chargeDateCell").value;
      const expenseItemCT = document.getElementById("expenseItemCell").value;
      updateValuesInCharges(idCT, amountCT, chargeDateCT, expenseItemCT);
      setTimeout(() => { updateChargesTable(); }, 300);
      break;
    case 'ExpenseItemsTable':
      const idEIT = parseInt(document.getElementById("idCell").innerHTML);
      console.log(idEIT)
      const nameEIT = document.getElementById("nameCell").value;
      updateValuesInExpenseItems(idEIT, nameEIT);
      setTimeout(() => { updateExpenseItemsTable(); }, 300);
      break;
    case 'SalesTable':  
      const idST = parseInt(document.getElementById("idCell").innerHTML);
      const amountST = document.getElementById("amountCell").value;
      const quantityST = document.getElementById("quantityCell").value;
      if (amountCT < 1 || quantityST < 1) {
        updateSalesTable();
        return;
      }
      const saleDateST = document.getElementById("saleDateCell").value;
      const warehouseIdST = document.getElementById("warehouseIdCell").value;
      updateValuesInSales(idST, amountST, quantityST, saleDateST, warehouseIdST);
      setTimeout(() => { updateSalesTable(); }, 300);
      break;
    case 'WarehousesTable':  
      const idWT = parseInt(document.getElementById("idCell").innerHTML);
      const nameWT = document.getElementById("nameCell").value;
      const quantityWT = document.getElementById("quantityCell").value;
      const amountWT = document.getElementById("amountCell").value;
      if (quantityWT < 1 || amountWT < 1) {
        updateSalesTable();
        return;
      }
      updateValuesInWarehouses(idWT, nameWT, quantityWT, amountWT);
      setTimeout(() => { updateWarehousesTable(); }, 300);
      break;
    default:
      break;
  }
}

function cancelEditMode(r) {
  var tableId = r.parentNode.parentNode.parentNode.parentNode.id;
  deleteRow(r);
  switch(tableId) {
    case 'ChargesTable': 
      updateChargesTable();
      break;
    case 'ExpenseItemsTable': 
      updateExpenseItemsTable();
      break;
    case 'SalesTable': 
      updateSalesTable();
      break;
    case 'WarehousesTable': 
      updateWarehousesTable();
      break;
    default:
      updateChargesTable();
      updateExpenseItemsTable();
      updateSalesTable();
      updateWarehousesTable();
      break;
  }
}

function editMode(r) {
  var tableId = r.parentNode.parentNode.parentNode.parentNode.id;
  var changedTable = document.getElementById(tableId); 
  var editedDBId = parseInt(r.parentNode.parentNode.getElementsByTagName("td")[0].innerHTML);
  console.log(editedDBId);
  var rowIndex = r.parentNode.parentNode.rowIndex;
  deleteRow(r);

  hideAddButtons();
  var sizeOfRow = 0;
  var NewRow = changedTable.insertRow(rowIndex);

  switch(tableId) {
    case 'ChargesTable': 
      var idCell = NewRow.insertCell(0); 
      var amountCell = NewRow.insertCell(1);
      var chargeDateCell = NewRow.insertCell(2);
      var expenseItemCell = NewRow.insertCell(3);
      idCell.innerHTML = '<div id="idCell">' + editedDBId + '</div>'; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      amountCell.focus();
      chargeDateCell.innerHTML = '<input id="chargeDateCell" type="date">'; 
      expenseItemCell.innerHTML = '<select id="expenseItemCell"> </select> ';     
                                    
      expenseItemSelect = document.getElementById("expenseItemCell");
      var ids = [];
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
            'SELECT ID FROM EXPENSE_ITEMS',
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              result.rows.forEach(element => {
                ids.push(element[0])
              });

              ids.forEach(element => {
                console.log(element)
                var option = document.createElement('option');
                option.value = option.text = element;
                expenseItemSelect.appendChild(option);
              });

              console.log(ids);
              
              doRelease(connection); 
            }
          );
        }
      );
        
      setTimeout(() => { eval("loadSelect()");  }, 300);                                                     
      sizeOfRow = 4;
      break
    case 'ExpenseItemsTable':  
      var idCell = NewRow.insertCell(0); 
      var nameCell = NewRow.insertCell(1);
      idCell.innerHTML = '<div id="idCell">' + editedDBId + '</div>'; 
      nameCell.innerHTML = '<input id="nameCell" type="text">'; 
      nameCell.focus();
      sizeOfRow = 2;
      break
    case 'SalesTable':  
      var idCell = NewRow.insertCell(0); 
      var amountCell = NewRow.insertCell(1);
      var quantityCell = NewRow.insertCell(2);
      var saleDateCell = NewRow.insertCell(3);
      var warehouseIdCell = NewRow.insertCell(4);
      idCell.innerHTML = '<div id="idCell">' + editedDBId + '</div>'; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      amountCell.focus();
      quantityCell.innerHTML = '<input id="quantityCell" type="number" min="0">'; 
      saleDateCell.innerHTML = '<input id="saleDateCell" type="date">'; 
      warehouseIdCell.innerHTML = '<select id="warehouseIdCell"> </select> '; 
      warehouseIdSelect = document.getElementById("warehouseIdCell");
      var ids = [];
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
            'SELECT ID FROM WAREHOUSES',
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              result.rows.forEach(element => {
                ids.push(element[0])
              });

              ids.forEach(element => {
                console.log(element)
                var option = document.createElement('option');
                option.value = option.text = element;
                warehouseIdSelect.appendChild(option);
              });

              console.log(ids);
              
              doRelease(connection); 
            }
          );
        }
      );
        
      setTimeout(() => { eval("loadSelect()");  }, 300);  
      sizeOfRow = 5;
      break
    case 'WarehousesTable':  
      var idCell = NewRow.insertCell(0); 
      var nameCell = NewRow.insertCell(1);
      var quantityCell = NewRow.insertCell(2);
      var amountCell = NewRow.insertCell(3);
      idCell.innerHTML = '<div id="idCell">' + editedDBId + '</div>'; 
      nameCell.innerHTML = '<input id="nameCell" type="text">'; 
      nameCell.focus();
      quantityCell.innerHTML = '<input id="quantityCell" type="number" min="0">'; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      sizeOfRow = 4;
      break
    default:
      break;
  }
  
  // insert buttons at the end of the row  
  var doneCell = NewRow.insertCell(sizeOfRow); 
  var cancelCell = NewRow.insertCell(sizeOfRow+1); 
  
  doneCell.innerHTML = '<i class="material-icons" onclick="doneEditMode(this)">done</i>'; 
  cancelCell.innerHTML = '<i class="material-icons" onclick="cancelEditMode(this)">close</i>'; 
}

function addRowMode(r) {
  var tableId = r.parentNode.parentNode.parentNode.parentNode.id;
  var changedTable = document.getElementById(tableId); 

  hideAddButtons();

  var sizeOfRow = 0;
  // insert new row at the bottom of the table  
  var NewRow = changedTable.insertRow(-1);

  switch(tableId) {
    case 'ChargesTable': 
      var idCell = NewRow.insertCell(0); 
      var amountCell = NewRow.insertCell(1);
      var chargeDateCell = NewRow.insertCell(2);
      var expenseItemCell = NewRow.insertCell(3);
      idCell.innerHTML = ''; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      amountCell.focus();
      chargeDateCell.innerHTML = '<input id="chargeDateCell" type="date">'; 
      expenseItemCell.innerHTML = '<select id="expenseItemCell"> </select> ';     
                                    
      expenseItemSelect = document.getElementById("expenseItemCell");
      var ids = [];
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
            'SELECT ID FROM EXPENSE_ITEMS',
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              result.rows.forEach(element => {
                ids.push(element[0])
              });

              ids.forEach(element => {
                console.log(element)
                var option = document.createElement('option');
                option.value = option.text = element;
                expenseItemSelect.appendChild(option);
              });

              console.log(ids);
              
              doRelease(connection); 
            }
          );
        }
      );
        
      setTimeout(() => { eval("loadSelect()");  }, 300);                                                     
      sizeOfRow = 4;
      break
    case 'ExpenseItemsTable':  
      var idCell = NewRow.insertCell(0); 
      var nameCell = NewRow.insertCell(1);
      idCell.innerHTML = ''; 
      nameCell.innerHTML = '<input id="nameCell" type="text">'; 
      nameCell.focus();
      sizeOfRow = 2;
      break
    case 'SalesTable':  
      var idCell = NewRow.insertCell(0); 
      var amountCell = NewRow.insertCell(1);
      var quantityCell = NewRow.insertCell(2);
      var saleDateCell = NewRow.insertCell(3);
      var warehouseIdCell = NewRow.insertCell(4);
      idCell.innerHTML = ''; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      amountCell.focus();
      quantityCell.innerHTML = '<input id="quantityCell" type="number" min="0">'; 
      saleDateCell.innerHTML = '<input id="saleDateCell" type="date">'; 
      warehouseIdCell.innerHTML = '<select id="warehouseIdCell"> </select> '; 
      warehouseIdSelect = document.getElementById("warehouseIdCell");
      var ids = [];
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
            'SELECT ID FROM WAREHOUSES',
            function(err, result) {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
              result.rows.forEach(element => {
                ids.push(element[0])
              });

              ids.forEach(element => {
                console.log(element)
                var option = document.createElement('option');
                option.value = option.text = element;
                warehouseIdSelect.appendChild(option);
              });

              console.log(ids);
              
              doRelease(connection); 
            }
          );
        }
      );
        
      setTimeout(() => { eval("loadSelect()");  }, 300);  
      sizeOfRow = 5;
      break
    case 'WarehousesTable':  
      var idCell = NewRow.insertCell(0); 
      var nameCell = NewRow.insertCell(1);
      var quantityCell = NewRow.insertCell(2);
      var amountCell = NewRow.insertCell(3);
      idCell.innerHTML = ''; 
      nameCell.innerHTML = '<input id="nameCell" type="text">'; 
      nameCell.focus();
      quantityCell.innerHTML = '<input id="quantityCell" type="number" min="0">'; 
      amountCell.innerHTML = '<input id="amountCell" type="number" min="0">'; 
      sizeOfRow = 4;
      break
    default:
      break;
  }

  // insert buttons at the end of the row  
  var doneCell = NewRow.insertCell(sizeOfRow); 
  var cancelCell = NewRow.insertCell(sizeOfRow+1); 
  
  doneCell.innerHTML = '<i class="material-icons" onclick="doneAddingRowMode(this)">done</i>'; 
  cancelCell.innerHTML = '<i class="material-icons" onclick="deleteRow(this)">close</i>'; 
}

function doneAddingRowMode(r) {
  var tableId = r.parentNode.parentNode.parentNode.parentNode.id;
  
  switch(tableId) {
    case 'ChargesTable': 
      const amountCT = document.getElementById("amountCell").value;
      if (amountCT < 1) {
        updateExpenseItemsTable();
        return;
      }
      const chargeDateCT = document.getElementById("chargeDateCell").value;
      const expenseItemCT = document.getElementById("expenseItemCell").value;
      insertIntoCharges(amountCT, chargeDateCT, expenseItemCT);
      setTimeout(() => { updateChargesTable(); }, 300);
      break;
    case 'ExpenseItemsTable':
      const nameEIT = document.getElementById("nameCell").value;
      insertIntoExpenseItems(nameEIT);
      setTimeout(() => { updateExpenseItemsTable(); }, 300);
      break;
    case 'SalesTable':  
      const amountST = document.getElementById("amountCell").value;
      const quantityST = document.getElementById("quantityCell").value;
      if (amountCT < 1 || quantityST < 1) {
        updateSalesTable();
        return;
      }
      const saleDateST = document.getElementById("saleDateCell").value;
      const warehouseIdST = document.getElementById("warehouseIdCell").value;
      insertIntoSales(amountST, quantityST, saleDateST, warehouseIdST);
      setTimeout(() => { updateSalesTable(); }, 300);
      break;
    case 'WarehousesTable':  
      const nameWT = document.getElementById("nameCell").value;
      const quantityWT = document.getElementById("quantityCell").value;
      const amountWT = document.getElementById("amountCell").value;
      if (quantityWT < 1 || amountWT < 1) {
        updateSalesTable();
        return;
      }
      insertIntoWarehouses(nameWT, quantityWT, amountWT);
      setTimeout(() => { updateWarehousesTable(); }, 300);
      break;
    default:
      break;
  }
}

function insertIntoCharges(amount, chargeDate, expenseItem) {
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
        'BEGIN insertCHARGES(:camount, :cchargeDate, :cexpenseItem); END;',
        [parseInt(amount), new Date(chargeDate), parseInt(expenseItem)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to insert into table (CHARGES) ;\n values:' + parseInt(amount) + ', ' + new Date(chargeDate) + ', ' + parseInt(expenseItem) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Insert into table (CHARGES);\n values:' + parseInt(amount) + ', ' + new Date(chargeDate) + ', ' + parseInt(expenseItem));
          doRelease(connection); 
        }
      );
    }
  );
}

function insertIntoExpenseItems(name) {
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
        'BEGIN insertEXPENSE_ITEMS(:einame); END;',
        [name.toString()],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to insert into table (EXPENSE_ITEMS) ;\n values:' + name.toString() + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Insert into table (EXPENSE_ITEMS);\n values:' + name.toString());
          doRelease(connection); 
        }
      );
    }
  );
}

function insertIntoSales(amount, quantity, saleDate, warehouseId) {
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
        'BEGIN insertSALES(:samount, :squantity, :ssaleDate, :swarehouseId); END;',
        [parseInt(amount), parseInt(quantity), new Date(saleDate), parseInt(warehouseId)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to insert into table (SALES) ;\n values:' + parseInt(amount) + parseInt(quantity) + new Date(saleDate) + parseInt(warehouseId) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Insert into table (SALES);\n values:' + parseInt(amount) + parseInt(quantity) + new Date(saleDate) + parseInt(warehouseId));
          doRelease(connection); 
        }
      );
    }
  );
}

function insertIntoWarehouses(name, quantity, amount) {
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
        'BEGIN insertWAREHOUSES(:wname, :wquantity, :wamount); END;',
        [name.toString(), parseInt(quantity), parseInt(amount)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to insert into table (WAREHOUSES) ;\n values:' + name.toString() + parseInt(quantity) + parseInt(amount) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Insert into table (WAREHOUSES);\n values:' + name.toString() + parseInt(quantity) + parseInt(amount));
          doRelease(connection); 
        }
      );
    }
  );
}

function updateValuesInCharges(id, amount, chargeDate, expenseItem) {
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
        'BEGIN updateCHARGES(:cid, :camount, :cchargeDate, :cexpenseItem); END;',
        [parseInt(id), parseInt(amount), new Date(chargeDate), parseInt(expenseItem)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to update table (CHARGES) ;\n values:' + parseInt(id) + parseInt(amount) + ', ' + new Date(chargeDate) + ', ' + parseInt(expenseItem) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Update table (CHARGES);\n values:' + parseInt(id) + parseInt(amount) + ', ' + new Date(chargeDate) + ', ' + parseInt(expenseItem));
          doRelease(connection); 
        }
      );
    }
  );
}

function updateValuesInExpenseItems(id, name) {
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
        'BEGIN updateEXPENSE_ITEMS(:eid, :einame); END;',
        [parseInt(id), name.toString()],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to update table (EXPENSE_ITEMS) ;\n values:' + parseInt(id) + name.toString() + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Update table (EXPENSE_ITEMS);\n values:' + parseInt(id) + name.toString());
          doRelease(connection); 
        }
      );
    }
  );
}

function updateValuesInSales(id, amount, quantity, saleDate, warehouseId) {
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
        'BEGIN updateSALES(:sid, :samount, :squantity, :ssaleDate, :swarehouseId); END;',
        [parseInt(id), parseInt(amount), parseInt(quantity), new Date(saleDate), parseInt(warehouseId)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to update table (SALES) ;\n values:' + parseInt(id) + parseInt(amount) + parseInt(quantity) + new Date(saleDate) + parseInt(warehouseId) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Update table (SALES);\n values:' + parseInt(id) + parseInt(amount) + parseInt(quantity) + new Date(saleDate) + parseInt(warehouseId));
          doRelease(connection); 
        }
      );
    }
  );
}

function updateValuesInWarehouses(id, name, quantity, amount) {
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
        'BEGIN updateWAREHOUSES(:wid, :wname, :wquantity, :wamount); END;',
        [parseInt(id), name.toString(), parseInt(quantity), parseInt(amount)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to update table (WAREHOUSES) ;\n values:' + parseInt(id) + name.toString() + parseInt(quantity) + parseInt(amount) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Update table (WAREHOUSES);\n values:' + parseInt(id) + name.toString() + parseInt(quantity) + parseInt(amount));
          doRelease(connection); 
        }
      );
    }
  );
}

function removeFromCharges(id) {
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
        'BEGIN removeCHARGES(:cid); END;',
        [parseInt(id)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to remove from table (CHARGES) ;\n values:' + parseInt(id) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Remove from table (CHARGES);\n values:' + parseInt(id));
          doRelease(connection); 
        }
      );
    }
  );
}

function removeFromExpenseItems(id) {
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
        'BEGIN removeEXPENSE_ITEMS(:eiid); END;',
        [parseInt(id)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to remove from table (EXPENSE_ITEMS) ;\n values:' + parseInt(id) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Remove from table (EXPENSE_ITEMS);\n values:' + parseInt(id));
          doRelease(connection); 
        }
      );
    }
  );
}

function removeFromSales(id) {
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
        'BEGIN removeSALES(:sid); END;',
        [parseInt(id)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to remove from table (SALES) ;\n values:' + parseInt(id) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Remove from table (SALES);\n values:' + parseInt(id));
          doRelease(connection); 
        }
      );
    }
  );
}

function removeFromWarehouses(id) {
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
        'BEGIN removeWAREHOUSES(:wid); END;',
        [parseInt(id)],
        function(err, result) {
          if (err) {
            console.error(err.message);
            logger.error('Failed to remove from table (WAREHOUSES) ;\n values:' + parseInt(id) + '\nerr_message:' + err.message);
            doRelease(connection);
            return;
          }
          logger.info('Remove from table (WAREHOUSES);\n values:' + parseInt(id));
          doRelease(connection); 
        }
      );
    }
  );
}

function clearTable(tableID) {
  var bodyRef = document.getElementById(tableID).getElementsByTagName('tbody')[0]; 
  bodyRef.innerHTML = '';
}

var el = document.querySelector('.tabs');
var instance = M.Tabs.init(el, {});
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
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDateBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
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
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDateBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
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
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDateBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
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
  deleteCell.innerHTML = '<i class="material-icons" onclick="deleteFromDateBase(this)">delete</i>'; 
  editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
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

function deleteFromDateBase(r) {
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
      amountCell.innerHTML = '<input id="amountCell" type="text">'; 
      amountCell.focus();
      chargeDateCell.innerHTML = '<input id="chargeDateCell" type="date">'; 
      expenseItemCell.innerHTML = '<input id="expenseItemCell" type="text">'; 
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
      amountCell.innerHTML = '<input id="amountCell" type="text">'; 
      amountCell.focus();
      quantityCell.innerHTML = '<input id="quantityCell" type="text">'; 
      saleDateCell.innerHTML = '<input id="saleDateCell" type="date">'; 
      warehouseIdCell.innerHTML = '<input id="warehouseIdCell" type="text">'; 
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
      quantityCell.innerHTML = '<input id="quantityCell" type="text">'; 
      amountCell.innerHTML = '<input id="amountCell" type="text">'; 
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
      const saleDateST = document.getElementById("saleDateCell").value;
      const warehouseIdST = document.getElementById("warehouseIdCell").value;
      insertIntoSales(amountST, quantityST, saleDateST, warehouseIdST);
      setTimeout(() => { updateSalesTable(); }, 300);
      break;
    case 'WarehousesTable':  
      const nameWT = document.getElementById("nameCell").value;
      const quantityWT = document.getElementById("quantityCell").value;
      const amountWT = document.getElementById("amountCell").value;
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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
            doRelease(connection);
            return;
          }
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

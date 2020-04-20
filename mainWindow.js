var el = document.querySelector('.tabs');
var instance = M.Tabs.init(el, {});

updateChargesTable();
updateExpenseItemsTable();
updateSalesTable();
updateWarehousesTable();


function updateChargesTable() {
    clearTable('ChargesTable');
    var oracledb = require('oracledb');

    oracledb.getConnection ( 
        {
            user: "c##alex",
            password: "1917",
            connectionString: "localhost:1521/xe"
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
}

function updateExpenseItemsTable() {
    clearTable('ExpenseItemsTable');
    var oracledb = require('oracledb');

    oracledb.getConnection ( 
        {
            user: "c##alex",
            password: "1917",
            connectionString: "localhost:1521/xe"
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
}

function updateSalesTable() {
    clearTable('SalesTable');
    var oracledb = require('oracledb');

    oracledb.getConnection ( 
        {
            user: "c##alex",
            password: "1917",
            connectionString: "localhost:1521/xe"
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
}

function updateWarehousesTable() {
    clearTable('WarehousesTable');
    var oracledb = require('oracledb');

    oracledb.getConnection ( 
        {
            user: "c##alex",
            password: "1917",
            connectionString: "localhost:1521/xe"
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
    var chargesTable = document.getElementById("ChargesTable"); 
    
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
    deleteCell.innerHTML = '<i class="material-icons" onclick="deleteRow(this)">delete</i>'; 
    editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
} 

function addRowToExpenseItemsTable(idValue, nameValue) {                 
    var expenseItemsTable = document.getElementById("ExpenseItemsTable"); 
    
    // insert new row at the bottom of the table 
    var NewRow = expenseItemsTable.insertRow(-1); 
    var idCell = NewRow.insertCell(0); 
    var nameCell = NewRow.insertCell(1); 
    var deleteCell = NewRow.insertCell(2); 
    var editCell = NewRow.insertCell(3); 
    idCell.innerHTML = idValue.toString(); 
    nameCell.innerHTML = nameValue.toString(); 
    deleteCell.innerHTML = '<i class="material-icons" onclick="deleteRow(this)">delete</i>'; 
    editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
}

function addRowToSalesTable(idValue, amountValue, quantityValue, saleDateValue, warehouseIdValue) {                 
    var salesTable = document.getElementById("SalesTable"); 
    
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
    deleteCell.innerHTML = '<i class="material-icons" onclick="deleteRow(this)">delete</i>'; 
    editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
}

function addRowToWarehousesTable(idValue, nameValue, quantityValue, amountValue) {                 
    var warehousesTable = document.getElementById("WarehousesTable"); 
    
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
    deleteCell.innerHTML = '<i class="material-icons" onclick="deleteRow(this)">delete</i>'; 
    editCell.innerHTML = '<i class="material-icons">mode_edit</i>'; 
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById(r.parentNode.parentNode.parentNode.parentNode.id).deleteRow(i);

    var charges_add_button = document.getElementById("charges_add_button");
    var expense_items_add_button = document.getElementById("expense_items_add_button"); 
    var sales_add_button = document.getElementById("sales_add_button"); 
    var warehouses_add_button = document.getElementById("warehouses_add_button"); 
    charges_add_button.style.setProperty('display', 'inline-block');
    expense_items_add_button.style.setProperty('display', 'inline-block');
    sales_add_button.style.setProperty('display', 'inline-block');
    warehouses_add_button.style.setProperty('display', 'inline-block');
}

function addRowMode(r) {
    var tableId = r.parentNode.parentNode.parentNode.parentNode.id;
    var changedTable = document.getElementById(tableId); 

    var charges_add_button = document.getElementById("charges_add_button");
    var expense_items_add_button = document.getElementById("expense_items_add_button"); 
    var sales_add_button = document.getElementById("sales_add_button"); 
    var warehouses_add_button = document.getElementById("warehouses_add_button"); 
    charges_add_button.style.setProperty('display', 'none');
    expense_items_add_button.style.setProperty('display', 'none');
    sales_add_button.style.setProperty('display', 'none');
    warehouses_add_button.style.setProperty('display', 'none');

    var sizeOfRow = 0;
    // insert new row at the bottom of the table  
    var NewRow = changedTable.insertRow(-1);

    switch(tableId) {
      case 'ChargesTable': 
        var idCell = NewRow.insertCell(0); 
        var amountCell = NewRow.insertCell(1);
        var chargeDateCell = NewRow.insertCell(2);
        var expenseItemCell = NewRow.insertCell(3);
        idCell.innerHTML = '<input id="idCell" type="text">'; 
        idCell.focus();
        amountCell.innerHTML = '<input id="amountCell" type="text">'; 
        chargeDateCell.innerHTML = '<input id="chargeDateCell" type="text">'; 
        expenseItemCell.innerHTML = '<input id="expenseItemCell" type="text">'; 
        sizeOfRow = 4;
        break
      case 'ExpenseItemsTable':  
        var idCell = NewRow.insertCell(0); 
        var nameCell = NewRow.insertCell(1);
        idCell.innerHTML = '<input id="idCell" type="text">'; 
        idCell.focus();
        nameCell.innerHTML = '<input id="nameCell" type="text">'; 
        sizeOfRow = 2;
        break
      case 'SalesTable':  
        var idCell = NewRow.insertCell(0); 
        var amountCell = NewRow.insertCell(1);
        var quantityCell = NewRow.insertCell(2);
        var saleDateCell = NewRow.insertCell(3);
        var warehouseIdCell = NewRow.insertCell(4);
        idCell.innerHTML = '<input id="idCell" type="text">'; 
        idCell.focus();
        amountCell.innerHTML = '<input id="amountCell" type="text">'; 
        quantityCell.innerHTML = '<input id="quantityCell" type="text">'; 
        saleDateCell.innerHTML = '<input id="saleDateCell" type="text">'; 
        warehouseIdCell.innerHTML = '<input id="warehouseIdCell" type="text">'; 
        sizeOfRow = 5;
        break
      case 'WarehousesTable':  
        var idCell = NewRow.insertCell(0); 
        var nameCell = NewRow.insertCell(1);
        var quantityCell = NewRow.insertCell(2);
        var amountCell = NewRow.insertCell(3);
        idCell.innerHTML = '<input id="idCell" type="text">'; 
        idCell.focus();
        nameCell.innerHTML = '<input id="nameCell" type="text">'; 
        quantityCell.innerHTML = '<input id="quantityCell" type="text">'; 
        amountCell.innerHTML = '<input id="amountCell" type="text">'; 
        sizeOfRow = 4;
        break
      default:
        
        break
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
        const idCT = document.getElementById("idCell").value;
        const amountCT = document.getElementById("amountCell").value;
        const chargeDateCT = document.getElementById("chargeDateCell").value;
        const expenseItemCT = document.getElementById("expenseItemCell").value;
        insertIntoCharges(idCT, amountCT, chargeDateCT, expenseItemCT);
        break;
      case 'ExpenseItemsTable':  
        const idEIT = document.getElementById("idCell").value;
        const nameEIT = document.getElementById("nameCell").value;
        insertIntoExpenseItems(idEIT, nameEIT);
        break;
      case 'SalesTable':  
        const idST = document.getElementById("idCell").value;
        const amountST = document.getElementById("amountCell").value;
        const quantityST = document.getElementById("quantityCell").value;
        const saleDateST = document.getElementById("saleDateCell").value;
        const warehouseIdST = document.getElementById("warehouseIdCell").value;
        insertIntoSales(idST, amountST, quantityST, saleDateST, warehouseIdST);
        break;
      case 'WarehousesTable':  
        const idWT = document.getElementById("idCell").value;
        const nameWT = document.getElementById("nameCell").value;
        const quantityWT = document.getElementById("quantityCell").value;
        const amountWT = document.getElementById("amountCell").value;
        insertIntoWarehouses(idWT, nameWT, quantityWT, amountWT);
        break;
      default:
        
        break
    }

    deleteRow(r);

}

function insertIntoCharges(id, amount, chargeDate, expenseItem) {
  console.log(id);
  console.log(amount);
  console.log(chargeDate);
  console.log(expenseItem);
}

function insertIntoExpenseItems(id, name) {
  console.log(id);
  console.log(name);
}

function insertIntoSales(id, amount, quantity, saleDate, warehouseId) {
  console.log(id);
  console.log(amount);
  console.log(quantity);
  console.log(saleDate);
  console.log(warehouseId);
}

function insertIntoWarehouses(id, name, quantity, amount) {
  console.log(id);
  console.log(name);
  console.log(quantity);
  console.log(amount);
}

function clearTable(tableID) {
    var bodyRef = document.getElementById(tableID).getElementsByTagName('tbody')[0]; 
    bodyRef.innerHTML = '';
}
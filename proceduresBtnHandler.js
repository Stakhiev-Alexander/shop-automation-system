const fs = require('fs');

document.getElementById("avgPricesBtn").addEventListener("click", avgPricesBtnHandler);
document.getElementById("intersectSalesDatesBtn").addEventListener("click", intersectSalesDatesBtnHandler);
document.getElementById("getIncomeExpenseBtn").addEventListener("click", getIncomeExpenseBtnHandler);
document.getElementById("countIncomeBtn").addEventListener("click", countIncomeBtnHandler);

function clearInputLayer() {
  var inputLayer = document.getElementById('inputLayer');
  inputLayer.innerHTML = '';
}

function avgPricesBtnHandler() {
  clearInputLayer()
  printAvgPrices()
}

async function fillSelects(result) {
  goodId1Select = document.getElementById("goodId1");
  goodId2Select = document.getElementById("goodId2");

  result.rows.forEach(element => {
    var option1 = document.createElement('option');
    var option2 = document.createElement('option');
    option1.value = option1.text = element;
    option2.value = option2.text = element;
    goodId1Select.appendChild(option1);
    goodId2Select.appendChild(option2);
  });
}

async function intersectSalesDatesBtnHandler() {
  var inputLayer = document.getElementById('inputLayer');
  inputLayer.innerHTML = `<div class="card-content">
                            <div class="input-field">
                              <i class="material-icons prefix">local_grocery_store</i>
                              <select id="goodId1"> </select>
                              <label for="goodId1">Product id 1</label>
                            </div>
                            <div class="input-field">
                              <i class="material-icons prefix">local_grocery_store</i>
                              <select id="goodId2"> </select>
                              <label for="goodId2">Product id 2</label>
                            </div>
                            <div>
                              <label>
                                &nbsp;<button onclick="submitIntersectSalesDatesBtnHandler()" class="btn deep-orange accent-4 waves-effect waves-light black-text" style="width: 100%;">Submit</button>
                              </label>
                            </div>
                          </div>`
                          

  let connection;
  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    });

    const result = await connection.execute('SELECT ID FROM WAREHOUSES');
    await fillSelects(result)
    M.FormSelect.init(document.getElementById('goodId1'), {});
    M.FormSelect.init(document.getElementById('goodId2'), {});

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }            
}

function submitIntersectSalesDatesBtnHandler() {
  printIntersectSalesDates(document.getElementById('goodId1').value, document.getElementById('goodId2').value)
  clearInputLayer()
}

function getIncomeExpenseBtnHandler() {
  var inputLayer = document.getElementById('inputLayer');
  inputLayer.innerHTML = `<div class="card-content">
                            <div class="input-field">
                              <i class="material-icons prefix">date_range</i>
                              <input id="date1" type="date">
                              <label for="date1">Date 1</label>
                            </div>
                            <div class="input-field">
                              <i class="material-icons prefix">date_range</i>
                              <input id="date2" type="date">
                              <label for="date2">Date 2</label>
                            </div>
                          </div>
                          <div>
                            <label>
                              &nbsp;<button onclick="submitGetIncomeExpenseBtnHandler()" class="btn deep-orange accent-4 waves-effect waves-light black-text" style="width: 100%;">Submit</button>
                            </label>
                          </div>`
}

function submitGetIncomeExpenseBtnHandler() {
  printIncomeExpense(document.getElementById('date1').value, document.getElementById('date2').value)
  clearInputLayer()
}

function countIncomeBtnHandler() {
  clearInputLayer()
  printCountedIncome()
}

async function printAvgPrices() {
  
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    });

    const stmts = [
      'CREATE OR REPLACE TYPE no_dorow AS TABLE OF VARCHAR2(32767)',

      'CREATE OR REPLACE FUNCTION no_dofetch RETURN no_dorow PIPELINED IS\
      line VARCHAR2(32767);\
      status INTEGER;\
      BEGIN LOOP\
        DBMS_OUTPUT.GET_LINE(line, status);\
        EXIT WHEN status = 1;\
        PIPE ROW (line);\
      END LOOP;\
      END;'
    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch(e) {
        if (e.errorNum != 942)
          console.error(e);
      }
    }

    await connection.execute('BEGIN DBMS_OUTPUT.ENABLE(NULL); END;');

    await connection.execute(
      'BEGIN GOODS_AVG_PRICES(); END;');

    const result = await connection.execute('SELECT * FROM TABLE(no_dofetch())');
    console.log(result.rows);
    
    let writeStream = fs.createWriteStream("./procedures_output/avg_prices.txt");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    writeStream.write(dateTime + ':\n')
    result.rows.forEach(line => {
      console.log(line[0])
      writeStream.write('\t' + line[0]+'\n');
    });
    
    writeStream.end();
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function printIntersectSalesDates(goodId1, goodId2) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    });

    const stmts = [
      'CREATE OR REPLACE TYPE no_dorow AS TABLE OF VARCHAR2(32767)',

      'CREATE OR REPLACE FUNCTION no_dofetch RETURN no_dorow PIPELINED IS\
      line VARCHAR2(32767);\
      status INTEGER;\
      BEGIN LOOP\
        DBMS_OUTPUT.GET_LINE(line, status);\
        EXIT WHEN status = 1;\
        PIPE ROW (line);\
      END LOOP;\
      END;'
    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch(e) {
        if (e.errorNum != 942)
          console.error(e);
      }
    }

    await connection.execute('BEGIN DBMS_OUTPUT.ENABLE(NULL); END;');

    await connection.execute(
      'BEGIN INTERSECT_GOODS_DATES(:GOOD_ID_1, :GOOD_ID_2); END;',
      [parseInt(goodId1), parseInt(goodId2)]);

    const result = await connection.execute('SELECT * FROM TABLE(no_dofetch())');
    console.log(result.rows);

    let writeStream = fs.createWriteStream("./procedures_output/intersect_dates.txt");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    writeStream.write(dateTime + ':\n')
    writeStream.write('\tGood1 id = ' + goodId1 + '; Good2 id = ' + goodId2 + '\n\tDates:\n')

    result.rows.forEach(line => {
      console.log(line[0])
      writeStream.write('\t\t' + line[0]+'\n');
    });
    
    writeStream.end();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function printIncomeExpense(date1, date2) {
  console.log(date1)
  console.log(date2)
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    });

    const results = await connection.execute(
      'BEGIN SALES_CHARGES_IN_INTERVAL(:DATE_1, :DATE_2, :SALES_SUM, :CHARGES_SUM); END;',
      {
        DATE_1: new Date(date1),
        DATE_2: new Date(date2),
        SALES_SUM:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        CHARGES_SUM:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      });

    let writeStream = fs.createWriteStream("./procedures_output/sales_charges_in_interval.txt");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    writeStream.write(dateTime + ':\n')

    writeStream.write('\tDate1 = ' + date1 + '; Date2 = ' + date2 + '\n')
    writeStream.write('\tSALES_SUM = ' + results.outBinds.SALES_SUM + '; CHARGES_SUM = ' + results.outBinds.CHARGES_SUM + '\n');
    
    writeStream.end();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function printCountedIncome() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectionString: config.connectionString
    });

    const results = await connection.execute(
      'BEGIN COUNT_INCOME(:RESULT_INCOME); END;',
      {
        RESULT_INCOME:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      });

    let writeStream = fs.createWriteStream("./procedures_output/counted_income.txt");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    writeStream.write(dateTime + ':\n')

    writeStream.write('\tRESULT_INCOME = ' + results.outBinds.RESULT_INCOME);
 
    
    writeStream.end();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

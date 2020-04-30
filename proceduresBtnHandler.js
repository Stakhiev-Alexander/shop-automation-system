const fs = require('fs');

document.getElementById("avgPricesBtn").addEventListener("click", avgPricesBtnHandler);
document.getElementById("intersectSalesDatesBtn").addEventListener("click", intersectSalesDatesBtnHandler);
document.getElementById("getIncomeExpenseBtn").addEventListener("click", getIncomeExpenseBtnHandler);
document.getElementById("countIncomeBtn").addEventListener("click", countIncomeBtnHandler);

function avgPricesBtnHandler() {
  printAvgPrices()
}

function intersectSalesDatesBtnHandler() {
  goodId1 = 1
  goodId2 = 2
  printIntersectSalesDates(goodId1, goodId2)
}

function getIncomeExpenseBtnHandler() {
  console.log(new Date(1995, 11, 17))
  console.log(new Date())
  printIncomeExpense(new Date(1995, 11, 17)  ,new Date(2025, 11, 17))
}

function countIncomeBtnHandler() {
  
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
      writeStream.write(line[0]+'\n');
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
    writeStream.write('Good1 id = ' + goodId1 + 'Good2 id = ' + goodId2 + '\nDates:\n')

    result.rows.forEach(line => {
      console.log(line[0])
      writeStream.write(line[0]+'\n');
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
    writeStream.write('Date1 = ' + date1 + '; Date2 = ' + date2 + '\n')
    writeStream.write('SALES_SUM = ' + results.outBinds.SALES_SUM + '; CHARGES_SUM = ' + results.outBinds.CHARGES_SUM + '\n');
 
    
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

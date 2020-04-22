--insertion into charges--
CREATE OR REPLACE PROCEDURE insertCHARGES(
    p_amount IN CHARGES.AMOUNT%TYPE,
    p_charge_date IN CHARGES.CHARGE_DATE%TYPE,
    p_expense_item_id IN CHARGES.EXPENSE_ITEM_ID%TYPE)
IS
BEGIN

  INSERT INTO CHARGES ("AMOUNT", "CHARGE_DATE", "EXPENSE_ITEM_ID") 
  VALUES (p_amount, p_charge_date, p_expense_item_id);

  COMMIT;

END;

--insertion into expense_items--
CREATE OR REPLACE PROCEDURE insertEXPENSE_ITEMS(p_name IN EXPENSE_ITEMS.NAME%TYPE)
IS
BEGIN

  INSERT INTO EXPENSE_ITEMS ("NAME") 
  VALUES (p_name);

  COMMIT;

END;

--insertion into sales--
CREATE OR REPLACE PROCEDURE insertSALES(
    p_amount IN SALES.AMOUNT%TYPE,
    p_quantity IN SALES.QUANTITY%TYPE,
    p_sale_date IN SALES.SALE_DATE%TYPE,
    p_warehouse_id IN SALES.WAREHOUSE_ID%TYPE)
IS
BEGIN

  INSERT INTO SALES ("AMOUNT", "QUANTITY", "SALE_DATE", "WAREHOUSE_ID") 
  VALUES (p_amount, p_quantity, p_sale_date, p_warehouse_id);

  COMMIT;

END;

--insertion into expense_items--
CREATE OR REPLACE PROCEDURE insertWAREHOUSES(
    p_name IN WAREHOUSES.NAME%TYPE,
    p_quantity IN WAREHOUSES.QUANTITY%TYPE,
    p_amount IN WAREHOUSES.AMOUNT%TYPE)
IS
BEGIN

  INSERT INTO WAREHOUSES ("NAME", "QUANTITY", "AMOUNT") 
  VALUES (p_name, p_quantity, p_amount);

  COMMIT;

END;
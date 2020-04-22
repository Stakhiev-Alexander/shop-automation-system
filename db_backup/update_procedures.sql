--update charges--
CREATE OR REPLACE PROCEDURE updateCHARGES(
    p_id in CHARGES.ID%TYPE,
    p_amount IN CHARGES.AMOUNT%TYPE,
    p_charge_date IN CHARGES.CHARGE_DATE%TYPE,
    p_expense_item_id IN CHARGES.EXPENSE_ITEM_ID%TYPE)
IS
BEGIN

  UPDATE CHARGES 
  SET   AMOUNT=p_amount,
        CHARGE_DATE=p_charge_date, 
        EXPENSE_ITEM_ID=p_expense_item_id
  WHERE ID=p_id;     

  COMMIT;

END;

--update expense_items--
CREATE OR REPLACE PROCEDURE updateEXPENSE_ITEMS(
    p_id in EXPENSE_ITEMS.ID%TYPE,
    p_name IN EXPENSE_ITEMS.NAME%TYPE)
IS
BEGIN

  UPDATE EXPENSE_ITEMS 
  SET   NAME=p_name
  WHERE ID=p_id;     

  COMMIT;

END;

--update sales--
CREATE OR REPLACE PROCEDURE updateSALES(
    p_id in SALES.ID%TYPE,
    p_amount IN SALES.AMOUNT%TYPE,
    p_quantity IN SALES.QUANTITY%TYPE,
    p_sale_date IN SALES.SALE_DATE%TYPE,
    p_warehouse_id IN SALES.WAREHOUSE_ID%TYPE)
IS
BEGIN

  UPDATE SALES 
  SET   AMOUNT=p_amount,
        QUANTITY=p_quantity,
        SALE_DATE=p_sale_date,
        WAREHOUSE_ID=p_warehouse_id
  WHERE ID=p_id;     

  COMMIT;

END;

--update warehouses--
CREATE OR REPLACE PROCEDURE updateWAREHOUSES(
    p_id in WAREHOUSES.ID%TYPE,
    p_name IN WAREHOUSES.NAME%TYPE,
    p_quantity IN WAREHOUSES.QUANTITY%TYPE,
    p_amount IN WAREHOUSES.AMOUNT%TYPE)
IS
BEGIN

  UPDATE WAREHOUSES 
  SET   NAME=p_name,
        QUANTITY=p_quantity, 
        AMOUNT=p_amount
  WHERE ID=p_id;     

  COMMIT;

END;


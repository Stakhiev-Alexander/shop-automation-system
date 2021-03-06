CREATE TABLE WAREHOUSES (
    ID NUMBER(*,0) NOT NULL,
    NAME VARCHAR2(50 BYTE) NOT NULL,
    QUANTITY NUMBER(*, 0) NOT NULL,
    AMOUNT NUMBER(18,2) NOT NULL,
    CONSTRAINT WAREHOUSES_PK PRIMARY KEY(ID)
);

CREATE SEQUENCE WAREHOUSES_AUTO_INCREMENT START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER WAREHOUSES_ON_INSERT
BEFORE INSERT ON WAREHOUSES
FOR EACH ROW
BEGIN
    :NEW.ID := WAREHOUSES_AUTO_INCREMENT.NEXTVAL;
END;

CREATE TABLE SALES (
    ID NUMBER(*,0) NOT NULL,
    AMOUNT NUMBER(18,2) NOT NULL,
    QUANTITY NUMBER(*, 0) NOT NULL,
    SALE_DATE TIMESTAMP(3) NOT NULL,
    WAREHOUSE_ID NUMBER(*, 0) NOT NULL,
    CONSTRAINT SALES_PK PRIMARY KEY(ID),
    CONSTRAINT FK_SALES_WAREHOUSES FOREIGN KEY (WAREHOUSE_ID) REFERENCES WAREHOUSES(ID)
);

CREATE SEQUENCE SALES_AUTO_INCREMENT START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER SALES_ON_INSERT
BEFORE INSERT ON SALES
FOR EACH ROW
BEGIN
    :NEW.ID := SALES_AUTO_INCREMENT.NEXTVAL;
END;

CREATE TABLE EXPENSE_ITEMS (
    ID NUMBER(*,0) NOT NULL,
    NAME VARCHAR2(100 BYTE) NOT NULL,
    CONSTRAINT EXPENSE_ITEMS_PK PRIMARY KEY(ID)
);

CREATE SEQUENCE EXPENSE_ITEMS_AUTO_INCREMENT START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER EXPENSE_ITEMS_ON_INSERT
BEFORE INSERT ON EXPENSE_ITEMS
FOR EACH ROW
BEGIN
    :NEW.ID := EXPENSE_ITEMS_AUTO_INCREMENT.NEXTVAL;
END;

CREATE TABLE CHARGES (
    ID NUMBER(*,0) NOT NULL,
    AMOUNT NUMBER(18,2) NOT NULL,
    CHARGE_DATE TIMESTAMP(3) NOT NULL,
    EXPENSE_ITEM_ID NUMBER(*, 0) NOT NULL,
    CONSTRAINT CHARGES_PK PRIMARY KEY(ID),
    CONSTRAINT FK_CHARGES_EXPENSE_ITEMS FOREIGN KEY (EXPENSE_ITEM_ID) REFERENCES EXPENSE_ITEMS(ID)
);

CREATE SEQUENCE CHARGES_AUTO_INCREMENT START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER CHARGES_ON_INSERT
BEFORE INSERT ON CHARGES
FOR EACH ROW
BEGIN
    :NEW.ID := CHARGES_AUTO_INCREMENT.NEXTVAL;
END;
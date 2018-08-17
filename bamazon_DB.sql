-- Database drop, create and USE--
DROP DATABASE IF EXISTS bamazon_DB;
-- Create a database called programming_db --
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    --stock_quantity (how much of the product is available in stores)--
    -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows. product_name (Name of product), department_name, price (cost to customer),  --
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    
    product_name VARCHAR(30) NULL,
    
    department_name VARCHAR(20) NULL,
    
    price DECIMAL(10,2) NULL,

    stock_quantity INT NULL,  
    PRIMARY KEY (id)
);

-- Creates new rows
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Dairy", 3.50, 100)
,("Chicken", "Meat", 3.00, 50)
,("Frosted Flakes", "Cereal", 2.50, 25)
,("Watermelon", "Produce", 5.00, 10)
,("Pork Chops", "Meat", 6.00, 10)
,("Diet Pepsi", "Beverages", 2.00, 10)
,("Yogurt", "Dairy", 1.00, 20)
,("Oatmeal", "Cereal", 2.00, 10)
,("Sparkling Water", "Beverages", 1.00, 25)
,("Salad Dressing", "Condiments", 2.00, 25);

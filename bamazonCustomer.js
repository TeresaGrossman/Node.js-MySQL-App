var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
//Create the connection for information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_DB"
});
//creat a function to query the database for all products in the store
function start() {

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    displayItems();    
  });   
}
//write a function to display the products
function displayItems(){

  var choiceArray = [];

  connection.query("SELECT * FROM products", function(err, res){

    if(err) throw err;

    console.table(res);

    for(let i = 0; i < res.length; i++){
      choiceArray.push(res[i].product_name);
    }

    promptCustomer(choiceArray);
  })
}
//create a function to inquire what the customer wants to buy and the amount 
function promptCustomer(itemChoices){
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to buy?",
      choices: itemChoices,
      name: "item"
    },
    {
      type: "input",
      message: "How many would you like to buy?",
      name: "quantity",
      validate: function(val){
        if(!isNaN(val)){
          return true;
        }else {
          return false;
        }
      }
    }
  ]).then(function(answers){
    // console.log(answers);

    checkInventory(answers.item, answers.quantity);

  })
}

function checkInventory(item, quantity){
  connection.query("SELECT stock_quantity, price FROM products WHERE product_name=?", [item], function(err, res){
    if(err) throw err;

    // console.log(res);

    var updatedInventory = res[0].stock_quantity - quantity;
    var totalSales = quantity * res[0].price;

    if(updatedInventory >= 0){
      console.log("Congrats! You just bought " + quantity + " " + item + " for $" + totalSales);
      updateDB(item, updatedInventory);

    }else{
      console.log("Sorry! Insufficient quantity!");
      continuePrompt();
    }
  })
}

function updateDB(item, newInventory){
  connection.query("UPDATE products SET ? WHERE ?", [{
    stock_quantity: newInventory
  },{
    product_name: item
  }], function(err, res){
    if(err) throw err;

    continuePrompt();
  })
}

function continuePrompt(){
  inquirer.prompt([{
    type: "confirm",
    message: "Would you like to continue shopping?",
    name: "continue"
  }]).then(function(answers){
    if(answers.continue){
      displayItems();
    }else{
      console.log("Thank you for shopping with us! Please come back soon.")
      connection.end();
    }
  })
}

start();



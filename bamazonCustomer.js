//Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
//Prompt users with two messages.(1) id of product (2) how many
//Once the customer has placed the order, your app will check if your store has enough of the product to meet the customer's request.
//If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
//However, if your store does have enough of the product, you should fulfill the customer's order.

//This means updating the SQL database to reflect the remaining quantity.
//Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
//Create the connection information for the sql database
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

//query the database for all products in the store
function start() {
 //connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    displayItems();
    //run the start function after the connection is made to prompt the user
  });   
}

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

 
//function that prompts user for the ID of the product they would like to buy
/*    inquirer
      .prompt({
        name: "idBuy",
        type: "string",//?????????????
        message: "What is the [ID] of the product you would like to buy?",
        choices: ["ID"]
      })


    */


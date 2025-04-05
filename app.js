require('dotenv').config();
let mysql = require("mysql2");
let express = require("express");
let bodyParser = require("body-parser");
let mysqlconnection= require("./DB/Connection.js")
let cors = require("cors");
let app = express();
const util = require("util");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
//applying the css
app.use("/css", express.static("css"))
//creating the Tables
app.get("/install", (req, res) => {
    let message = "tables created successfully";
    let createProducts = `
        CREATE TABLE IF NOT EXISTS Product (
            Product_Id INT AUTO_INCREMENT PRIMARY KEY,
            Product_Url VARCHAR(250) NOT NULL,
            products_name VARCHAR(250) NOT NULL
        )`;
      let createProductDescription =   `CREATE TABLE IF NOT EXISTS ProductDescription (
            DescriptionId INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT(11),
            Product_brief_Discription VARCHAR(250) NOT NULL,
            Product_Discription VARCHAR(250) NOT NULL,
            Product_Image VARCHAR(250) NOT NULL,
            Product_Link VARCHAR(250) NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Product(Product_Id) ON DELETE CASCADE
        )`;

        let createProductPrice = `CREATE TABLE IF NOT EXISTS ProductPrice (
            PriceId INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT(11),
            StartingPrice VARCHAR(250) NOT NULL,
            PriceRange VARCHAR(250) NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Product(Product_Id) ON DELETE CASCADE
        )`;

    mysqlconnection.query(createProducts,(err) => {
        if (err) {
            return res.status(400).send("Database error occurred: " + err.message);
        }
    });
    mysqlconnection.query(createProductDescription,(err) => {
        if (err) {
            return res.status(400).send("Database error occurred: " + err.message);
        }
    });
    mysqlconnection.query(createProductPrice,(err) => {
        if (err) {
            return res.status(400).send("Database error occurred: " + err.message);
        }
    });
    res.end(message);
});

//getting the html by routing into it
app.get("/",(req,res)=>{
res.sendFile(__dirname + "/index.html")
})

// Convert MySQL query to Promise for async/await
const query = util.promisify(mysqlconnection.query).bind(mysqlconnection);
app.post("/add-product", async (req, res) => {
    try {
        // Destructure request body(destructuring assignment)
        const {
            products_name, Product_Url,
            Product_brief_Discription, Product_Discription,
            Product_Image, Product_Link,
            StartingPrice, PriceRange
        } =req.body;

        // Validate required fields
        if (!products_name || !Product_Url || !Product_brief_Discription || !Product_Discription || 
            !Product_Image || !Product_Link || !StartingPrice || !PriceRange) {
            return res.status(400).json({ error: "Missing required product fields"});
        }

        // Insert into Product table
// Using await to ensure the query execution completes before proceeding
let insertProductQuery = "INSERT INTO Product (products_name, Product_Url) VALUES (?, ?)";
await query(insertProductQuery, [products_name, Product_Url]); // Wait for the query to finish before moving on
console.log("Product inserted successfully"); // This will only log after the insertion is complete

        // Get the last inserted Product_Id
        let selectIdQuery = "SELECT Product_Id FROM Product WHERE products_name = ? ORDER BY Product_Id DESC LIMIT 1";
        let productResult = await query(selectIdQuery, [products_name]);

        if (productResult.length === 0) {
            return res.status(404).json({ error: "Product not found after insertion" });
        }

    // Extracting the Product_Id from the first result in productResult array
        let PID = productResult[0].Product_Id;

        // Insert into ProductDescription table
        let insertProductDescQuery = `INSERT INTO ProductDescription(Product_Id, Product_brief_Discription, Product_Discription, Product_Image, Product_Link) 
                                      VALUES (?, ?, ?, ?, ?)`;
        await query(insertProductDescQuery, [PID, Product_brief_Discription, Product_Discription, Product_Image, Product_Link]);
        console.log("Product description inserted successfully");

        // Insert into ProductPrice table
        let insertProductPriceQuery = `INSERT INTO ProductPrice(Product_Id, StartingPrice, PriceRange) VALUES (?, ?, ?)`;
        await query(insertProductPriceQuery, [PID, StartingPrice, PriceRange]);
        console.log("Product price inserted successfully");

        // Send success response
        res.redirect("/welcome")
            // res.json({ message: "Data inserted successfully!", product_id: PID });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

app.get("/welcome", (req,res)=>{
    res.sendFile(__dirname + "/welcome.html");
}) 
    // Endpoint to fetch all iPhone-related product data by joining multiple tables
             app.get("/iphone",(req,res)=>{
             let query =  `SELECT * FROM Product
              INNER JOIN ProductDescription ON Product.product_id = ProductDescription.product_id
              INNER JOIN ProductPrice ON Product.product_id = ProductPrice.product_id 
              `;
              mysqlconnection.query(query,(err, result, fields) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (result.length > 0) {
                    res.json({ Products: result }); 
                    // res.redirect("/welcome")
                }else{
                    res.redirect("/")
                }
                // res.json({ Products: result});
                // res.end();
            });
             })

let port = 1234;
app.listen(port, () => console.log(`Server running on port ${port}`));

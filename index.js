const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

//carBrand
//fkbuOUbxNLo6Hk1d
// console.log(process.env.DB_USERS);
// console.log(process.env.DB_PASS);

// const uri =
//   "mongodb+srv://carBrand:fkbuOUbxNLo6Hk1d@cluster0.dbdkno8.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.dbdkno8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("productDB").collection("product");
    const brandCollection = client.db("productDB").collection("allBrand");
    const CartCollection = client.db("productDB").collection("addcart");

    app.get("/allbrand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //create data
    app.post("/cart", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    // add to cart get
    app.get("/addtocart", async (req, res) => {
      const cursors = CartCollection.find();
      const result = await cursors.toArray();
      res.send(result);
    });

    //add to cart data
    app.post("/addtocart", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await CartCollection.insertOne(newProduct);
      res.send(result);
    });
    //update data
    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          description: updatedProduct.description,
          category: updatedProduct.category,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          photo: updatedProduct.photo,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );

      res.send(result);
    });

    // Detele only this user toy operation
    app.delete("/addtocart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car brand site is running");
});
app.listen(port, () => {
  console.log(`car server is runnig on port :${port}`);
});

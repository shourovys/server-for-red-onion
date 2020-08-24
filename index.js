const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

//change

const app = express()
app.use(cors())
app.use(bodyParser.json())


const uri = process.env.DB_PATH

let client = new MongoClient(uri, { useNewUrlParser: true });


// creat all API
//all get method
app.get('/foodData', (req, res) => {//get all data of a collection
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("foodData");
        // perform actions on the collection object
        if (err) {
            console.error('connection error', err);
        } else {
            collection.find().toArray((error, document) => {
                if (error) {
                    console.error('data get error', error);
                } else {
                    console.log('data successfully find');
                    res.send(document)
                }
            })
        }
        client.close();
    });
})

app.get('/getOne/:id', (req, res) => {//get One data of a collection with dynamics url
    const id = req.params.id
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("foodData");
        // perform actions on the collection object
        if (err) {
            console.error('connection error', err);
        } else {
            collection.find({ id }).toArray((error, document) => {
                if (error) {
                    console.error('data get error', error);
                } else {
                    console.log('data successfully find one');
                    res.send(document[0])
                }
            })
        }
        client.close();
    });
})

//all post method
app.post('/addFoodData', (req, res) => {
    const postData = req.body
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("foodData");
        // perform actions on the collection object
        if (err) {
            console.error('connection error', err);
        } else {
            collection.insert(postData, (error, result) => {
                if (error) {
                    console.error('data send error', error);
                } else {
                    console.log('data successfully insert');
                    res.send(result.ops)
                }
            })
        }
        client.close();
    });
})

app.post('/orderedFood', (req, res) => {
    const orderedFoodId = req.body.addedFoodId
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("foodData");
        // perform actions on the collection object
        if (err) {
            console.error('connection error', err);
        } else {
            collection.find({ id: { $in: orderedFoodId } }).toArray((error, document) => {
                if (error) {
                    console.error('cart data find error', error);
                } else {
                    console.log('cart data successfully find');
                    res.send(document)
                }
            })
        }
        client.close();
    });
})

app.post('/addOrder', (req, res) => {//order info adder
    const orderInfo = req.body.orderInfo
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("redOnion").collection("orderInfo");
        // perform actions on the collection object
        if (err) {
            console.error('connection error', err);
        } else {
            collection.insert(orderInfo, (error, result) => {
                if (error) {
                    console.error('order info adder error', error);
                } else {
                    console.log('order info added successfully');

                    res.send(result.ops[0])
                }
            })
        }
        client.close();
    });
})


const port = 4200
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
//import require modules 
const express = require('express')
const path = require("path")
const mongo = require("mongodb").MongoClient
var ObjectId = require("mongodb").ObjectId


const app = express()
const port = process.env.PORT || 8888

const dbUrl = "mongodb://127.0.0.1:27017/dogs" //connection string to testdb database
var db
var navLinks


//test mongodb connection
mongo.connect(dbUrl, (error, client) => {
    db = client.db("dogs");  //ensure that testdb is the selected DB
    db.collection("navLinks").find({}).toArray((err, res) => {
        navLinks = res
    })
})

//connect views folder and express
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

//page routing - set up Home page
app.get('/', function (req, res) {
    res.render('index', { title: "Home", links: navLinks })
})

//page routing - set up Admin page
app.get("/menu/admin", (request, res) =>{
    res.render("menu-admin", { title: "Admin Page", links: navLinks })
})

//page routing - set up Add page 
app.get("/menu/add", (request,res) => {
    res.render("menu-add", { title: "Add link", links: navLinks, numLinks:
    navLinks.length })
})

//page routing - set up Delete page 
app.get("/menu/delete", (req,res) => {
    let id = new ObjectId(req.query.linkId)
    db.collection("navLinks").deleteOne(
        {_id: id},
        (err, result) => {
            if (err) throw err
            refresh()
            res.redirect("/menu/admin")
        }
    )
})

//page routing - set up Edit page 
app.get("/menu/edit", (req, res) => {
    let id = new ObjectId(req.query.linkId)
    db.collection("navLinks").findOne({ _id: id }, (err, result) => {
        if (err) throw err
        res.render("menu-edit", { title: "Edit link", links: navLinks,
        editLink: result })
    })
})

//Refresh links automically after each add/edit/delete
function refresh() {
    db.collection("navLinks").find({}).toArray((err, result) => {
        navLinks = result;
    })
}

//form handler for adding a link
app.post("/menu/add/link", (req, res) => {
    let weight = req.body.weight
    let href = req.body.href
    let role = req.body.role
    let name = req.body.name
    let description = req.body.description
    var newLink = { "weight": weight, "href": href, "role": role, "name": name, "description": description}
    db.collection("navLinks").insertOne(newLink, (err, result) => {
        if (err) throw err
        refresh()
        res.redirect("/menu/admin")
    })
})

//form handler for edit a link
app.post("/menu/edit/link", (req, res) => {
    let id = new ObjectId(req.body.id)
    let weight = req.body.weight
    let href = req.body.href
    let role = req.body.role
    let name = req.body.name
    let description = req.body.description
    db.collection("navLinks").updateOne(
        { _id: id },
        {
        $set: {
        weight: weight,
        href: href,
        role: role,
        name: name,
        description: description
        }
        },
        { new: true },
        (err, result) => {
        if (err) throw err
        refresh()
        res.redirect("/menu/admin")
    }
    )
})


//localhosting 
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})
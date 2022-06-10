const express = require("express")
const path = require("path")
const fs = require("fs")
const { JSDOM } = require("jsdom")

//set up localhost port
const app = express()
const port = process.env.PORT || "8888"

//connect to "views" folder
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

//connect to "data" folder
var libraries;
fs.readFile("./data/library-data.kml","UTF-8", (err,data)=>{
    const dom = new JSDOM(data, { contentType: "application/xml"});
    libraries = dom.window.document;
})

//page routing
app.get("/", (req,res) => {
    let list = listAllLibraries()
    res.render("index", { title: "Home", libraries: list})
})

app.get("/:id", (req,res) => {
    // req.query.id
    // console.log(req.query.id)
    // console.log(req.query.libid)
    // let library = getLibraryById(req.query.id)
    // console.log(library)
    let id = req.query.id
    console.log(id)
    let library = getLibraryById(id)
    console.log(library)

    let libname = library.querySelector("name").textContext
    res.render("library", { title: libname, library: library})
    
})

//connect to localhost 8888
app.listen(port, ()=>{
    console.log(`Listening on http://localhost:${port}`);
})

//====FUNCTIONS=====
function listAllLibraries(){
    return libraries.querySelectorAll("Placemark");
}

function getLibraryById(id){
    let l = libraries.evaluate(`//Placemark[@id='${id}']`, libraries, "http://www.opengis.net/kml/2.2", 4, null).iterateNext();
    console.log(l)
    return l
}

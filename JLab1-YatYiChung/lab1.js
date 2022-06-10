//MODULE
var module = function() {
    //PRIVATE PROPERTIES AND METHODS
    var items = ['apple','orange'];
    var getItemsPrivate = (newFruit) =>{
        console.log(items.push(newFruit));
        console.log(items)
    }
    var setItemsPrivate = (newItems)=>{
       items = newItems;
    }

    //PUBLIC PROPERTIES AND METHODS
    return {
        getItems: getItemsPrivate,
        setItems: function (){
            setItemsPrivate();
        }
    }
}();

module.getItems("lemon");



//BLOCKING vs NON-BLOCKING

setTimeout(() => {  

    //non-blocking
    countStar=(star)=>{
        for(let i =1; i<=star;i++){
            console.log(i + " Star");
        }
    }
    countStar(10);

    //blocking
    alert("I am blocking you from doing other stuff");
    
}, 2000);


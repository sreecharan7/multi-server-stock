$( function() {
  $( "#dialog" ).dialog({
    autoOpen: false,
    modal: true
  })
});

$( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );
  $(async function() {
    var availableTags = [];
    await $.get("/all-stocks",function(data){
      availableTags=data.data;
    });
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
    $( "#tags" )
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
      })
      .autocomplete({
        minLength: 0,
        source: function( request, response ) {
          response( $.ui.autocomplete.filter(
            availableTags, extractLast( request.term ) ) );
        },
        focus: function() {
          return false;
        },
        select: function( event, ui ) {
          var terms = split( this.value );
          terms.pop();
          terms.push( ui.item.value );
          terms.push( "" );
          this.value = terms.join( ", " );
          return false;
        }
      });
  } );



let allStocks={};

const socket=io('/',{
    path:"/live-stock"
});

socket.on("stock-price",(arg)=>{
    arg=JSON.parse(arg);
    channgeStock(arg["stock"],arg["price"]);
})

function addStock(data){
    socket.emit("addStock",data,(responce)=>{
      responce=JSON.parse(responce)
      var temp=$( "#dialog" );
      if(responce.status){
        $("#tags")[0].value=""
        temp[0].innerHTML=`<p>${data} stock added</p>`;
        addStockBoxTile(data);
      }else{
        temp[0].innerHTML=`<p>${data} stock failed to add`;
      }
      temp.dialog( "open" );
    });
}


function addStock2(){
  let d=$("#tags").val();
  let arr=d.split(',');
  var temp=$( "#dialog" );
  arr=arr.map(element => element.trim()).filter(element => element!== "");
  if(arr.length==0){
    temp[0].innerHTML="please provide the stock name";
    temp.dialog( "open" );
    return;
  }
  else if(arr.length==1){addStock(arr[0]);return;}
  addStockArr(arr);
}

function addStockArr(arr,nomodel){
  var temp=$( "#dialog" );
  let data=JSON.stringify(arr);
  socket.emit("addStockMultiple",data,(responce)=>{
    responce=JSON.parse(responce);
    console.log(responce)
    if(responce.status){
      let text=`<p style="color:green;">sucessfully added stocks:-`;
      for(let i=0;i<responce.sucess.length;i++){
        text=text+responce.sucess[i]+", "
        addStockBoxTile(responce.sucess[i]);
      }
      text+=`</p><p style="color:red;">falied to add stocks:-`;
      for(let i=0;responce.failure&&i<responce.failure.length;i++){
        text=text+responce.failure[i]+", "
      }
      text+="</p>"
      temp[0].innerHTML=text;
    }else{
      temp[0].innerHTML=responce.msg;
    }
    $("#tags")[0].value=""
    if(!nomodel){
      temp.dialog( "open" );
    }
  })
}


function addStockBoxTile(stock){
  var a=$("#sortable");
  if(allStocks[stock]||allStocks[stock]==0){
    return;
  }
  allStocks[stock]=0;
  createCookie("stocksData",Object.keys(allStocks));
  a[0].innerHTML+=`<li class="ui-state-default ui-sortable-handle" id="stock-box-${stock}-main">
  <div>
   <div class="close-button-div"><button class="close-button" onclick="leaveStock('${stock}')">X</button></div>
    <div class="stock-box" id="stock-box-${stock}">
      <h1>${stock}</h1>
      <h2>Loading...</h2>
    </div>
    </div>
  </li>`;
}

function channgeStock(stock,price){
  var temp=$(`#stock-box-${stock}`);
  let text="<h3 ";
  let num=price-allStocks[stock];
  if(allStocks[stock]==0){
    text=text+`style="color:green">^ 0</h3>`
  }
  else if(num>0){
    text=text+`style="color:green">^ ${num}</h3>`
  }else{
    num*=-1;
    text=text+`style="color:red">\\/ ${num}</h3>`
  }
  temp[0].innerHTML=`
  <h1>${stock}</h1>
  <h2>₹${price}</h1>
  ${text}
  `
  allStocks[stock]=price;
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() === name) {
          return decodeURIComponent(value);
      }
  }
  return null;
}

const cookieData = getCookie("stocksData");

if (cookieData) {
    const parsedData = JSON.parse(cookieData);
    addStockArr(parsedData,true);
}

function createCookie(name,data){
  data=JSON.stringify(data);
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(data)};  expires=${expirationDate.toUTCString()};path=/; port=${window.location.port}; SameSite=Strict`;
}

function clearCokkie(name){
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; port=${window.location.port};`;
}

function clearData(){
  clearCokkie("stocksData");
  var a=$("#sortable");
  a[0].innerHTML="";
  let data=Object.keys(allStocks);
  data=JSON.stringify(data);
  allStocks={};
  socket.emit("removeStock",data,(responce)=>{
    responce=JSON.parse(responce);
    if(responce.status){
      var temp=$( "#dialog" );
      temp[0].innerHTML="cleared all the data";
      temp.dialog( "open" );
    }
  });
}

function leaveStock(stock){
  $(`#stock-box-${stock}-main`).remove();
  delete allStocks[stock];
  createCookie("stocksData",Object.keys(allStocks));
  let data=JSON.stringify([stock]);
  socket.emit("removeStock",data,(responce)=>{
    responce=JSON.parse(responce);
    if(!responce.status){
      var temp=$( "#dialog" );
      temp[0].innerHTML="failed to remove";
      temp.dialog( "open" );
    }
  });
}
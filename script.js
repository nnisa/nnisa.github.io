const api = "http://message-list.appspot.com";
var page_token;
var first_load = "/messages";



// window.onload = function() {
//     document.getElementById('messages').className += " loaded";
// }

//loading JSON object based on the url, it loads the first object and changes the URL moving forward to new tokens
function table(link){
    $.getJSON(api + link, function(message_object){
        console.log(message_object);
        create_new_messages(message_object)
    })
}

//creating individual messages based on JSON object 
function create_new_messages(message_object){
  page_token =  "/messages?pageToken=" + message_object.pageToken;
  var count = message_object.count;
  for(var i=0; i < count; i++) {
    //fetching all the important data required to create a message
    var profile_image_url = "http://message-list.appspot.com/" + message_object.messages[i].author.photoUrl;
    var author_name = message_object.messages[i].author.name;
    var author_content = message_object.messages[i].content;
    var date_time = message_object.messages[i].updated;
    var date = date_time.slice(0,10);
    var time = date_time.slice(11,19);
    // console.log(date_time);
    var id = message_object.messages[i].id;
    var messages_section = document.getElementById('messages')

    $(`<div id = ${id} class = "notification_card">`+
      `<table>`+
        `<tr>`+
          `<td>`+
            `<div class = "image_border">`+
              `<img class = "profile_image" src= ${profile_image_url}>`+
            `</div>`+
          `</td>`+
          `<td>`+
            `<div class = "content_section">`+
              `<p class = "author_name">${author_name}</p>`+
              `<p class = "date">${date}</p>`+
            `</div>`+
          `</td>`+
        `</tr>`+
      `</table>`+
      `<p class = "author_content">${author_content}</p>`+
    `</div>`).appendTo($(messages_section));
  }
}

//Printing out the first load of messages 
table(first_load);

//On scroll we will change the token value and add new messages to the list
window.onscroll = function(ev) {
    // console.log("window.innerHeight "+window.innerHeight)
    // console.log("window.scrollY "+ window.scrollY)
    // console.log("document.body.offsetHeight "+ document.body.offsetHeight)
if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    table(page_token);
    }
};

function timeDifference(current_date, input_date){
  var current_date = new Date(current_date);
  var input_date = new Date(input_date);
  
  var date_difference = input_date.getTime() - current_date.getTime();
  var milli_sec = date_difference;
  // getting hour
  var hour = Math.floor(milli_sec / 1000 / 60 / 60);
  milli_sec -=  hour * 1000 * 60 * 60;
  //getting minutes
  var minute = Math.floor(milli_sec / 1000 / 60);
  milli_sec -= minute * 1000 * 60;
  //getting second
  var second = Math.floor(milli_sec / 1000);
  milli_sec -= second * 1000;

  return (hour, minute, second);
}


function checkDate(){
  var month = new Array();
  month = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var todaysDate = new Date();
  var current_day = todaysDate.getDate();
  var current_month = todaysDate.getMonth();
  var current_year = todaysDate.getFullYear();
  
  var inputDate = "2018-01-08T11:36:23Z";
  var input_day = parseInt(inputDate.slice(8,10));
  var input_month = parseInt(inputDate.slice(5,7));
  var input_year = parseInt(inputDate.slice(0,4));

  var current_date = current_year + "-" +(current_month+1)+ "-" +current_day + " " + todaysDate.getHours() + ":" +todaysDate.getMinutes()+ ":" +todaysDate.getSeconds(); 
  var message_input_date = inputDate.slice(0,10)+ " " +inputDate.slice(12,19);
  var hour, minute, second;


  // if (input_year == current_year) { // this year
  //   if(input_month == current_month){ // this month
  //     if (input_day == current_day){ // today
  //       var hour, minute, second = timeDifference(current_date, message_input_date);


  //     } else {
  //       return (month[input_month-1]input_month + " " + input_day)
  //     }
  //   } else { // not this month
  //     return (month[input_month-1]input_month + " " + input_day)
  //   }
  // } else { // nor this year
  //     return (input_month + "/" + input_day + "/" + input_year) 
  // }
  hour, minute, second = timeDifference(current_date, message_input_date);
  console.log(hour)
  
}


checkDate();










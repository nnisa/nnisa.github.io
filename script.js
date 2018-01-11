const api = "https://message-list.appspot.com";
var page_token;
var first_load = "/messages";
var last_id = 0;

//loading JSON object based on the url, it loads the first object and changes the URL moving forward to new tokens
function table(link){
    $.getJSON(api + link, function(message_object){
        console.log(message_object);
        create_new_messages(message_object)
    })
}


//checking time difference for current date and given date
function checkDate(inputDate){
  var month = new Array();
  month = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var todaysDate = new Date();
  var current_day = todaysDate.getDate();
  var current_month = todaysDate.getMonth()+1;
  var current_year = todaysDate.getFullYear();
  
  // var inputDate = "2018-01-07T13:57:56Z";
  var input_day = parseInt(inputDate.slice(8,10));
  var input_month = parseInt(inputDate.slice(5,7));
  var input_year = parseInt(inputDate.slice(0,4));
  var input_hour = parseInt(inputDate.slice(11,13));
  var input_minute = parseInt(inputDate.slice(14,16));
  var input_second = parseInt(inputDate.slice(17,19));

  var current_date = current_year + "-" +(current_month+1)+ "-" +current_day + " " + todaysDate.getHours() + ":" +todaysDate.getMinutes()+ ":" +todaysDate.getSeconds(); 
  var message_input_date = inputDate.slice(0,10)+ " " +inputDate.slice(12,19);

  if (input_year == current_year) { // this year
    if(input_month == current_month){ // this month
      if (input_day == current_day){ // today
        if (input_hour > todaysDate.getHours()){
          return ((input_hour - todaysDate.getHours()) + " hours ago");
        } else if (input_minute > todaysDate.getMinutes()){
          return ((input_minute - todaysDate.getMinutes()) + " minutes ago");
        } else{
          return ((input_second - todaysDate.getSeconds()) + " seconds ago");
        }
      } else {
        return (month[input_month-1] + " " + input_day)
      }
    } else { // not this month
      return (month[input_month-1] + " " + input_day)
    }
  } else { // nor this year
      return (input_month + "/" + input_day + "/" + input_year) 
  }
}



//creating individual messages based on JSON object 
function create_new_messages(message_object){
  page_token =  "/messages?pageToken=" + message_object.pageToken;
  var count = message_object.count;
  for(var i=0; i < count; i++) {
    //fetching all the important data required to create a message
    var profile_image_url = "https://message-list.appspot.com/" + message_object.messages[i].author.photoUrl;
    var author_name = message_object.messages[i].author.name;
    var author_content = message_object.messages[i].content;
    var date_time = message_object.messages[i].updated;
    var received = checkDate(date_time)
    // console.log(date_time);
    last_id = (last_id + 1)
    var messages_section = document.getElementById('messages')

    $(`<div id = ${last_id} class = "notification_card">`+
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
                `<p class = "date">${received}</p>`+
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
if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight*(0.8)) {
    table(page_token);
    }
};



//SWIPE FUNCTION
var deleted_cards = 0,
id,
card, // left position of moving box
startX, // starting x coordinate of touch point
dist = 0, 
startY,// distance traveled by touch point
messages = document.getElementById('messages'),
width = messages.offsetWidth,
threshold = (width)/3,
longTouch = false,
allowedTime = 200,
restraint = 100, 
elapsedTime,
startTime,
scrolling_end = false,
move_distY,
move_distX


$("#messages").on("touchstart", function(e) {
  console.log("touchstart initiated")
      // e.preventDefault();
      id = $(e.target.closest(".notification_card")).attr('id');
      
      card = document.getElementById(id)

      startTime = new Date().getTime()
      var touchobj = e.touches[0] // reference first touch point
      startX = parseInt(touchobj.clientX)
      startY = parseInt(touchobj.clientY) // get Y coord of touch point
      // e.preventDefault() // prevent default click behavior
    });



$("#messages").on("touchmove", function(e) {
  console.log("touchmove initiated")
  console.log(id);
  var touchobj = e.touches[0]
  move_distX = e.touches[0].clientX - startX// get horizontal dist traveled by finger while in contact with surface
  move_distY = e.touches[0].clientY - startY// get vertical dist traveled by finger while in contact with surface
  
  if (Math.abs(move_distX) > 0 && Math.abs(move_distY)  < Math.abs(move_distX) ){
    touchobj = e.touches[0] // reference first touch point for this event
    dist = parseInt(touchobj.clientX) - startX // calculate dist traveled by touch point
    // move box according to starting pos plus dist
    card.style.marginLeft = dist + 'px';
    e.preventDefault()
    e.stopPropagation();
    console.log("swipe")
  } else {
    console.log("scroll", "X " + Math.abs(move_distX), "Y " + Math.abs(move_distY))
    $(window).scroll();
    scrolling_end = false;
  }
});



$("#messages").on("touchend", function(e) {
  console.log("touchend initiated")
      e.preventDefault();

      var touchobj = e.changedTouches[0]
      distX = touchobj.clientX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.clientY - startY // get vertical dist traveled by finger while in contact with surface

      elapsedTime = new Date().getTime() - startTime // get time elapsed

      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
          if (distX < 0){
            swipedir('left', distX)
          } else {
            swipedir('right', distX)
          }
          e.preventDefault()

      }else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
          if (distY < 0){
            swipedir('up')
          } else {
            swipedir('down')
          }
      } else {
        console.log("go back")
        card.style.margin = '0 auto';
      }
    move_distY = 0
    move_distX = 0
    });


  function swipe_now(move_value){
    card.style.transition = 'all .5s ease-out';
    card.style.marginLeft = move_value +'px';
    deleted_cards+=1
    load_more (deleted_cards)
    setTimeout(function(){
      card.style.transition = 'all .5s ease-out';
      card.style.height = '0px';
      card.style.paddingTop = '0px';
     }, 600);
    setTimeout(function(){
      $('#'+ id).remove();
     }, 1000);

  }


  function swipedir(direction, dist){
    if (direction === 'left'){
      console.log("Left Swipe")
      swipe_now('-'+ width);
    } else if (direction === 'right'){
      console.log("right Swipe")
      swipe_now(parseInt(width)+10);
    } else if (direction === 'up'){
      $(window).scroll();
      console.log("Scroll up")
    } else if (direction === 'down'){
      $(window).scroll();
      console.log("Scroll down")
    }
  }

      // var card_height = document.getElementById(id).offsetHeight;
      // console.log(card_height);

function load_more (deleted_cards){
  var no_notification_card = document.getElementById("messages").childElementCount;
  var remaining_cards = no_notification_card - deleted_cards
  console.log(remaining_cards)
  if (remaining_cards < 5){
    table(page_token);
  }
}

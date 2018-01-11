const api = "https://message-list.appspot.com";
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
if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    table(page_token);
    }
};


$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};





//SWIPE FUNCTION
var id,
card, // left position of moving box
startX, // starting x coordinate of touch point
dist = 0, 
startY,// distance traveled by touch point
width = (document.getElementById('messages')).offsetWidth,
threshold = (width)/3,
longTouch = false,
allowedTime = 200,
restraint = 100, 
elapsedTime,
startTime,
scrolling_end = false,
move_distY,
move_distY

$(window).scrollEnd(function(){

    scrolling_end = true;
}, 900);



$("#messages").on("touchstart", function(e) {
  console.log("touchstart initiated")
      // e.preventDefault();
      id = $(e.target.closest(".notification_card")).attr('id');
      
      card = document.getElementById(id)
      move_distY = 0
      move_distY = 0
      startTime = new Date().getTime()
      var touchobj = e.changedTouches[0] // reference first touch point
      startX = parseInt(touchobj.clientX)
      startY = parseInt(touchobj.clientY) // get Y coord of touch point
      // e.preventDefault() // prevent default click behavior
    });



$("#messages").on("touchmove", function(e) {
  console.log("touchmove initiated")
  // console.log(id);

  var touchobj = e.changedTouches[0]
  move_distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
  move_distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
  
  if (Math.abs(move_distX) > 0 && Math.abs(move_distY)  < Math.abs(move_distX) ){
    touchobj = e.changedTouches[0] // reference first touch point for this event
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
      distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface

      elapsedTime = new Date().getTime() - startTime // get time elapsed


      // if (elapsedTime <= allowedTime){ // first condition for awipe met
          if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
              if (distX < 0){
                swipedir('left', distX)
              } else {
                swipedir('right', distX)
              }
              e.preventDefault()

          }
          else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
              if (distY < 0){
                swipedir('up')
              } else {
                swipedir('down')
              }
          }
      // }
    });



  function swipedir(direction, dist){
    if (direction === 'left'){
      console.log("Left Swipe")
      card.style.transform = 'translate3d(' + width + 'px,0,0)';

    } else if (direction === 'right'){
      console.log("right Swipe")
      card.style.transform = 'translate3d(-' + width + 'px,0,0)';
    } else if (direction === 'up'){
      $(window).scroll();
      console.log("Scroll up")
    } else if (direction === 'down'){
      $(window).scroll();
      console.log("Scroll down")
    }
  }




  // card.animate({
  //   marginLeft: parseInt(card.css('marginLeft'),10) == 0 ?
  //     $marginLefty.outerWidth() :
  //     0
  // });



//    card.animate({
//     padding: "0px",
//        'margin-left':'-10px',
//     'font-size': "0px"
//   }, 500, function() {
        
//       $(this).remove();      
//   });
// });

//   card.slideLeft(function() {
//     $(this).remove();
//   });


























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
    var profile_image_url = "http://message-list.appspot.com/" + message_object.messages[i].author.photoUrl;
    var author_name = message_object.messages[i].author.name;
    var author_content = message_object.messages[i].content;
    var date_time = message_object.messages[i].updated;
    var received = checkDate(date_time)
    // console.log(date_time);
    var id = message_object.messages[i].id;
    var messages_section = document.getElementById('messages')

    $(`<div class = "card_wrapper">`+
        `<div id = ${id} class = "notification_card">`+
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
        `</div>`+
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



//Swipe gesture 

if (navigator.msMaxTouchPoints) { // checking if it is touch device or not 
      console.log("Not a mobile device!")
    } else {

      var div = {

        el: {
          messages: $("#messages"),
          holder: $("#1"),
          notification_card: $(".notification_card")
        },

        messagesWidth: $('#messages').width(),
        touchstartx: undefined,
        touchmovex: undefined,
        movex: undefined,
        index: 0,
        longTouch: undefined,
        
        init: function() {
          this.allEvents();
        },

        allEvents: function() {

          this.el.holder.on("touchstart", function(event) {
            div.start(event);
          });

          this.el.holder.on("touchmove", function(event) {
            div.move(event);
          });

          this.el.holder.on("touchend", function(event) {
            div.end(event);
          });

        },

        start: function(event) {
          console.log("start printed")
          this.longTouch = false;
          setTimeout(function() {
            window.messages.longTouch = true;
          }, 250);

          // Get the original touch position.
          this.touchstartx =  event.originalEvent.touches[0].pageX;

          // The movement gets all janky if there's a transition on the elements.
          $('.animate').removeClass('animate');
        },

        move: function(event) {
          console.log("move printed")
          // Continuously return touch position.
          this.touchmovex =  event.originalEvent.touches[0].pageX;
          // Calculate distance to translate holder.
          this.movex = this.index*this.messagesWidth + (this.touchstartx - this.touchmovex);
          // Defines the speed the images should move at.
          var panx = 100-this.movex/6;
          if (this.movex < 600) { // Makes the holder stop moving when there is no more content.
            this.el.holder.css('transform','translate3d(-' + this.movex + 'px,0,0)');
          }
          if (panx < 100) { // Corrects an edge-case problem where the background image moves without the container moving.
            this.el.notification_card.css('transform','translate3d(-' + panx + 'px,0,0)');
          }
        },

        end: function(event) {
          console.log("end printed")
          // Calculate the distance swiped.
          var absMove = Math.abs(this.index*this.messagesWidth - this.movex);
          // Calculate the index. All other calculations are based on the index.
          if (absMove > this.messagesWidth/2 || this.longTouch === false) {
            if (this.movex > this.index*this.messagesWidth && this.index < 2) {
              this.index++;
            } else if (this.movex < this.index*this.messagesWidth && this.index > 0) {
              this.index--;
            }
          }      
          // Move and animate the elements.
          this.el.holder.addClass('animate').css('transform', 'translate3d(-' + this.index*this.messagesWidth + 'px,0,0)');
          this.el.notification_card.addClass('animate').css('transform', 'translate3d(-' + 100-this.index*50 + 'px,0,0)');
        }
      };
      div.init();
    }










































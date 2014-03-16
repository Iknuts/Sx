 
 var pp = 0;
function UpdateExRates() {
      
             $.support.cors = true;
             $.getJSON(
             // NB: using Open Exchange Rates here, but you can use any source!
             'http://openexchangerates.org/api/latest.json?app_id=68cbc545e730424b86eb8bedcf58800e',
              function (data) {
                  clearCountries();
                  var k = 0;
                  $.each(data.rates, function (i, info) {
                      try {

                          LoadCurrencyItem(i, info);
                          k++;
                      }
                      catch (err) {
                          showMsg(err, "System Error", "error");
                      }
                  });
                  var ff = localStorage.getItem("isfrontend");

                  if (ff == false) { }
                  else {
                     
                      $('#aboutme').panel("close").delay(3000);
                       showMsg("Welldone... you have successfully updated " + k + "currencies", "Update complete", "info");
                     
                  }
                  UpdateLastCheck();
                  loadlists();
                  $("#loadtext").text("Completed... find method to change page");
              }

                                                                                                                 );

localStorage.setItem("isbusy", false);
           }
 function LoadCurrencyItem(code, rate) {
               $.support.cors = true;
                try {

                    $.getJSON("http://openexchangerates.org/api/currencies.json?app_id=68cbc545e730424b86eb8bedcf58800e",
                    function (data) {

                        $.each(data, function (i, info) {
                            if (i == code) {

                                var obj = { name: info, rate: rate }
                                localStorage.setItem(code, JSON.stringify(obj));
                                pp += 1;
                                $("#loadtext").text("Updating...(" + pp + "   of  166).... ");
                                if (pp >= 165) {
                                   
                                    UpdateLastCheck();
                                    loadlists();
                                    GoToMain();
                                    $("#loadtext").text("Updating..complete.... ");

                                }
                            }
                        });

                    });

               }
               catch (err) { 
              showMsg(err,"System Error","error"); 
               }

           } 
 function loadlists() {
  
               clearCountries();
               for (var i = 0; i < localStorage.length; i++) {
                   try {
                       var a = localStorage.key(i);
                       if (a.length == 3) {
                           
                           var me = JSON.parse(localStorage.getItem(a));
                           var html = '<option value="' + a + '">' + a + '-   ' + me.name + '</option>';
                           $(html).appendTo($('#fromlist'));
                           $(html).appendTo($('#tolist'));
                       }
                   }
                   catch (err) {
                   }



               }
               sortlist("fromlist");
               sortlist("tolist");
           } 
 function sortlist(list) {
               var lb = document.getElementById(list);
               arrTexts = new Array();

               for (i = 0; i < lb.length; i++) {
                   arrTexts[i] = lb.options[i].text;
               }

               arrTexts.sort();

               for (i = 0; i < lb.length; i++) {
                   lb.options[i].text = arrTexts[i];
                   var t = arrTexts[i].toString();
                   var g = t.split("-");

                   lb.options[i].value = g[0];
               }
           }
 
function clearCountries() {
 $('#fromlist').empty();
 $('#tolist').empty();

           }
function GoToMain() {
           $.mobile.changePage("#main", "flip");
           }
 function GoToError() {
           $.mobile.changePage("#errorpage");
           }
 function UpdateLastCheck() {
               var d = new Date();
               localStorage.setItem("lastupdate", d);

           }
     function Convert() {
                $.support.cors = true;
                try {
                    var a = $('#amount').val();
                    if (a == 0 || a == null) {
                        showMsg("Umm.... Invalid amount... please input the amount in the field provided", "That Broke!?!?", "warning");
                        return;
                    }
                    var f = $('#fromlist').val();
                    var t = $('#tolist').val();
                    if (f == t) {
                        showMsg("Haibo!!! You want to convert into the same currency? Please try again", "Some S**t we can't do!", "error");
                        return;
                    }
                    var rate = JSON.parse(localStorage.getItem(f));

                    var q = (a / rate.rate);
                    var conv = JSON.parse(localStorage.getItem(t));
                    var res = ((q * conv.rate));
                    $(".fromtext").text("Exchanging from (" + rate.name + "s)");

                    //  $('#result').text(res.toFixed(2) + " " + t);
                    $('#result').text(res.toFixed(2));
                    $('#result').currency({ region: t, decimal: '.', thousands: ' ', decimals: 2 });
                    $('#result').append("  (" + t + ")");


                    var ex = (conv.rate / rate.rate);
                    var date = localStorage.getItem("lastupdate");
                    $('#dateupdated').text(date);
                    var g = conv.name;
                    var e = g.split(" ");
                    var fg = e[e.length - 1];
                    var fd = String.prototype.pluralize(a, fg);
                    var g1 = rate.name;
                    var e1 = g1.split(" ");
                    var fg1 = e1[e1.length - 1];
                    var fd1 = String.prototype.pluralize(a, fg1);

                    $('#resultrate').text("1 : "+ex.toFixed(4));
                  //  var p = $('#resultrate').currency({ region: t, decimal: '.', thousands: ' ', decimals: 4 });
                   // $('#resultrate').append("  (" + t + ")");
                    var tt = (a * 1);
                   
                    $('#amttext').text( "("+tt.toFixed(2)+ ") "+ fd1 + "s  looking for " + g + "s");

                   // $('#base').text(" " + fd1);
                    $('#resultcaption').text("Converting from " + fd1 + "-to-" + fd);

                    $('#messagebox').popup("open");
                }
                catch (err) {
                    showMsg(err, "System Error", "error");
                }
            }
            String.prototype.pluralize = function (count, plural) {
                if (plural == null)
                    plural = this + 's';

                return (count == 1 ? this : plural)
            }    
                function showMsg(msg, cap, typ) {
                $('#msgtext').text(msg);
                $('#msgcaption').text(cap);
                switch (typ) {
                    case "error":
                        $('#msgtype').attr("class", "message error");
                        $('#msgicon').attr("class", "icon-exclamation-sign");
                        break;
                    case "success":
                        $('#msgtype').attr("class", "message success");
                        $('#msgicon').attr("class", "icon-thumbs-up-alt");
                        break;
                    case "info":
                        $('#msgtype').attr("class", "message info");
                        $('#msgicon').attr("class", "icon-lightbulb");
                        break;
                    case "warning":
                        $('#msgtype').attr("class", "message warning");
                        $('#msgicon').attr("class", "icon-warning-sign");
                        break;
                }
                $("#mbox").popup();
                $("#mbox").popup("open");
            }
            function closeMsg() {
                $("#mbox").popup();
                $('#mbox').popup("close");
            } 

 
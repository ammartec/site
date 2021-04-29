(function(window, document){"use strict";// Localize jQuery variables
// var jQuery, $ = window.jQuery;
var app_url=getDsmAppUrl();
var $grid;

// Localize jQuery variables
var env_urls = sk_getEnvironmentUrls();

var app_url = env_urls.app_url;
var app_backend_url = env_urls.app_backend_url;
var app_file_server_url = env_urls.app_file_server_url;

// loading animation
var el = document.getElementsByClassName('sk-ww-google-business-profile')[0];

if(el==undefined){
    var el = document.getElementsByClassName('dsm-ww-google-business-profile')[0];

    if(el!=undefined){
        el.className = "sk-ww-google-business-profile";
    }
}

if(el!=undefined){
    el.innerHTML = "<div class='first_loading_animation' style='text-align:center; width:100%;'><img src='" + app_url + "images/ripple.svg' class='loading-img' style='width:auto !important;' /></div>";
}
// load css
loadCssFile(app_url + "embed/google-business-profile/sass/widget.css?v=501e2bca3cc2d1ab70a618ef5e03286b");
loadCssFile("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

// load css file
function loadCssFile(filename){

    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);

    if(typeof fileref!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}/******** Load jQuery if not present *********/

//  https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js- old one(james)

if (window.jQuery === undefined) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    scriptLoadHandler();
}

function loadScript(url, callback){

	/* Load script from url and calls callback once it's loaded */
	var scriptTag = document.createElement('script');
	scriptTag.setAttribute("type", "text/javascript");
	scriptTag.setAttribute("src", url);

	if (typeof callback !== "undefined") {
		if (scriptTag.readyState) {
			/* For old versions of IE */
			scriptTag.onreadystatechange = function(){
				if (this.readyState === 'complete' || this.readyState === 'loaded') {
					callback();
				}
			};
		} else {
			scriptTag.onload = callback;
		}
	}
	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {

    loadScript(app_url + "embed/libs/js/custom.js", function(){
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        $ = jQuery = window.jQuery.noConflict(true);

        // Call our main function
        
            main();
    });
  

}function sk_getEnvironmentUrls(){

    // auto detect live and dev version
    var scripts = document.getElementsByTagName("script");
    var scripts_length=scripts.length;
    var search_result=-1;
    var app_url="";
    var app_backend_url = "https://api.accentapi.com/v1/";
    var app_file_server_url = "https://data.accentapi.com/feed/";

    for(var i=0; i<scripts_length; i++){
        var src_str=scripts[i].getAttribute('src');

        if(src_str!=null){
          search_result=src_str.search("embed/google-business-profile/widget");

          // app-dev found if greater than or equal to 1
          if(search_result>=1){ 
            var src_arr=src_str.split("embed/google-business-profile/widget");
            app_url=src_arr[0];

            // replace if displaysocialmedia.com
            app_url = app_url.replace("displaysocialmedia.com", "sociablekit.com");

            // get app backend url
            if(app_url.search("local")>=1){
                app_backend_url = "http://localhost:3000/v1/";
                app_file_server_url = app_url + "data.accentapi.com/feed/";
            }
          }
        }
    }
    
    return {
        "app_url" : app_url,
        "app_backend_url" : app_backend_url,
        "app_file_server_url" : app_file_server_url
    };
}
function getDsmAppUrl(){

    // auto detect live and dev version
    var scripts = document.getElementsByTagName("script");
    var scripts_length=scripts.length;
    var search_result=-1;
    var app_url="";

    for(var i=0; i<scripts_length; i++){
        var src_str=scripts[i].getAttribute('src');

        if(src_str!=null){
          search_result=src_str.search("embed/google-business-profile/widget");

          // app-dev found if greater than or equal to 1
          if(search_result>=1){
            var src_arr=src_str.split("embed/google-business-profile/widget");
            app_url=src_arr[0];

            // replace if displaysocialmedia.com
            app_url = app_url.replace("displaysocialmedia.com", "sociablekit.com");
          }
        }
    }

    return app_url;
}

function getDsmEmbedId(sk_facebook_feed){
    var embed_id = sk_facebook_feed.attr('embed-id');
    if(embed_id==undefined){
        embed_id = sk_facebook_feed.attr('data-embed-id');
    }

    return embed_id;
}

function getDsmSetting(sk_facebook_feed, key){
    return sk_facebook_feed.find("." + key).text();
}

function replaceContentWithLinks ( html ,sk_facebook_feed) {
    var text = html.html();
    if(text){
        text = text.replace(/(\r\n|\n\r|\r|\n)/g, "<br>");
        text = replaceHttpToLink(text);
        text = text.replace(/#(\w+)/g, '<a target="_blank" href="http://facebook.com/hashtag/$1">#$1</a>');
        text = text.replace(/@([a-z\d_]+)/ig, '<a target="_blank" href="http://facebook.com/$1">@$1</a>'); 

        html.html(text);
    }
}

function replaceHttpToLink(content)
{
   var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
   var element_content=content.replace(exp_match, '<a class="href_status_trigger hide-link" target="_blank" href="$1">$1</a>');
   var new_exp_match =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
   var new_content=element_content.replace(new_exp_match, '$1<a class="href_status_trigger hide-link" target="_blank" href="http://$2">$2</a>');
   return new_content;
}

function addNumberCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}function loadBioInformation(sk_facebook_feed,data){

    var post_items="";

    if(
        getDsmSetting(sk_facebook_feed, "show_profile_picture")==0 && getDsmSetting(sk_facebook_feed, "show_profile_username")==0 && getDsmSetting(sk_facebook_feed, "show_profile_follow_button")==0
        && getDsmSetting(sk_facebook_feed, "show_profile_follower_count")==0  && getDsmSetting(sk_facebook_feed, "show_profile_name")==0
        && getDsmSetting(sk_facebook_feed, "show_profile_description")==0 && getDsmSetting(sk_facebook_feed, "show_profile_website")==0
    ){
        // do not display buttons
    }else{

        post_items+="<div class='sk-google-business-profile-root-container'>";
            if(getDsmSetting(sk_facebook_feed, "show_profile_picture")==1 && getDsmSetting(sk_facebook_feed, "cover_photo")){
                post_items+="<div class='sk-google-business-profile-profile-pic' style='background-image:url(" + getDsmSetting(sk_facebook_feed, "cover_photo") + ");'></div>";
            }
            post_items+="<div class='sk-google-business-profile-profile-info width-60'>";
                post_items+="<div class='sk_facebook_posts_feed_username_follow'>";
                    if(getDsmSetting(sk_facebook_feed, "show_profile_name")==1){
                        post_items+="<span class='sk-google-business-profile-profile-usename' style='float:unset;margin:0;'><a class='href_status_trigger_feed' target='_blank' style='text-decoration: none;' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id="+data.content.google_place_id+"'>" + data.content.place_name + "</a></span>";
                    }
                    
                post_items+="</div>";
                post_items+="<div class='sk-google-business-profile-profile-counts'>";
                    
                    if(getDsmSetting(sk_facebook_feed, "show_reviews_overall_rating")==1 && data.content.average_review){
                        post_items+="<span class='sk-google-business-profile-profile-count-item'><span class='f-w-b'>" + data.content.average_review+ " <i class='fa fa-star' aria-hidden='true'></i></span> ";
                    }
                    if(getDsmSetting(sk_facebook_feed, "show_profile_follower_count")==1 && data.content.reviews_count){
                        post_items+=addNumberCommas(data.content.reviews_count)+" reviews</span>";
                    }

                post_items+="</div>";
                
            post_items+="</div>";

            post_items+="<div class='sk-google-business-profile-profile-info width-full'>";

                
                post_items+="<div class='href_status_trigger_feed_container sk-google-business-profile-profile-description'>";
                    if(getDsmSetting(sk_facebook_feed, "show_profile_description")==1){
                        post_items+=data.content.description.replace("· ", "") + " ";
                    }

                post_items+="</div>";
                if(getDsmSetting(sk_facebook_feed, "show_profile_follow_button")==1){
                        post_items+="<button onclick=\"window.open('https://www.google.com/maps/search/?api=1&query=Google&query_place_id="+data.content.google_place_id+"');\" class='sk-google-business-profile-follow-btn'>";
                            post_items+="<i class='fa fa-google' aria-hidden='true'></i>"+getDsmSetting(sk_facebook_feed, "view_on_source_text")+" ";
                        post_items+="</button>";
                    }
            post_items+="</div>";
        post_items+="</div>";
    }

    return post_items;
}

function loadGMBP(sk_facebook_feed){

    var embed_id=getDsmEmbedId(sk_facebook_feed);
    var json_url=app_file_server_url + embed_id + ".json?nocache=" + (new Date()).getTime();
    // get events
    fetch(json_url, { method: 'get' })
    .then(function(response) {
        response.json().then(function(data) {
            

            if(typeof data.show_feed != 'undefined' && data.show_feed==false){
                sk_facebook_feed.prepend(data.message);
                sk_facebook_feed.find('.loading-img').hide();
                sk_facebook_feed.find('.first_loading_animation').hide();
            }
            else if(typeof data.show_feed != 'undefined'  && data.message=="load failed"){
                sk_facebook_feed.html(data.instructions);
            }
            else if(typeof data.message != 'undefined' && data.message.indexOf('Data not available') !== -1){

                var sk_error_message ="<ul class='sk_error_message'>";
                    sk_error_message +="<li>Unable to load Google My Business Profile.</li>";
                    sk_error_message +="<li>It takes upto 24 hours to sync this solution.</li>";
                    sk_error_message +="<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>";
                sk_error_message +="</ul>";
                sk_facebook_feed.html(sk_error_message);
            }
            else{

                data.content.open_hours = data.content.open_hours ? JSON.parse(data.content.open_hours) : "";
                var margin_bottom = "16px";
                var post_items="";
                post_items+= "<div class='sk-google-business-profile-container'>";
                post_items+= loadBioInformation(sk_facebook_feed,data);

                post_items+="<div class='sk-ww-google-business-profile-content-container sk-google-profile-info-container'>";
                    var main_info_width = "";
                    if(sk_facebook_feed.width() >= 480 && getDsmSetting(sk_facebook_feed, "show_event_schedule")==1){
                        main_info_width = "style='width: 50% !important;'";
                    }
                    post_items+="<table "+main_info_width+" class='sk-ww-google-business-profile-main-info sk-ww-google-business-profile-content-container sk-ww-google-business-profile-tbl-container'>";
                    if(getDsmSetting(sk_facebook_feed, "show_location")==1 && data.content.location){
                        post_items+="<tr>";
                            post_items+="<td><label class='sk-google-profile-info-label'>Address</label><a class='sk-google-business-profile-address-link' href='https://www.google.com/maps/place/?q=place_id:"+data.content.google_place_id+"' target='_blank'>"+ data.content.location+ "</a></td>";
                        post_items+="</tr>";
                        post_items+="<tr>";
                            post_items+="<td>"+ data.content.locatedin+ "</td>";
                        post_items+="</tr>";
                    }
                    if(getDsmSetting(sk_facebook_feed, "show_post_link")==1 && data.content.website){
                        post_items+="<tr>";
                            var website_url = "";
                            if (data.content.website.indexOf("http") > -1) {
                                website_url = data.content.website;
                            }
                            else{
                                
                                data.content.website = data.content.website.trim();
                                website_url = "https://"+data.content.website;
                            }
                            post_items+="<td class='sk-google-profile-website'><label class='sk-google-profile-info-label'>Website</label>"+ website_url + "</td>";
                        post_items+="</tr>";
                    }
                    if(getDsmSetting(sk_facebook_feed, "show_upcoming")==1 && data.content.phone){
                        post_items+="<tr>";
                            post_items+="<td><label class='sk-google-profile-info-label'>Phone</label>"+ data.content.phone+ "</td>";
                        post_items+="</tr>";
                    }
                    
                    if(getDsmSetting(sk_facebook_feed, "show_plus_code")==1 && data.content.plus_code){
                        post_items+="<tr>";
                            post_items+="<td><label class='sk-google-profile-info-label'>Plus code</label>"+ data.content.plus_code+ "</td>";
                        post_items+="</tr>";
                    }
                    post_items+="</table>";
                    post_items+="<table class='sk-ww-google-business-profile-content-container'>";
                    
                    
                    if(getDsmSetting(sk_facebook_feed, "show_event_schedule")==1 && typeof data.content.open_hours != 'null' && data.content.open_hours.length > 0){
                        margin_bottom = "0px";
                        post_items+="<tr>";
                            post_items+="<td><label class='sk-google-profile-info-label'>Business Hours</label></td>";
                        post_items+="</tr>";
                        post_items+="<tr>";
                            post_items+="<td style='padding: 0px;'>";
                            post_items+="<table class='sk-ww-google-business-profile-content-container' style='padding: 0px;'>";
                                    var day_texts = "";
                                    jQuery.each(data.content.open_hours,function(index,value){
                                        
                                        var sched_style_mobile = "";
                                        var is_weekday = (value['day'] == 'Monday' ||
                                        value['day'] == 'Tuesday' || value['day'] == 'Wednesday' || value['day'] == 'Thursday'
                                        || value['day'] == 'Friday' || value['day'] == 'Saturday' || value['day'] == 'Sunday');
                                        if(sk_facebook_feed.width() <= 480 && is_weekday){
                                            sched_style_mobile = "style='width: 100px !important; padding-left: 2px;'";
                                        }else if(jQuery(document).width() <= 720 && is_weekday){
                                            sched_style_mobile = "style='width: 250px !important;'";
                                        }else{
                                            sched_style_mobile = "colspan='1'";
                                        }

                                        if(value['hour']){
                                            var two_day_format = "";
                                            if(value['hour'].includes("<br>") && value['hour'].split("<br>").length >= 2){
                                                if(value['hour'].split("<br>").length>1){
                                                    if(value['hour'].split("<br>")[1] != ""){
                                                        two_day_format = "<br>&nbsp";
                                                    }
                                                }
                                            }
                                            // hide day if day already displayed
                                            if(day_texts.indexOf(value['day']) != -1){
                                                value['day'] = '<span style="visibility:hidden;">'+value['day']+'</span>';
                                            }
                                            else{
                                                day_texts+=value['day'];
                                            }
                                            post_items+="<tr>";
                                                post_items+="<td "+sched_style_mobile+">"+ value['day']+ two_day_format+ "</td>";
                                                post_items+="<td>"+ value['hour']+ "</td>";
                                            post_items+="</tr>";
                                        }
                                    });
                                    
                                    
                                post_items+="</table>";
                            post_items+="</td>";
                        post_items+="</tr>";
                    }
                    else if(typeof data.content.business_status != 'undefined' && data.content.business_status =="CLOSED_TEMPORARILY"){
                        margin_bottom = "0px";
                        post_items+="<tr>";
                            post_items+="<td><label class='sk-google-profile-info-label'>Business Hours</label></td>";
                        post_items+="</tr>";
                        post_items+="<tr>";
                            post_items+="<td style='padding: 0px;'>";
                            post_items+="<table class='sk-ww-google-business-profile-content-container' style='padding: 0px;'>";
                                            post_items+="<tr>";
                                                post_items+="<td colspan='3' >Temporarily closed</td>";
                                            post_items+="</tr>";
                                post_items+="</table>";
                            post_items+="</td>";
                        post_items+="</tr>";
                    }
                    post_items+="</table>";
                post_items+="</div></div>";


                post_items += getSociableKITBranding(sk_facebook_feed, "");

                sk_facebook_feed.append(post_items);

                applyCustomUi(jQuery, sk_facebook_feed);
                jQuery(".sk-ww-google-business-profile-tbl-container").css({
                    "margin-bottom" : margin_bottom
                })
                replaceContentWithLinks(sk_facebook_feed.find('.sk-google-profile-website'), sk_facebook_feed);
            }
        });
    })
    .catch(function(err) {
        console.log('GETTING DATA RETURN ERROR!');
        console.log(err);

        var sk_error_message ="<ul class='sk_error_message'>";
            sk_error_message +="<li>Our system is currently syncing with your Google Business Profile.</li>";
            sk_error_message +="<li>This usually takes only a few minutes but might take longer.</li>";
            sk_error_message +="<li>Try to refresh this page after 1 minute.</li>";
            sk_error_message +="<li>If the refresh did not work, we will send you an email once your feed is ready.</li>";
        sk_error_message +="</ul>";
        sk_facebook_feed.html(sk_error_message);
    });

}
// make widget responsive
function makeResponsive(jQuery, sk_facebook_feed){

    var sk_facebook_feed_width = sk_facebook_feed.width();

	/* smartphones, iPhone, portrait 480x320 phones */
	if(sk_facebook_feed_width<=320){ }

	/* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
	else if(sk_facebook_feed_width<=481){ }

	/* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
	else if(sk_facebook_feed_width<=641){
    }

	/* tablet, landscape iPad, lo-res laptops ands desktops */
	else if(sk_facebook_feed_width<=930){
    }


 
}

function applyCustomUi(jQuery, sk_facebook_feed){
    // hide 'loading animation' image
    sk_facebook_feed.find(".loading-img").hide();

    // container width
    var sk_facebook_feed_width=sk_facebook_feed.find('.sk_facebook_feed_width').text();

    // container width
    sk_facebook_feed.css({ 'width' : '100%' });
    var sk_facebook_feed_width=sk_facebook_feed.innerWidth();

    if(sk_facebook_feed_width < 680){
        jQuery(".sk-ww-google-business-profile-main-info").css({
            "width" : "100%"
        });
    }

    // change height to normal
    sk_facebook_feed.css({'height' : 'auto'});

    // identify column count
    var column_count=1;

    // size settings
    var border_size=0;
    var background_color="#555555";
    var space_between_images=sk_facebook_feed.find('.space_between_images').text();
    var margin_between_images=parseFloat(space_between_images).toFixed(2) / 2;

    var total_space_between_images=parseFloat(space_between_images).toFixed(2)*parseFloat(column_count);
    var pic_width=(parseFloat(sk_facebook_feed_width).toFixed(2)-parseFloat(total_space_between_images).toFixed(2)) / parseFloat(column_count).toFixed(2);

    var sk_ig_all_posts_minus_spaces=parseFloat(sk_facebook_feed_width).toFixed(2)-parseFloat(total_space_between_images).toFixed(2);
    var bottom_button_container_width=parseFloat(sk_facebook_feed_width).toFixed(2)-(parseFloat(space_between_images).toFixed(2)*2);
    var bottom_button_width=parseFloat(sk_facebook_feed_width).toFixed(2) / parseFloat(2).toFixed(2);

    // apply font family
    sk_facebook_feed.css({
        'font-family' : getDsmSetting(sk_facebook_feed, "font_family"),
        'background-color' : getDsmSetting(sk_facebook_feed, "details_bg_color"),
        'color' : getDsmSetting(sk_facebook_feed, "details_secondary_font_color")
    });

  
    sk_facebook_feed.css({
        'color' : getDsmSetting(sk_facebook_feed, "details_font_color"),
        'font-size' : getDsmSetting(sk_facebook_feed, "details_font_size"),
    });

    sk_facebook_feed.find('table').css({
        'color' : getDsmSetting(sk_facebook_feed, "details_font_color"),
        'font-size' : getDsmSetting(sk_facebook_feed, "details_font_size"),
    });

    // sk-fb-page-name
    sk_facebook_feed.find('.sk-fb-page-name').css({
        'font-family' : getDsmSetting(sk_facebook_feed, "font_family")
    });

    sk_facebook_feed.find(".sk-google-business-profile-user-container,.sk-google-business-profile-follow-btn")
        .css({
            'background-color' : getDsmSetting(sk_facebook_feed, "button_bg_color"),
            'border-color' : getDsmSetting(sk_facebook_feed, "button_bg_color"),
            'color' : getDsmSetting(sk_facebook_feed, "button_text_color")
        });

    sk_facebook_feed.find(".sk-google-business-profile-user-container, .sk-google-business-profile-load-more-posts, .sk-google-business-profile-bottom-follow-btn")
        .mouseover(function(){
            $(this).css({
                'background-color' : getDsmSetting(sk_facebook_feed, "button_hover_bg_color"),
                'border-color' : getDsmSetting(sk_facebook_feed, "button_hover_bg_color"),
                'color' : getDsmSetting(sk_facebook_feed, "button_hover_text_color")
            });
        }).mouseout(function(){
            $(this).css({
                'background-color' : getDsmSetting(sk_facebook_feed, "button_bg_color"),
                'border-color' : getDsmSetting(sk_facebook_feed, "button_bg_color"),
                'color' : getDsmSetting(sk_facebook_feed, "button_text_color")
            });
        });

    sk_facebook_feed.find('.sk-google-business-profile-profile-description strong').css({
        'color' : getDsmSetting(sk_facebook_feed, "details_secondary_font_color")
    });

    sk_facebook_feed.css({
        'width' : 'auto'
    });

    // watermark css
    jQuery('.sk_powered_by a').css({
        'background-color' : getDsmSetting(sk_facebook_feed, "details_bg_color"),
        'color' : getDsmSetting(sk_facebook_feed, "details_font_color"),
        'font-size' : getDsmSetting(sk_facebook_feed, "details_font_size"),
    });
    setTimeout(function(){
        sk_facebook_feed.find(".sk-google-business-profile-container a").css({
            "color" : getDsmSetting(sk_facebook_feed, "details_link_color")
        });
        sk_facebook_feed.find(".sk-google-business-profile-container a")
        .mouseover(function(){
            $(this).css({
                'color' : getDsmSetting(sk_facebook_feed, "details_link_hover_color")
            });
        }).mouseout(function(){
            $(this).css({
                'color' : getDsmSetting(sk_facebook_feed, "details_link_color")
            });
        });
    },10);
    // apply custom css
    jQuery('head').append('<style type="text/css">' + getDsmSetting(sk_facebook_feed, "custom_css")  + '</style>');
    
}

// our main function
function main(){

    // manipulate page using jQuery
    jQuery(document).ready(function($) {

        jQuery('.sk-ww-google-business-profile').each(function() {
            // know what to show
            var sk_facebook_feed=jQuery(this);

            // get embed id for global use
            var embed_id=getDsmEmbedId(sk_facebook_feed);

            // change height to be more than current window
            var new_sk_facebook_feed_width=jQuery(window).height() + 100;
            sk_facebook_feed.height(new_sk_facebook_feed_width);

            // get settings
            var json_url=app_url + "embed/google-business-profile/widget_settings_json.php?embed_id=" + embed_id;

            jQuery.getJSON(json_url, function(data){

                // load google font
                var web_safe_fonts = [
                    "Inherit", "Impact, Charcoal, sans-serif", "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                    "Century Gothic, sans-serif", "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", "Verdana, Geneva, sans-serif",
                    "Copperplate, 'Copperplate Gothic Light', fantasy", "'Courier New', Courier, monospace", "Georgia, Serif"
                  ];
  
                  var is_font_included = web_safe_fonts.indexOf(data.font_family);
                  if(is_font_included<0){ loadCssFile("https://fonts.googleapis.com/css?family=" + data.font_family); }


                if(data.show_feed==false){
                    sk_facebook_feed.prepend(data.message);
                    sk_facebook_feed.find('.loading-img').hide();
                    sk_facebook_feed.find('.first_loading_animation').hide();
                }

                else{

                    // save some settings in html
                    var settings_html="";

                    // settings for easy access
                    // loop through settings from dsm server
                    settings_html+="<div style='display:none;' class='display-none sk-settings'>";
                        jQuery.each(data, function(key, value){ settings_html+="<div class='" + key + "'>" + value + "</div>"; });
                    settings_html+="</div>";

                    if(sk_facebook_feed.find('.sk-settings').length){ }
                    else{ sk_facebook_feed.prepend(settings_html); }

                    // empty settings
                    settings_html="";
                    setTimeout(function(){
                        loadGMBP(sk_facebook_feed);
                    },1000); // wait for cache to be created
                }

            });
        });

        // resize elements in real time
        jQuery(window).resize(function(){

            // feed
            jQuery('.sk-ww-google-business-profile').each(function(){
                var sk_facebook_feed=jQuery(this);
                sk_facebook_feed.css({ 'width' : '100%' });

                var new_inner_width=sk_facebook_feed.innerWidth();

                jQuery('.sk_facebook_feed_width').text(new_inner_width);
                applyCustomUi(jQuery, sk_facebook_feed);
            });
        });

        
    }); // end document ready
}}(window, document));


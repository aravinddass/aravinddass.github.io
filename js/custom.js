jQuery(document).ready(function(){var t=$("#logo");-1!=location.href.indexOf("#")&&t.show(),$(".menu .tabs a").click(function(){t.fadeIn("slow")}),$(".tab-profile").click(function(){t.fadeOut("slow")}),$(".skills li .rating").each(function(t,i){for(var n=7,e=$(i).attr("data-rat");n>0;)$(i).append("<span></span>"),n--;$(i).find("span").each(function(t,i){if(t>=e)return!1;$(i).animate({opacity:1})})}),$(".photo-inner ul").carouFredSel({direction:"left",circular:!0,auto:!0,scroll:{items:1,fx:"crossfade",duration:1500,wipe:!0},swipe:{onTouch:!0},items:{width:153}});var i=$("#content");i.easytabs({animate:!0,updateHash:!1,transitionIn:"slideDown",transitionOut:"slideUp",animationSpeed:600,tabs:".tmenu",tabActiveClass:"active"}),i.find(".tabs li a").hover(function(){$(this).stop().animate({marginTop:"-7px"},200)},function(){$(this).stop().animate({marginTop:"0px"},300)}),$(".menu .tabs").carouFredSel({responsive:!0,direction:"left",circular:!1,infinite:!1,pagination:"#menu-controls",auto:!1,scroll:{items:1,duration:300,wipe:!0},prev:{button:"#menu-prev",key:"right"},next:{button:"#menu-next",key:"left"},swipe:{onTouch:!0},items:{width:140,visible:{min:2,max:5}}}),$(".cats-filter").find("a").click(function(){$(this).attr("data-filter");$(this).parent().parent().find("a").removeClass("current"),$(this).addClass("current")});var n=$("#contactform");n.submit(function(){return $(".error,.success").remove(),response='<div class="error"> Mail service is not working.Please contact me on my mobile number or directly write to my mail id </div>',n.prepend(response),!1});var e=$("#map");e.gmap().bind("init",function(t,i){e.gmap("addMarker",{position:"12.969178,77.743308",bounds:!0}).click(function(){e.gmap("openInfoWindow",{content:"Mini Villa"},this)}),e.gmap("option","zoom",16)}),i.bind("easytabs:after",function(t,i,n){e.gmap("refresh")})});

var templateURL 	= '',
	siteURL 		= '';

function loadHelpers()
{
	ratioKeep();
	verticalPos();
	lazyLoading();
}
	function ratioKeep()
	{
		$("[data-x]").each(function(index,element)
		{
			var xRat = $(this).data("x"),
				yRat = $(this).data("y");
				
			var wid = $(this).width(),
				hei = (wid*yRat)/xRat;
				
			$(this).height(hei);
		});
		iframeChange();
	}
	
	function verticalPos()
	{
		$("[data-vertical]").each(function(index,element)
		{
			var margTop = ($(this).height()/2)*-1;
			
			$(this).css({"margin-top":margTop});
		});
	}
	function iframeChange()
	{
		$("iframe").each(function()
		{
			var xRat = 16,
				yRat = 9;
			
			var par = $(this).parent(),
				parWidth = par.width(),
				hei = (parWidth*yRat)/xRat;
			
			$(this).width(parWidth).height(hei);
		});
	}
	
$(window).resize(function(e)
{
    loadHelpers();
});



// JavaScript Document

var speedTrans = 15;

function triggerStage()
{
	var currStage = $("#main").data("stage");
	
	var target = $(".layer-"+currStage).not(".layer-"+(currStage + 1));
	var revTarget = $(".layer-"+(currStage + 1)).not(".layer-"+currStage);
	
	
	if(currStage<4)
	{
	
		target.each(function(index,element)
		{
			var hei = parseInt($(this).css("font-size"));
			$(this).width($(this).width()).height(hei).attr("data-wid",parseInt($(this).width()));
			
			//$(this).delay(index*speedTrans).fadeTo(500,0);
			
			if(index==(target.length-1))
			{
				target.fadeTo(1000,0);
			}
		});
		
		
		
		/*
		setTimeout(function()
		{
			backtoTop(1000);
		},1500);
		*/
		
		backtoTop(1000);
		
		target.promise().done(function()
		{
			$(this).css({"width":0});
			$(this).hide();
			$("span.layer-"+(currStage + 1)+":not(.layer-"+currStage+")").show().css({"width":"auto"});
			$("a.layer-"+(currStage + 1)+":not(.layer-"+currStage+")").show().css({"width":"auto"});
			$("span.paragraph.layer-"+(currStage + 1)+":not(.layer-"+currStage+")").css({"width":"100%"});
			
			var callB = function()
			{
				$("span.layer-"+(currStage + 1)+":not(.layer-"+currStage+")").fadeTo(500,1);
				$("a.layer-"+(currStage + 1)+":not(.layer-"+currStage+")").fadeTo(500,1);
			};
			
			setPositions(1);
			setTimeout(callB,100);
		});
		
		$("#main").data("stage",currStage + 1);
	}
	
	if(currStage==3)
	{
		var afterContent = '<div class="after_content">'+
								'<a data-id="30" data-slug="/work/" data-title="Work" href="http://dev.shewasonly.co.uk/jonr/work/" class="ajaxHook">See the work</a><br>'+
								'<a class="share_button" href="javascript:shareButton(\'twitter\',\'Check out this home page by copywriter @fullstopnewpara (best viewed on a desktop) www.fullstopnewparagraph.co.uk\',\'\');">Share</a>'+
							'</div>';
		$(".heightSet").after(afterContent);
		
		ajaxHookLink();
	}
}

function ajaxHookLink()
{
	$("a.ajaxHook").click(function(e)
	{
		if(e.button==0)
		{
			var slug = $(this).data("slug"),
				title = $(this).data("title"),
				id = $(this).data("id");
			
			if(id=="0") // making a rule for the stupid index call
			{
				History.pushState({
					slug:slug,
					title:siteName,
					id:id
				}, siteName, siteURL)
			}
			else
			{
				if($("header").is(":visible")&&pageTitle==title)
				{
					toggleMenu();
				}
				
				History.pushState({
					slug:slug,
					title:title,
					id:id
				}, siteName + " \u2014 " + title, siteURL+slug)
				
				pageTitle = title;
			}
			
			e.preventDefault();
			return false;
		}
	});
}

function backtoTop(del)
{
	if(del)
	{
		$("html,body").animate({scrollTop:0},del);
	}
	else
	{
		$("html,body").animate({scrollTop:0},1000);
	}
}

$(window).on("resize",function()
{
	if($(".editor").length==0)
	{
    	setPositions();
	}
},100);




	
var wordSpace = 8;

function setPositions(timed)
{
	$container = $("#main p");
	$words = $container.find(".standard");
	$paragraphs = $container.find(".paragraph");
	$triggers = $container.find(".trigger");
	
	$words.css({"position":"absolute"});
	$triggers.css({"position":"absolute"});
	$paragraphs.css({"position":"absolute"});
	
	var totalWid = $container.width();
	var lineHeight = parseInt($words.css("line-height"));
	
	var checkWid = 0;
	var currHei = 0;
	
	var currStage = $("#main").data("stage");
	
	$("[data-layer-"+currStage+"]").each(function(index,element)
	{
		var currTxt = $(this).data("layer-"+currStage);
		
		$(this).text(currTxt);
	});
	
	$(".trigger").hover(function(e)
	{
		$(".trigger:visible").stop(false).fadeTo(250,0.5);
	},function(e)
	{
		$(".trigger:visible").stop(false).fadeTo(250,1);
	});
	
	var last = $container.children().length;
	
	$container.children().each(function(index,element)
	{
		
		$(this).removeClass("strikethrough");
		if($(this).is(":visible"))
		{
			var currWid = $(this).width();
			
			if((checkWid+currWid)>totalWid)
			{
				checkWid = 0;
				
				if(currStage==4&&$(this).hasClass("paragraph"))
				{
					
				}
				else
				{
					currHei += lineHeight;
				}
			}
			
			$(this).css({"left":checkWid,"top":currHei});
			
			checkWid += currWid + wordSpace;
		}
		
		if(index==(last-1))
		{
			if(currStage==4)
			{
				$("footer").css({"opacity":1});
				setTimeout(function()
				{
					//$(".after_content").removeClass("offLeft");
					$(".after_content").fadeTo(500,1);
				},1500);
				
				var elemArr = $(".heightSet").find("a:visible");
				
				addAttr($(elemArr.get(0)),30,"work/index.html","Work",siteURL+"/work/");
				addAttr($(elemArr.get(1)),30,"work/index.html","Work",siteURL+"/work/");
				addAttr($(elemArr.get(2)),30,"work/index.html","Work",siteURL+"/work/");
				$(elemArr.get(3)).attr("href","javascript:shareButton('twitter','Check out this home page by copywriter @fullstopnewpara (best viewed on a desktop) www.fullstopnewparagraph.co.uk','')");
				ajaxHookLink();
				
				
				//elemArr.get(0).attr("href",siteURL+"/work");
			}
			/*
			if($("#main p").hasClass("notset"))
			{
				$("#main .preload").delay(3000).fadeOut(250,function()
				{
					$("#main p").fadeTo(250,1,function()
					{
						$("#main p").removeClass("notset");
					});
				});
			}
			*/
		}
	});
	
	if($container.hasClass("heightSet"))
	{
		$container.animate({"height":(currHei+lineHeight)},500);
		/*
		if(timed)
		{
			setTimeout(function()
			{
				$container.animate({"height":(currHei+lineHeight)},500);
			},1000);
		}
		else
		{
			$container.animate({"height":(currHei+lineHeight)},500);
		}
		*/
	}
	else
	{
		if(!$(".preload").is(":visible"))
		{
			$container.height((currHei+lineHeight));
			$container.addClass("heightSet");
		}
		else
		{
			$container.addClass("hidit").data("hei",(currHei+lineHeight));
		}
	}
}

function addAttr(elem,j_id,j_slug,j_title,j_href)
{
	elem.attr("href",j_href);
	elem.data("title",j_title);
	elem.data("slug",j_slug);
	elem.data("id",j_id);
	elem.addClass("ajaxHook");
}

function moveWord(i,wid,hei,del)
{
	setTimeout(function()
	{
		$("#main p").children().eq(i).css({"left":wid,"top":hei});
	},del);
}

var viewingObj = {};
		
function determineView()
{
	var wid = $(window).width(),
		hei = $(window).height();
		
	viewingObj.width = wid;
	viewingObj.height = hei;
	/*
	viewingObj.mobile = jQuery.browser.mobile;
	viewingObj.touch = Modernizr.touch;
	*/
	
	if(wid>1400)
	{
		viewingObj.size = "desktop";
		viewingObj.index = 1;
		wordSpace = 8;
	}
	else if(wid<=1400&&wid>950)
	{
		viewingObj.size = "desktop";
		viewingObj.index = 2;
		wordSpace = 8;
	}
	else if(wid<=950&&wid>768)
	{
		viewingObj.size = "tablet";
		viewingObj.index = 3;
		wordSpace = 6;
	}
	else if(wid<=768&&wid>480)
	{
		viewingObj.size = "tablet";
		viewingObj.index = 4;
		wordSpace = 6;
	}
	else if(wid<=480)
	{
		viewingObj.size = "mobile";
		viewingObj.index = 5;
		wordSpace = 4;
	}
	
	window.viewingObj = viewingObj;
}

$(document).ready(function(e) {
	loadFire(0);
});

$(window).resize(function(e) {
    determineView();
});

function loadFire(fire)
{
	if(fire==1)
	{
		determineView();
		
		
	}
	else
	{
		bindEmail();
	
		$("#navicon").click(function(e)
		{
			toggleMenu();
			e.preventDefault();
			return false;
		});
		
		$(".foot_message_title").click(function()
		{
			$("#email_text").focus();
		});
		
		$("#email_text").focus(function()
		{
			$(this).attr("placeholder","Type your message...");
		});
		$("#email_text").blur(function()
		{
			$(this).attr("placeholder","Hi Jon...");
		});
		
		if($("#main").length)
		{
			
			$("#main:not(.editor) span:not(.layer-1)").css({"opacity":0,"width":0,"display":"none"});
			$("#main:not(.editor) a:not(.layer-1, #home_advance)").css({"opacity":0,"width":0,"display":"none"});
			$("#home_advance").removeAttr("style");
			
			$(".trigger").hover(function()
			{
				var currStage = $("#main").data("stage");
				var target = $(".layer-"+currStage).not(".layer-"+(currStage + 1));
				
				target.addClass("strikethrough");
				
			},function()
			{
				var currStage = $("#main").data("stage");
				var target = $(".layer-"+currStage).not(".layer-"+(currStage + 1));
				target.removeClass("strikethrough");
				
			});
			
			$("#home_advance").click(function(e)
			{
				e.preventDefault();
				setPositions();
				$("#main .preload").fadeOut(500,function()
				{
					$("#main p").height($("#main p").data("hei")).removeClass("hidit");
					$("#main p").fadeTo(500,1,function()
					{
						$("#main p").removeClass("notset");
					});
				});
				return false;
			});
			
		}
	}
    loadHelpers();
	
	$(".cat_list_individual a").click(function(e)
	{
		e.preventDefault();
		
		return false;
	});
	
	$("a.ajaxHook").click(function(e)
	{
		if(e.button==0)
		{
			var slug = $(this).data("slug"),
				title = $(this).data("title"),
				id = $(this).data("id");
			
			if(id=="0") // making a rule for the stupid index call
			{
				History.pushState({
					slug:slug,
					title:siteName,
					id:id
				}, siteName, siteURL)
			}
			else
			{
				if($("header").is(":visible")&&pageTitle==title)
				{
					toggleMenu();
				}
				
				History.pushState({
					slug:slug,
					title:title,
					id:id
				}, siteName + " \u2014 " + title, siteURL+slug)
				
				pageTitle = title;
			}
			
			e.preventDefault();
			return false;
		}
	});
	
	$(".niceButton").click(function()
	{
		signupEmail($(".niceInput").val());
	});
	
	if($(".client_list").length)
	{
		if(window.location.hash)
		{
			var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
			
			if(hash != "" && hash != "_")
			{
				if (hash == "play" || hash == "work") {
					worktoggle(hash);
				} else {
					reshuffle(hash);
					$(".workShuffle."+hash).addClass("active");
					$(".cat_list_individual").addClass("active");						
				}
			}
		}

		$(".workToggle").click(function(e)
		{
			worktoggle($(this).attr("data-type"));
		});

		$(".workShuffle").click(function(e)
		{
			e.preventDefault();
			
			if(!$(this).hasClass("active"))
			{
				var currSlug = $(this).data("slug");

				$(".workShuffle").removeClass("active");
				
				if(currSlug!="")
				{
					$(this).addClass("active");
				}
				
				window.location.hash = currSlug;
				
				reshuffle(currSlug);

				$(".cat_list_individual").addClass("active");

			}
			else
			{
				$(this).removeClass("active");
				
				window.location.hash = "_";
				
				reshuffle("");

				$(".cat_list_individual").removeClass("active");

			}
			
			return false;
		});
	}		
	
	if($("#main").length)
	{
		setTimeout(function()
		{
			setPositions();
		},1000);
	}
	
	if($("#testimonials").length)
	{
		setTestimonials();
	}
}

var animateIt;

function setTestimonials()
{
	var target = $("#testimonials li").eq(0);
	
	target.addClass("active");
	
	target.show();
	
	$("#testimonials").height(target.height());
	var timing = target.data("timing");
	
	if($("#testimonials li").length>1)
	{
		animateIt = setTimeout(function()
		{
			nextQuote();
		},timing);
	}
}

function nextQuote()
{
	var currInd = $("#testimonials li.active").index("#testimonials li");
	var nextInd = currInd+1;
	
	if(currInd>=($("#testimonials li").length-1))
	{
		nextInd = 0;
	}
	
	$("#testimonials li.active").fadeOut(500,function()
	{
		$(this).removeClass("active");
		$("#testimonials li:eq("+nextInd+")").css({"opacity":0}).show();
		
		$("#testimonials").animate({"height":$("#testimonials li:eq("+nextInd+")").height()});
		
		$("#testimonials li:eq("+nextInd+")").fadeTo(500,1,function()
		{
			$(this).addClass("active");
			var timing = $(this).data("timing");
			
			animateIt = setTimeout(function()
			{
				nextQuote();
			},timing);
		});
	});
	
	
}

function toggleMenu()
{
	if($("header").is(":visible"))
	{
		$("html").removeClass("headerOpen");
		$("#navicon").removeClass("close");
		$("header").fadeOut(250,function()
		{
			$("#menu_hold li").hide();
			$("#menu_hold li").removeClass("show");
		});
	}
	else
	{
		$("html").addClass("headerOpen");
		$("#navicon").addClass("close");
		$("header").fadeIn(250,function()
		{
			$("#menu_hold li").each(function(index, element) {
                $(this).delay((index*50)+50).fadeIn(500);
				addClassYeah($(this),(index*50)+50);
            });
		});
	}
}

function addClassYeah(block,del)
{
	setTimeout(function()
	{
		$(block).addClass("show");
	},del);
}

function bindEmail()
{
	$("#email_text").focus(function()
	{
		if($(this).text()=="Hi Jon...")
		{
			$(this).html("");
			$(this).addClass("focused");
			$(this).focus();
		}
	});
	$("#email_text").blur(function()
	{
		if($(this).text()=="")
		{
			$(this).html("Hi Jon...");
			$(this).removeClass("focused");
		}
	});

	$("#email_text").on("keyup",function()
	{
		var currVal = $(this).text();
		
		if(currVal.length>0)
		{
			$("#email_send").prop("disabled",false);
			$("#email_send").fadeTo(250,1);
			$("#email_address").prop("disabled",false);
			$("#email_address").fadeTo(250,1);
		}
		else
		{
			$("#email_send").prop("disabled",true);
			$("#email_send").fadeTo(250,0);
			$("#email_address").prop("disabled",true);
			$("#email_address").fadeTo(250,0);

		}
	},250);
	
	$("#email_send").click(function()
	{
		if(!$(this).prop("disabled"))
		{
			$(".send_wrap .overlay").fadeIn(250);
			var dataStr = {
				email : $("#email_address").val(),
				message : $("#email_text").html()
			};
			
			if(validateEmail(dataStr.email))
			{
				$.getJSON(templateURL+"/includes/sendMail.php",dataStr,function(data)
				{
					if(data.success==1)
					{
						$(".send_wrap .overlay").fadeOut(250);
						$("#email_address").val("");
						$("#email_text").prop("contenteditable",false).html("Thanks for your message!").change();

				
						setTimeout(function()
						{
							$("#email_text").prop("contenteditable",true).html("").trigger("keyup").html("Hi Jon...");
							
						},1500);					
					}
				});
			}
			else
			{
				$("#email_address").val("Please enter a valid E-mail address")
			}
		}
	});
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 


function reshuffle(clss)
{
	var theList = $(".client_list");
	
	if(clss!="")
	{
		var currTarget = theList.find("."+clss);
		var otherTargets = theList.find("li").not("."+clss).not(".play");
		
		currTarget.fadeTo(250,1);
		otherTargets.fadeTo(250,0.3);
	}
	else
	{
		theList.find("li").fadeTo(250,1);
	}
}

function worktoggle(clss)
{
	var active_btn = $(".workToggle[data-type='"+clss+"']"),
		active_list = $(".client_list[data-type='"+clss+"']");

	$(".workToggle").not(active_btn).removeClass("active");
	active_btn.addClass("active");

	$(".client_list").not(active_list).removeClass("active");
	active_list.addClass("active");

	if (clss == "play") {
		$("#category-block").addClass("dn");
	} else {
		$("#category-block").removeClass("dn");
	}
}

function slideshowMove(sshow, dir, fx)
{

    var slides = sshow.find(".slide"),
    	slide = sshow.find(".slide.active"),
    	easing = "linear",
    	speed = 280,
    	dist = sshow.width(),
    	slide_next;

   if (dir == "prev") {
		
   		if (fx=="fade") {

			slide.fadeOut(speed, easing);       			

   		} else {

			// Move the slide in view
			slide.stop().animate({
			    left: dist
			}, speed, easing, function () {
			    $(this).hide(0).css({
			        left: 0
			    });
			});       			

   		}

        // Select the previous slide
        slide_next = slide.prev();

        // If the there's no previous slide, select the last slide
        if (!slide_next.length) {
            slide_next = slides.last();
        }
		
   		if (fx=="fade") {

			slide_next.fadeIn(speed, easing);       			

        } else {

			// Move the previous slide
            slide_next.css({
                left: -dist
            }).show(0).stop().animate({
                left: 0
            }, speed, easing);

        }

    } else {
    	
   		if (fx=="fade") {

			slide.fadeOut(speed, easing);       			

   		} else {

			// Move the slide in view
            slide.stop().animate({
                left: -dist
            }, speed, easing, function () {
                $(this).hide(0).css({
                    left: 0
                });
            });

        }

		// Select the next slide
        slide_next = slide.next();

        // If the there's no next slide, select the first slide
        if (!slide_next.length) {
            slide_next = slides.first();
        }
		
   		if (fx=="fade") {

			slide_next.fadeIn(speed, easing);       			

        } else {

			// Move the next slide				
            slide_next.css({
                left: dist
            }).show(0).stop().animate({
                left: 0
            }, speed, easing);

    	}

    }

	var slide_i = slide_next.index();			

	var bull = sshow.find(".sshow-bullet:nth-child("+(slide_i+1)+")");
	sshow.find(".sshow-bullet").not(bull).removeClass("active");
	bull.addClass("active");

    slide_next.addClass("active");
    sshow.find(".slide").not(slide_next).removeClass("active");    

}

$(document).ready(function(e) {

	$("body").on("click", ".sshow-btn", function(e) {
    	e.preventDefault();
    	var sshow = $(this).closest(".sshow");
		if (sshow.find(".slide").length > 1) {        	
    		var dir = ($(this).hasClass("sshow-btn-prev")) ? "prev" : "next" ;
    		var fx = sshow.attr("data-fx");
     		slideshowMove(sshow, dir, fx);
     	}
    });

	$("body").on("swipeleft", ".sshow", function(e) {
    	e.preventDefault();
    	if ($(this).find(".slide").length > 1) {
    		var fx = $(this).attr("data-fx");  		
        	slideshowMove($(this), "next", fx);	
    	}
    });

	$("body").on("swiperight", ".sshow", function(e) {
    	e.preventDefault();
    	if ($(this).find(".slide").length > 1) {        	
			var fx = $(this).attr("data-fx");        		
        	slideshowMove($(this), "prev", fx);
    	}
    });

});

///////////////////////
//
// HISTORY.JS HANDLERS
//
///////////////////////
	
	
	(function(window,undefined){
		
		if ( document.location.protocol === 'file:' ) {
			alert('The HTML5 History API (and thus History.js) do not work on files, please upload it to a server.');
		}
		
		var History = window.History,
			State = History.getState();
			
		History.Adapter.bind(window,'statechange',function(){
			
			var State = History.getState();
			
			if(State.data.id!=null)
			{
				if($("header").is(":visible"))
				{
					toggleMenu();
				}
				
				getContent(State.data.id,false,State.data.filter);
			}
			else
			{
				getContent(null,true,State.data.filter);
			}
		});
	
	})(window);
	
	function getContent(id,rel,filter)
	{
		var cont = $(".ajaxChangeWrap");
		var trans = 500;
		
		backtoTop();
		
		$("footer").fadeTo(trans,0);
		cont.fadeTo(trans,0,function()
		{
			if(rel==false)
			{
				$.getJSON(templateURL+"/includes/ajax/getPost.php",{ id:id },function(data)
				{
					cont.html(data.content);
					
					if($("#main").length)
					{
						
						$("#main:not(.editor) span:not(.layer-1)").css({"opacity":0,"width":0,"display":"none"});
						$("#main:not(.editor) a:not(.layer-1)").css({"opacity":0,"width":0,"display":"none"});
						$("#home_advance").removeAttr("style");
						
						$("#home_advance").click(function(e)
						{
							e.preventDefault();
							setPositions();
							$("#main .preload").fadeOut(250,function()
							{
								$("#main p").height($("#main p").data("hei")).removeClass("hidit").addClass("heightSet");
								$("#main p").fadeTo(250,1,function()
								{
									$("#main p").removeClass("notset");
								});
							});
							return false;
						});
						
						$(".trigger").hover(function()
						{
							var currStage = $("#main").data("stage");
							var target = $(".layer-"+currStage).not(".layer-"+(currStage + 1));
							
							target.addClass("strikethrough");
							
						},function()
						{
							var currStage = $("#main").data("stage");
							var target = $(".layer-"+currStage).not(".layer-"+(currStage + 1));
							target.removeClass("strikethrough");
							
						});
						
					}
					
					
					
					if(id==46) // CONTACT PAGE OR HOME PAGE
					{
						$(".contact-box").css({"opacity":0});
					}
					else if(id==0)
					{
						$("footer").css({"opacity":0});
					}
					else
					{
						if($(".contact-box").css("opacity")==0)
						{
							$(".contact-box").css({"opacity":1});
						}
						if($("footer").css("opacity")==0)
						{
							$("footer").css({"opacity":1});
						}
					}
					
					if(id!=0)
					{
						$("footer").fadeTo(trans,1);
					}
					cont.fadeTo(trans,1,function()
					{
						loadFire(1);
					});
					loadHelpers();
				});
			}
			else
			{
				window.location.reload();
			}
		});
	}
	
	
	
	
	function signupEmail(email)
	{
		$.getJSON(templateURL+"/includes/signupEmail.php",{ email: email },function(data)
		{
			if(data.success==1)
			{
				$(".niceInput").prop("disabled",true).val("Thanks");
			}
			else
			{
				$(".niceInput").attr("data-keep",$("#signupBox").val());
				$(".niceInput").prop("disabled",true).val(data.error);
				
				setTimeout(function()
				{
					var oldVal = $(".niceInput").attr("data-keep");
					$(".niceInput").val(oldVal);
					$(".niceInput").prop("disabled",false);
				},1500);
			}
		});
	}
	
	function shareButton(loc,text,linked)
	{
		switch(loc)
		{
			case "twitter":
				var width  = 575,
					height = 400,
					left   = ($(window).width()  - width)  / 2,
					top    = ($(window).height() - height) / 2,
					shorten = text.substr(0,100);
				var url    = 'https://twitter.com/share?text='+shorten+'&url='+encodeURIComponent(linked)+'&via=fullstopnewpara';
				
				if(!linked)
				{
					shorten = text.substr(0,130);
					url    = "https://twitter.com/share?text="+shorten+"&url=/";
				}
					
				var opts   = 'status=1' +
							 ',width='  + width  +
							 ',height=' + height +
							 ',top='    + top    +
							 ',left='   + left;
			
				window.open(url, 'twitter', opts);
				break;
		}
	}
	
	function openGame()
	{
		var width  = 940,
			height = 540,
			left   = ($(window).width()  - width)  / 2,
			top    = ($(window).height() - height) / 2,
			url    = '../clients.signal-noise.co.uk/eurofinance/index.html',
			opts   = 'status=1' +
					 ',width='  + width  +
					 ',height=' + height +
					 ',top='    + top    +
					 ',left='   + left;
	
		window.open(url, 'Eurofinance', opts);
	}
	
	function lazyLoading()
	{
		$(".lazy").each(function(index, element) {
            var originalImage = $(this).data("original");
			
			var copy = $(this);
			
			var img = new Image();
			img.src = originalImage;
			img.onload = function()
			{
				copy.attr("src",originalImage).addClass("set");
			};
        });
	}
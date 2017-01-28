
// Create Namespace
var KG = window.KG || {};

/* LOCATIONS */
KG.Locations = KG.Locations || {};

/* EVENT MANAGER */
KG.EventManager = KG.EventManager || $({});

/* COLLECTIONS */
KG.Collection = KG.Collection || {};

/* MODELS */
KG.Model = KG.Model || {};

/* VIEWS */
KG.View = KG.View || {};
KG.View.Components = KG.View.Components || {};

/* DATA */
KG.Data = KG.Data || {};
KG.Data.FADE_IN_DURATION = 400;
KG.Data.FADE_OUT_DURATION = 100;
KG.Data.LabelGraduate = "Graduate/Entry level";
KG.Data.LabelExperienced = "Experienced (non-manager)";

/* TEMPLATES LIST TO PRELOAD */
KG.Templates = [
    {
        "id" : "home",
        "path" : "home.html"
    },{
        "id" : "inspiration",
        "path" : "about/inspiration/inspiration.html"
    },{
        "id" : "inspiration-tpl-1",
        "path" : "about/inspiration/inspiration-tpl-1.html"
    },{
        "id" : "inspiration-tpl-2",
        "path" : "about/inspiration/inspiration-tpl-2.html"
    },{
        "id" : "inspiration-tpl-3",
        "path" : "about/inspiration/inspiration-tpl-3.html"
    },{
        "id" : "case-studies",
        "path" : "about/case-studies.html"
    },{
        "id" : "partners",
        "path" : "about/partners.html"
    },{
        "id" : "careers",
        "path" : "careers.html"
    },{
        "id" : "job-search",
        "path" : "careers/job-search.html"
    },{
        "id" : "job-detail",
        "path" : "careers/job-detail.html"
    },{
        "id" : "start-your-career",
        "path" : "careers/start-your-career.html"
    },{
        "id" : "grow-your-career",
        "path" : "careers/grow-your-career.html"
    },{
        "id" : "unicef",
        "path" : "careers/unicef.html"
    },{
        "id" : "people-stories",
        "path" : "careers/people-stories.html"
    },{
        "id" : "creativity-inspiration",
        "path" : "careers/creativity-inspiration.html"
    },{
        "id" : "company-news",
        "path" : "company-news.html"
    },{
        "id" : "contact",
        "path" : "contact.html"
    },{
        "id" : "our-companies",
        "path" : "our-companies.html"
    },{
        "id" : "cookies-policies",
        "path" : "cookies-policies.html"
    },{
        "id" : "error-404",
        "path" : "error-404.html"
    }
];

/*
 * EVENTS
 */
KG.Events = {

    RESIZE : "RESIZE",
    APP_LOADING : "APP_LOADING",

    SHOW_HOME : "SHOW_HOME",
    SHOW_NEWS : "SHOW_NEWS",
    SHOW_ABOUT : "SHOW_ABOUT",
    SHOW_ABOUT_OUR_OFFER : "SHOW_ABOUT_OUR_OFFER",
    SHOW_ABOUT_CASE_STUDIES : "SHOW_ABOUT_CASE_STUDIES",
    SHOW_ABOUT_INSPIRATION : "SHOW_ABOUT_INSPIRATION",
    SHOW_ABOUT_PARTNERS : "SHOW_ABOUT_PARTNERS",
    SHOW_ABOUT_INSPIRATION_DETAIL : "SHOW_ABOUT_INSPIRATION_DETAIL",
    SHOW_ABOUT_UNICEF : "SHOW_ABOUT_UNICEF",
    SHOW_ABOUT_UNICEF_DETAIL : "SHOW_ABOUT_UNICEF_DETAIL",

    SHOW_OUR_COMPANIES : "SHOW_OUR_COMPANIES",
    SHOW_COMPANY_NEWS : "SHOW_COMPANY_NEWS",
    
    SHOW_CAREERS : "SHOW_CAREERS",
    SHOW_CAREERS_JOB_SEARCH : "SHOW_CAREERS_JOB_SEARCH",
    SHOW_CAREERS_JOB_DETAIL : "SHOW_CAREERS_JOB_DETAIL",
    SHOW_CAREERS_START_YOUR_CAREER : "SHOW_CAREERS_START_YOUR_CAREER",
    SHOW_CAREERS_GROW_YOUR_CAREER : "SHOW_CAREERS_GROW_YOUR_CAREER",
    SHOW_CAREERS_PEOPLE_STORIES : "SHOW_CAREERS_PEOPLE_STORIES",
    SHOW_CAREERS_CREATIVITY_INSPIRATION : "SHOW_CAREERS_CREATIVITY_INSPIRATION",
    SHOW_CAREERS_UNICEF : "SHOW_CAREERS_UNICEF",

    SHOW_CONTACT : "SHOW_CONTACT",
    SHOW_COOKIES_POLICIES : "SHOW_COOKIES_POLICIES",
    
    SHOW_404 : "SHOW_404",
    UPDATE_HOME : "UPDATE_HOME",
    JOB_VIZ_LOADED : "JOB_VIZ_LOADED",
    JOB_DATA_LOADED : "JOB_DATA_LOADED",
    JOB_DETAIL_LOADED : "JOB_DETAIL_LOADED",
    JOB_DETAIL_INIT : "JOB_DETAIL_INIT"
};

/*
 * DOM Ready
 */
$(window).ready(function(){

    if ( KG.Utils.isNexus7 ) {
        $("html").addClass("nexus-7");
    }

    if ( KG.Utils.isGalaxyTab ) {
        $("html").addClass("galaxy");
    }

    KG.AppRouter = new KG.Router();
	Backbone.history.start({ pushState : true, root : KG.Locations.Root });

});

$(window).resize(function(){
    KG.EventManager.trigger(KG.Events.RESIZE);
});


KG.Controller = function() {

	var
		eventHandlers = [],

		templatesLoaded = 0,

		currentView = null,

		loadingView = null,
		homeView = null,
		aboutView = null,
		
		ourOfferView = null,
		caseStudiesView = null,
		inspirationView = null,
		inspirationDetailView = null,
		partnersView = null,

		ourCompaniesView = null,
		companyNewsView = null,
		
		careersView = null,
		jobSearchView = null,
		jobDetailView = null,
		startCareerView = null,
		growCareerView = null,
		peopleStoriesView = null,
		creativityInspirationView = null,
		unicefView = null,

		contactView = null,

		cookiesPoliciesView = null,
		error404View = null,

		/*
		 * init
		 * @private
		 */
		init = function() {

			_initEventHandlers();
			_initNav();
		},

		/*
		 * init event handler
		 * @private
		 */
		_initEventHandlers = function() {

			_.each( KG.Events, function(customEvent) {
				eventHandlers[customEvent] = _show;
			});

			eventHandlers[KG.Events.RESIZE] = _resize;
			
			KG.EventManager.bind(eventHandlers);
		},
		
		/*
		 * init navigation links
		 * @private
		 */
		_initNav = function() {

			$("body").delegate('a[rel=nav], nav a:not(.external):not(.action), a[rel=internal]', "click", function(e){
				e.preventDefault();

				$("html, body").stop().animate({
					"scrollTop" : 0
				}, 500);
				
				$("#wrapper").removeClass('show-mobile-nav');

				var href = $(this).attr("href");

				if ( $("html").hasClass("lt-ie8") ) {

					var 
						urlSplit = href.split( window.location.host ),
						usingHTTP = urlSplit.length > 1;
						
					if ( usingHTTP ) {
						href = urlSplit[1];
						href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
					}
				}

				KG.AppRouter.navigate(href, true);
			});

			$("body").delegate('header .action', 'click', function(e){
				e.preventDefault();
				$("#wrapper").toggleClass('show-mobile-nav');
			});
		},
		
		/*
		 * display Page
		 * @private
		 */
		displayPage = function ( callbackEvent, hideFirst, slug ) {

			if ( _gaq && (!hideFirst || Backbone.history.fragment !== "" )  ) {
				_gaq.push(['_trackPageview', '/'+Backbone.history.fragment ]);
			}

			// If Home or News
			if ( currentView && currentView == homeView && 
				(
					callbackEvent == KG.Events.SHOW_HOME || 
					callbackEvent == KG.Events.SHOW_NEWS ) 
				) {

				KG.EventManager.trigger( callbackEvent, slug );

			} 
			// Any page to hide first
			else if ( currentView && hideFirst ) {
				
				currentView.hide( callbackEvent, function() {
					displayPage(callbackEvent, false, slug);
				});

			} 
			// Display normal page
			else {

				// Preload Templates
				if ( !templatesLoaded ) {

					KG.EventManager.trigger( KG.Events.APP_LOADING );
					
					_.each( KG.Templates, function( template ) {
						KG.TemplateManager.get( template.id, template.path, function() {
							templateLoaded(callbackEvent, slug);
						});
					} );

				} else {
					KG.DataManager.check( callbackEvent, slug );
				}
			}
		},

		/*
		 * template preload
		 * @private
		 */
		templateLoaded = function( callbackEvent, slug ) {

			templatesLoaded++;
			if ( templatesLoaded == KG.Templates.length ) 
				KG.DataManager.check( callbackEvent, slug );

		},

		/*
		 * show the page
		 * @private
		 */
		_show = function ( e, slug ) {

			var view;
			
			switch ( e.type ) {
				
				case KG.Events.APP_LOADING :
					if ( !loadingView ) loadingView = new KG.View.Loading();
					view = loadingView;
				break;
				
				case KG.Events.SHOW_HOME :
				case KG.Events.SHOW_NEWS :

					document.title = KG.Data.rawJSON.seo.home.page_title;

					if ( !homeView ) {
						homeView = new KG.View.Home({
							copy : KG.Data.Copy,
							countries : KG.Data.Countries,
							slug : slug
						});
					}
					
					KG.DataManager.getNews();
					homeView.updateState( e.type );
					view = homeView;

					break;

				case KG.Events.SHOW_ABOUT :

					document.title = KG.Data.rawJSON.seo.about.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;
					
					if ( !aboutView ) {
						aboutView = new KG.View.About({
							copy : KG.Data.Copy,
							about : KG.Data.About
						});
					}
					view = aboutView;

					break;

				case KG.Events.UPDATE_HOME :

					homeView.updateNews({
						articles : KG.Data.Articles
					});
					view = homeView;
				break;
				
				case KG.Events.SHOW_ABOUT_OUR_OFFER :
					
					document.title = KG.Data.rawJSON.seo.aboutouroffer.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !ourOfferView ) {
						ourOfferView = new KG.View.OurOffer({
							copy : KG.Data.Copy,
							offers : KG.Data.OurOffer,
							slug : slug
						});
					}
					view = ourOfferView;
				break;
				
				case KG.Events.SHOW_ABOUT_CASE_STUDIES :

					document.title = KG.Data.rawJSON.seo.aboutcasestudies.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !caseStudiesView ) caseStudiesView = new KG.View.CaseStudies({
						copy : KG.Data.Copy,
						caseStudies : KG.Data.CaseStudies
					});
					view = caseStudiesView;
				break;
				
				case KG.Events.SHOW_ABOUT_INSPIRATION :

					document.title = KG.Data.rawJSON.seo.aboutinspiration.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !inspirationView ) inspirationView = new KG.View.Inspiration({
						copy : KG.Data.Copy,
						inspirations : KG.Data.Inspiration
					});
					view = inspirationView;
				break;
				
				case KG.Events.SHOW_ABOUT_INSPIRATION_DETAIL :

					document.title = KG.Data.rawJSON.seo.aboutinspiration.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;
					
					var selectedInspiration = _.filter(KG.Data.Inspiration.models, function(a){
						return a.get("slug") == slug;
					});

					if ( !inspirationDetailView ) inspirationDetailView = new KG.View.InspirationDetail({
						copy : KG.Data.Copy,
						content : selectedInspiration[0]
					});
					else inspirationDetailView.updateContent(selectedInspiration[0]);

					view = inspirationDetailView;
				break;
				
				case KG.Events.SHOW_ABOUT_PARTNERS :

					document.title = KG.Data.rawJSON.seo.aboutpartners.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !partnersView ) partnersView = new KG.View.Partners({
						copy : KG.Data.Copy,
						partners : KG.Data.Partners
					});
					view = partnersView;
				break;
				
				case KG.Events.SHOW_OUR_COMPANIES :

					document.title = KG.Data.rawJSON.seo.ourcompanies.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !ourCompaniesView ) {
						ourCompaniesView = new KG.View.OurCompanies({
							copy : KG.Data.Copy,
							map : KG.Data.Map,
							slug : slug
						});
					}
					view = ourCompaniesView;
				break;
				
				case KG.Events.SHOW_COMPANY_NEWS :

					document.title = KG.Data.rawJSON.seo.companynews.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !companyNewsView ) companyNewsView = new KG.View.CompanyNews({
						copy : KG.Data.Copy,
						news : KG.Data.CompanyNews,
						slug : slug
					});
					view = companyNewsView;
				break;
				
				case KG.Events.SHOW_CAREERS :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !careersView ) careersView = new KG.View.Careers({
						copy : KG.Data.Copy,
						intro : KG.Data.Career.Intro
					});

					KG.DataManager.getJobViz();
					view = careersView;
				break;

				case KG.Events.SHOW_CAREERS_JOB_SEARCH :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !jobSearchView ) jobSearchView = new KG.View.JobSearch({
						copy : KG.Data.Copy
					});

					KG.DataManager.getJobs();
					view = jobSearchView;
				break;

				case KG.Events.SHOW_CAREERS_JOB_DETAIL :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !jobDetailView ) jobDetailView = new KG.View.JobDetail({
						copy : KG.Data.Copy
					});

					KG.DataManager.getJobDetail( slug );
					view = jobDetailView;
				break;

				case KG.Events.SHOW_CAREERS_START_YOUR_CAREER :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !startCareerView ) startCareerView = new KG.View.StartCareer({
						copy : KG.Data.Copy,
						people : KG.Data.Career.PeopleStart,
						content : KG.Data.Career.Start
					});

					KG.DataManager.getJobViz();
					view = startCareerView;
				break;

				case KG.Events.SHOW_CAREERS_GROW_YOUR_CAREER :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !growCareerView ) growCareerView = new KG.View.GrowCareer({
						copy : KG.Data.Copy,
						people : KG.Data.Career.PeopleGrow,
						content : KG.Data.Career.Grow
					});
					
					KG.DataManager.getJobViz();
					view = growCareerView;
				break;

				case KG.Events.SHOW_CAREERS_PEOPLE_STORIES :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !peopleStoriesView ) peopleStoriesView = new KG.View.PeopleStories({
						copy : KG.Data.Copy,
						people : KG.Data.Career.People,
						slug : slug
					});
					view = peopleStoriesView;
				break;

				case KG.Events.SHOW_CAREERS_CREATIVITY_INSPIRATION :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !creativityInspirationView ) creativityInspirationView = new KG.View.CreativityInspiration({
						copy : KG.Data.Copy,
						content : KG.Data.Career.Creativity
					});

					KG.DataManager.getJobViz();
					view = creativityInspirationView;
				break;

				case KG.Events.SHOW_CAREERS_UNICEF :

					document.title = KG.Data.rawJSON.seo.careers.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !unicefView ) unicefView = new KG.View.Unicef({
						copy : KG.Data.Copy,
						content : KG.Data.Career.Unicef
					});

					KG.DataManager.getJobViz();
					view = unicefView;
				break;
				
				case KG.Events.SHOW_CONTACT :

					document.title = KG.Data.rawJSON.seo.contact.page_title + " | " + KG.Data.rawJSON.seo.defaultTitle;

					if ( !contactView ) contactView = new KG.View.Contact({
						copy : KG.Data.Copy,
						contacts : KG.Data.Contact
					});
					view = contactView;
				break;

				case KG.Events.SHOW_COOKIES_POLICIES :

					document.title = KG.Data.rawJSON.seo.home.page_title;

					if ( !cookiesPoliciesView ) cookiesPoliciesView = new KG.View.CookiesPolicies({
						blocks : KG.Data.CookiesPolicies
					});
					view = cookiesPoliciesView;
				break;

				case KG.Events.SHOW_404 :

					// document.title = KG.Data.rawJSON.seo.error404.page_title;

					if ( !error404View ) error404View = new KG.View.Error404({
						copy : KG.Data.Copy
					});
					view = error404View;
				break;

			}
			
			if ( e.type != KG.Events.UPDATE_HOME && e.type != KG.Events.JOB_VIZ_LOADED && e.type != KG.Events.JOB_DATA_LOADED && e.type != KG.Events.JOB_DETAIL_LOADED && e.type != KG.Events.JOB_DETAIL_INIT ) {

				view.render();
				currentView = view;
			}
			// _checkFooter();

			if ( e.type != KG.Events.APP_LOADING ) {

				$("header").addClass( "intro" );

				// if ( $(window).width() <= KG.Data.Layout.Mobile ) {
					$("header").removeClass("delayed");
					$(".main-content")
						.removeClass("hidden")
						.removeClass("animated");
						/*
				} else {
					$(".social").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
						$("header").removeClass("delayed");
						$(".main-content").removeClass("hidden");
					});
					$(".main-content").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
						$(".main-content").removeClass("animated");
					});
				}*/
			}

		},

		_resize = function() {
			if ( currentView ) currentView.resize();
			// _checkFooter();
		};/*,
	
		// Use to be used to force footer at the bottom on tablet portrait
		_checkFooter = function() {
			if ( $(window).width() < KG.Data.Layout.Mobile ) {

				var h = $("header").height() + $(".main-content").height() + $(".mobile-footer").height();
				if ( h < $(window).height() - 60 ) {
					$(".mobile-footer").addClass("force-bottom");
				} else {
					$(".mobile-footer").removeClass("force-bottom");
				}
			}
		};*/

	init();
	return {
		displayPage : displayPage
	};

};


KG.DataManager = KG.DataManager || {

	currentEvent : null,
	currentSlug : null,

	jobVizLoaded : false,
	jobDataLoaded : false,

	dataLoaded : false,
	newsLoaded : false,
	newsFeedLoaded : 0,
	newsSorted : false,
	articles : [],

	check : function ( e, slug ) {

		var self = this;
		self.currentEvent = e;
		self.currentSlug = slug;

		switch ( self.currentEvent ) {
			
			case KG.Events.SHOW_HOME :
			case KG.Events.SHOW_NEWS :
			case KG.Events.SHOW_ABOUT :
			case KG.Events.SHOW_OUR_COMPANIES : 
			case KG.Events.SHOW_CONTACT :
			case KG.Events.SHOW_COMPANY_NEWS :
			case KG.Events.SHOW_COMPANY_NEWS :
			case KG.Events.SHOW_ABOUT_INSPIRATION :
			case KG.Events.SHOW_ABOUT_INSPIRATION_DETAIL :
			case KG.Events.SHOW_ABOUT_UNICEF :
			case KG.Events.SHOW_ABOUT_UNICEF_DETAIL :
			case KG.Events.SHOW_ABOUT_OUR_OFFER :
			case KG.Events.SHOW_ABOUT_CASE_STUDIES :
			case KG.Events.SHOW_ABOUT_PARTNERS :
			case KG.Events.SHOW_CAREERS :

			case KG.Events.SHOW_CAREERS_JOB_SEARCH :
			case KG.Events.SHOW_CAREERS_JOB_DETAIL :
			case KG.Events.SHOW_CAREERS_START_YOUR_CAREER :
			case KG.Events.SHOW_CAREERS_GROW_YOUR_CAREER :
			case KG.Events.SHOW_CAREERS_PEOPLE_STORIES :
			case KG.Events.SHOW_CAREERS_CREATIVITY_INSPIRATION :
			case KG.Events.SHOW_CAREERS_UNICEF :
			
			case KG.Events.SHOW_COOKIES_POLICIES :
			case KG.Events.SHOW_404 :
				if ( !self.dataLoaded ) {
					KG.EventManager.trigger( KG.Events.APP_LOADING );
					self.getData();
				} else {
					KG.EventManager.trigger( self.currentEvent, self.currentSlug );
				}

			break;

		}
	},

	getData : function () {

		var self = this;

		if ( KG.DEBUG ) {
			
			$.ajax({
				dataType: 'jsonp',
				url: KG.Locations.JSON,
				success: function ( data ) {
					self.handleData(self, data);
				},
				error : function() {
					console.log("ERROR");
				}
			});

		} else {
			
			$.get(KG.Locations.JSON, function( data ) {
				self.handleData(self, data);
			});
		}

	},

	handleData : function(self, data) {

		KG.Data.rawJSON = data;

		var copyCollection = new KG.Collection.CopyCollection(data.copy);
		KG.Data.Copy = copyCollection.at(0).attributes;

		KG.Data.About = new KG.Collection.AboutCollection( data.about );
		KG.Data.Countries = new KG.Collection.CountryCollection( data.countries );
		KG.Data.OurOffer = new KG.Collection.OfferCollection( data.ourOffer );
		KG.Data.CaseStudies = new KG.Collection.CaseStudyCollection( data.caseStudies );
		KG.Data.Inspiration = new KG.Collection.InspirationCollection( data.inspirations );
		KG.Data.Partners = new KG.Collection.PartnerCollection( data.partners );
		KG.Data.Map = new KG.Collection.MapCollection( data.ourCompanies );
		KG.Data.CompanyNews = new KG.Collection.CompanyNewsCollection( data.companyNews );
		
		KG.Data.Career = {};
		KG.Data.Career.Intro = new KG.Collection.CareerTemplateCollection( data.careers.intro );
		KG.Data.Career.People = new KG.Collection.CareerPeopleCollection( data.careers.people );
		KG.Data.Career.PeopleStart = new KG.Collection.CareerPeopleCollection( data.careers.people );
		KG.Data.Career.PeopleGrow = new KG.Collection.CareerPeopleCollection( data.careers.people );
		KG.Data.Career.Start = new KG.Collection.CareerTemplateCollection( data.careers.start );
		KG.Data.Career.Grow = new KG.Collection.CareerTemplateCollection( data.careers.grow );
		KG.Data.Career.Unicef = new KG.Collection.CareerTemplateCollection( data.careers.unicef );
		KG.Data.Career.Creativity = new KG.Collection.CareerTemplateCollection( data.careers.creativity );

		KG.Data.Contact = new KG.Collection.ContactCollection( data.contact );
		KG.Data.CookiesPolicies = new KG.Collection.CookiesPoliciesCollection( data.cookiesPolicies );
		
		self.dataLoaded = true;
		self.check( self.currentEvent, self.currentSlug );
	},

	getJobViz : function() {

		if ( !this.jobVizLoaded ) {
			this.getJobVizData();
		} else {
			KG.EventManager.trigger( KG.Events.JOB_VIZ_LOADED );
		}
	},

	getJobVizData : function() {
		
		var self = this;
		$.ajax({
			dataType: 'jsonp',
			url: KG.Locations.JobViz,
			success: function ( data ) {
				
				KG.Data.JobViz = data;
				KG.Data.JobsTotal = 0;
				KG.Data.JobsGraduateTotal = 0;
				KG.Data.JobsNonGraduateTotal = 0;

				_.each( KG.Data.JobViz.tabs[3].elements, function(el) {

					KG.Data.JobsTotal += parseInt(el.count, 10);

					if ( el.name == KG.Data.LabelGraduate || el.name == KG.Data.LabelExperienced ) KG.Data.JobsGraduateTotal += parseInt(el.count, 10);
					else KG.Data.JobsNonGraduateTotal += parseInt(el.count, 10);
				});
				self.jobVizLoaded = true;

				KG.EventManager.trigger( KG.Events.JOB_VIZ_LOADED );
			}
		});

	},

	getJobs : function() {

		if ( !this.jobDataLoaded ) {
			this.getJobsData();
		} else {
			KG.EventManager.trigger( KG.Events.JOB_DATA_LOADED );
		}
	},

	getJobsData : function() {

		var self = this;
		$.ajax({
			dataType: 'jsonp',
			url: KG.Locations.JobData,
			success: function ( data ) {
				
				KG.Data.Jobs = data;
				self.jobDataLoaded = true;

				KG.EventManager.trigger( KG.Events.JOB_DATA_LOADED );
			}
		});
	},

	getJobDetail : function( job_id ) {

		KG.EventManager.trigger( KG.Events.JOB_DETAIL_INIT );
		if ( KG.Data.currentJobID != job_id ) {
			this.getJobDetailData( job_id );
		} else {
			KG.EventManager.trigger( KG.Events.JOB_DETAIL_LOADED );
		}
	},

	getJobDetailData : function ( job_id ) {

		if ( KG.Utils.isIE ) {

			$.ajax({
				dataType: 'json',
				url: KG.Locations.JSON_JOB,
				data : {
					"id" : job_id
				},
				success: function ( data ) {

					// var d = JSON.parse(data);

					KG.Data.currentJobID = job_id;
					KG.Data.currentJob = data;
					KG.EventManager.trigger( KG.Events.JOB_DETAIL_LOADED );
					
				}, error : function ( e, a ) {

					console.log( JSON.stringify(a) );
				}
			});	

		} else {

			$.ajax({
				dataType: 'jsonp',
				url: KG.Locations.JSON_JOB,
				data : { 
					"id" : job_id
				},
				success: function ( data ) {

					KG.Data.currentJobID = job_id;
					KG.Data.currentJob = data;
					KG.EventManager.trigger( KG.Events.JOB_DETAIL_LOADED );
				}, error : function ( e , a ) {

					console.log( JSON.stringify(a) );
				}
			});	
		}
	},

	getNews : function () {

		if ( !this.newsLoaded ) {
			
			this.getArticles();

		} else if ( !this.newsSorted ) {

			this._sortArticles();
			KG.Data.Articles = new KG.Collection.ArticleCollection( this._processArticles(this.articles, KG.Data.Countries) );
			KG.EventManager.trigger( KG.Events.UPDATE_HOME );
			this.newsSorted = true;
		}
	},

	checkNewsLoaded : function() {

		if ( this.newsFeedLoaded >= KG.Data.Countries.length ) {
			this.newsLoaded = true;
			this.getNews();
		}
	},

	getArticles : function( ) {

		var self = this;

		KG.Data.Countries.each( function( country ) {
			
			$.ajax({
				dataType: 'jsonp',
				url: country.get("jsonp"),
				success: function ( data ) {
					self._addArticles( data, country.get("id") );
					self.newsFeedLoaded++;
					self.checkNewsLoaded();
				}
			});
		});
	},

	_addArticles : function ( data, countryID ) {

		var self = this;
		_.each( data, function ( rawArticle ) {
			
			// rawArticle.title = self._limitString(rawArticle.Strapline, 80);
			rawArticle.title = rawArticle.Headline;
			// rawArticle.title = rawArticle.Strapline;
			rawArticle.link = rawArticle.ArticleUrl;
			rawArticle.img = rawArticle.StoryImageUrl;

			var arr = (rawArticle.ArticleDate).split(/[- :T]/);
			rawArticle.dateObject = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
			
			rawArticle.date = rawArticle.dateObject.getDate() + " " + KG.Data.Copy.months[rawArticle.dateObject.getMonth()];
			rawArticle.timestamp = rawArticle.Timestamp;
			rawArticle.country = countryID;

			self.articles.push(rawArticle);
		});
	},
	/*
	_limitString : function(text, n) {

		var shortText = text.substr(0, n);
		if (/^\S/.test(text.substr(n)))
			return shortText.replace(/\s+\S*$/, "") + "...";

		return shortText;
	},
	*/

	_sortArticles : function() {

		this.articles.sort(function(a,b){
			if (a.timestamp > b.timestamp) return -1;
			if (a.timestamp < b.timestamp) return 1;
			return 0;
		});		
	},

	_processArticles : function ( articles, countries ) {

		_.each( articles, function( article, index ) {

			article.id = index;

			var 
				country = countries.get( article.country ),
				countrySlug = country.get("slug");

			article.countrySlug = countrySlug;
		} );

		return articles;
	}
};

// From http://jsondata.tumblr.com/post/30043887057/backbone-5

KG.TemplateManager = KG.TemplateManager || {

    templates : {},
    get : function (id, path, callback) {

        if (this.templates[id]) {
            return callback(this.templates[id]);
        }

        var 
            url = KG.Locations.Templates + path,
            promise = $.trafficCop(url),
            that = this;

        promise.done(function (template) {
            
            var tmp = _.template(template);
            that.templates[id] = tmp;
            callback(tmp);
        });
    }
};

KG.Router = Backbone.Router.extend({

	/*
	 * controller
	 * @private
	 */
	controller : null,

	/*
	 * initialize
	 * @private
	 */
	initialize : function() {

		this.controller = new KG.Controller();
	},

	/*
	 * routes
	 */
	routes : {

		"who-we-are/in-brief" : "_redirectionAction",
		"who-we-are/in-detail" : "_redirectionAction",
		"who-we-are/contact-us" : "_redirectionAction",
		"who-we-are/join-us" : "_redirectionAction",

		"what-we-do/watch" : "_redirectionAction",
		"what-we-do/read" : "_redirectionAction",

		"whats-new/latest" : "_redirectionAction",
		"whats-new/whats-inspiring-us" : "_redirectionAction",

		"public" : "_externalLinkAction",


		// "news(/)" : "_newsAction",
		"news/:country(/)" : "_newsAction",

		"about(/)" : "_aboutAction",
		"about/offers(/)" : "_ourOfferAction",
		"about/offers/:offer(/)" : "_ourOfferAction",

		"about/case-studies(/)" : "_caseStudiesAction",

		"about/inspiration(/)" : "_inspirationAction",
		"about/inspiration/:project(/)" : "_inspirationAction",

		"about/partners(/)" : "_partnersAction",

		"brands(/)" : "_ourCompaniesAction",
		"brands/:company(/)" : "_ourCompaniesAction",

		"company-news(/)" : "_companyNewsAction",
		"company-news/:article(/)" : "_companyNewsAction",

		"careers(/)" : "_careersAction",
		"careers/job-search(?*querystring)" : "_jobSearchAction",
		"careers/jobs/:slug(/)" : "_jobDetailAction",

		"careers/start-your-career(/)" : "_startCareerAction",
		"careers/grow-your-career(/)" : "_growCareerAction",

		"careers/people-stories(/)" : "_peopleStoriesAction",
		"careers/people-stories/:slug(/)" : "_peopleStoriesAction",

		"careers/creativity-inspiration(/)" : "_creativityInspirationAction",
		"careers/unicef(/)" : "_unicefAction",

		"contact(/)" : "_contactAction",

		"cookies-policies(/)" : "_cookiesPoliciesAction",

		"404" : "_errorAction",

		"*actions" : "_defaultAction"
	},

	/*
	 * redirect old website
	 * @private
	 */
	_redirectionAction : function() {


		var href = "";
		switch ( Backbone.history.fragment ) {
			case "who-we-are/in-brief" :
				href = "about";
			break;
			case "who-we-are/in-detail" :
				href = "brands";
			break;
			case "who-we-are/contact-us" :
				href = "contact";
			break;
			case "who-we-are/join-us" :
				href = "careers";
			break;
			case "what-we-do/watch" :
			case "what-we-do/read" :
				href = "about/case-studies";
			break;
			case "whats-new/latest" :
				href = "company-news";
			break;
			case "whats-new/whats-inspiring-us" :
				href = "about/inspiration";
			break;
		}

		KG.AppRouter.navigate(href, true);
	},

	_externalLinkAction : function () {
		var href = "";
		switch ( Backbone.history.fragment ) {
			case "public" :
				href = "http://www.kantar.com/public";
			break;
		}

		window.open(href, "_blank");
	},

	/*
	 * news page
	 * @private
	 */
	_newsAction : function ( slug ) {
		this.controller.displayPage( KG.Events.SHOW_NEWS, true, slug );
	},

	/*
	 * about page
	 * @private
	 */
	_aboutAction : function() {
		this.controller.displayPage( KG.Events.SHOW_ABOUT, true );
	},

	/*
	 * about/our-offer page
	 * @private
	 */
	_ourOfferAction : function ( slug ) {
		this.controller.displayPage( KG.Events.SHOW_ABOUT_OUR_OFFER, true, slug );
	},

	/*
	 * about/case-studies page
	 * @private
	 */
	_caseStudiesAction : function() {
		this.controller.displayPage( KG.Events.SHOW_ABOUT_CASE_STUDIES, true );
	},

	/*
	 * about/inspiration page
	 * @private
	 */
	_inspirationAction : function(slug) {

		if ( slug )
			this.controller.displayPage( KG.Events.SHOW_ABOUT_INSPIRATION_DETAIL, true, slug );
		else
			this.controller.displayPage( KG.Events.SHOW_ABOUT_INSPIRATION, true );
	},

	/*
	 * about/partners page
	 * @private
	 */
	_partnersAction : function() {
		this.controller.displayPage( KG.Events.SHOW_ABOUT_PARTNERS, true );
	},

	/*
	 * about/our-companies page
	 * @private
	 */
	_ourCompaniesAction : function( slug ) {
		this.controller.displayPage( KG.Events.SHOW_OUR_COMPANIES, true, slug );
	},

	/*
	 * company-news page
	 * @private
	 */
	_companyNewsAction : function( slug ) {
		this.controller.displayPage( KG.Events.SHOW_COMPANY_NEWS, true, slug );
	},

	/*
	 * careers page
	 * @private
	 */
	_careersAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS, true );
	},

	/*
	 * job search page
	 * @private
	 */
	_jobSearchAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_JOB_SEARCH, true );
	},

	/*
	 * job detail page
	 * @private
	 */
	_jobDetailAction : function( slug ) {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_JOB_DETAIL, true, slug );
	},

	/*
	 * start your careers page
	 * @private
	 */
	_startCareerAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_START_YOUR_CAREER, true );
	},

	/*
	 * grow your careers page
	 * @private
	 */
	_growCareerAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_GROW_YOUR_CAREER, true );
	},

	/*
	 * people stories page
	 * @private
	 */
	_peopleStoriesAction : function( slug ) {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_PEOPLE_STORIES, true, slug );
	},

	/*
	 * creativity inspiration page
	 * @private
	 */
	_creativityInspirationAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_CREATIVITY_INSPIRATION, true );
	},

	/*
	 * unicef page
	 * @private
	 */
	_unicefAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CAREERS_UNICEF, true );
	},

	/*
	 * contact page
	 * @private
	 */
	_contactAction : function() {
		this.controller.displayPage( KG.Events.SHOW_CONTACT, true );
	},

	/*
	 * cookies policies page
	 * @private
	 */
	_cookiesPoliciesAction : function() {
		this.controller.displayPage( KG.Events.SHOW_COOKIES_POLICIES, true );
	},

	/*
	 * error 404 page
	 * @private
	 */
	_errorAction : function() {
		this.controller.displayPage( KG.Events.SHOW_404, true );
	},

	/*
	 * defaultAction
	 * @private
	 */
	_defaultAction : function () {
		this.controller.displayPage( KG.Events.SHOW_HOME, true );
	}

});


KG.Data.Layout = KG.Data.Layout || {};

KG.Data.Layout.MenuWidth = 240;

KG.Data.Layout.SmallMobile = 480;
KG.Data.Layout.Mobile = 706;
KG.Data.Layout.IpadPortrait = 768;
KG.Data.Layout.SmallerDesktop = 960;
KG.Data.Layout.SmallDesktop = 1024;
KG.Data.Layout.BigDesktop = 1280;
KG.Data.Layout.BigMidDesktop = 1366;
KG.Data.Layout.BiggerDesktop = 1440;
KG.Data.Layout.BiggerMidDesktop = 1680;


KG.Model.About = Backbone.Model.extend({
	
	defaults: {
		title : "",
		text : "",
		images : []
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.title = data.title;
		this.text = data.text;
		this.images = data.images;

		return this;
	}
	
});

KG.Model.Article = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		date : "",
		timestamp : "",
		country : 0,
		excerpt : "",
		text : "",
		slug : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.country = data.country;
		this.date = data.date;
		this.timestamp = data.timestamp;
		this.excerpt = data.excerpt;
		this.text = data.text;
		this.slug = data.slug;

		return this;
	}
	
});

KG.Model.Careers = Backbone.Model.extend({
	
	defaults: {
		title : "",
		titleLink : "",
		text : "",
		linkText : "",
		link : "",
		images : []
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.title = data.title;
		this.titleLink = data.titleLink;
		this.text = data.text;
		this.linkText = data.linkText;
		this.link = data.link;
		this.images = data.images;

		return this;
	}
	
});

KG.Model.CompanyNews = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		date : "",
		excerpt : "",
		text : "",
		slug : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.id = data.id;
		this.title = data.title;
		this.date = data.date;
		this.excerpt = data.excerpt;
		this.text = data.text;
		this.slug = data.slug;

		return this;
	}
	
});

KG.Model.Contact = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		image : "",
		address : [],
		tel : "",
		fax : "",
		email : "",
		map : "",
		contacts : {}
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.id = data.id;
		this.title = data.title;
		this.image = data.image;
		this.address = data.address;
		this.tel = data.tel;
		this.fax = data.fax;
		this.email = data.email;
		this.map = data.map;
		this.contacts = data.contacts;

		return this;
	}
	
});

KG.Model.CookiesPolicies = Backbone.Model.extend({
	
	defaults: {
		title : "",
		text : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.title = data.title;
		this.text = data.text;

		return this;
	}
	
});

KG.Model.Copy = Backbone.Model.extend({
	
	defaults: {
		copy : null
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.copy = data.copy;
		return this;
	}
	
});

KG.Model.CaseStudy = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		poster : "",
		title : "",
		text : "",
		link : "",
		vimeoID : "",
		vimeoColour : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.poster = data.poster;
		this.title = data.title;
		this.text = data.text;
		this.link = data.link;
		this.vimeoID = data.vimeoID;
		this.vimeoColour = data.vimeoColour;

		return this;
	}
	
});

KG.Model.Inspiration = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		blockquote : "",
		thumbnail : "",
		images : [],
		date : "",
		linkText : "",
		link : "",
		excerpt : "",
		text : "",
		slug : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.blockquote = data.blockquote;
		this.thumbnail = data.thumbnail;
		this.images = data.images;
		this.date = data.date;
		this.linkText = data.linkText;
		this.link = data.link;
		this.excerpt = data.excerpt;
		this.text = data.text;
		this.slug = data.slug;

		return this;
	}
	
});

KG.Model.Offer = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		thumbnail : "",
		image : "",
		title : "",
		subtitle : "",
		text : "",
		slug : "",
		vimeoID : "",
		vimeoColour : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.thumbnail = data.thumbnail;
		this.image = data.image;
		this.title = data.title;
		this.subtitle = data.subtitle;
		this.text = data.text;
		this.slug = data.slug;
		this.vimeoID = data.vimeoID;
		this.vimeoColour = data.vimeoColour;

		return this;
	}
	
});

KG.Model.Partner = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		text : "",
		image : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.text = data.text;
		this.image = data.image;

		return this;
	}
	
});

KG.Model.Challenge = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		introText : "",
		text : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.introText = data.introText;
		this.text = data.text;

		return this;
	}
	
});

KG.Model.Project = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		template : null,
		country : "",
		title : "",
		excerpt : "",
		text : "",
		slug : "",
		links : {},

		thumbnail : null,
		featuredImage : null,
		images : []
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.template = data.template;
		this.country = data.country;
		this.title = data.title;
		this.excerpt = data.excerpt;
		this.text = data.text;
		this.slug = data.slug;

		this.links = data.links;

		this.thumbnail = data.thumbnail;
		this.featuredImage = data.featuredImage;
		this.images = data.images;

		return this;
	}
	
});

KG.Model.Unicef = Backbone.Model.extend({
	
	defaults: {
		title : "",
		text : "",
		challenges : {},
		projects : {}
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.title = data.title;
		this.text = data.text;

		this.challenges = new KG.Collection.ChallengeCollection( data.challenges );
		this.projects = new KG.Collection.ProjectCollection( data.projects );

		return this;
	}
	
});

KG.Model.CareerPeople = Backbone.Model.extend({
	
	defaults: {
		
	},
	
	initialize: function(){

	},

	parse : function(){
		
	}
	
});

KG.Model.CareerTemplate = Backbone.Model.extend({
	
	defaults: {
		
	},
	
	initialize: function(){

	},

	parse : function(){
		
	}
	
});

KG.Model.Category = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		image : "",
		link : "",
		slug : ""
	},
	
	initialize: function(){

	},

	parse : function(data){

		this.id = data.id;
		this.title = data.title;
		this.image = data.image;
		this.link = data.link;
		this.slug = data.slug;

		return this;
	}
	
});

KG.Model.Map = Backbone.Model.extend({
	
	defaults: {
		title : "",
		text : "",
		blocks : {},
		categories : null,
		offices : null
	},
	
	initialize: function(data){
		
		this.parse(data);
	},

	parse : function(data){

		this.title = data.title;
		this.text = data.text;
		this.blocks = data.blocks;

		this.categories = new KG.Collection.CategoryCollection( data.categories );
		this.offices = new KG.Collection.OfficeCollection( data.offices );
		
		return this;
	}
	
});

KG.Model.Office = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : "",
		position : {}
	},
	
	initialize: function(){

	},

	parse : function(data){
		this.id = data.id;
		this.title = data.title;
		this.slug = data.slug;
		this.position = data.position;

		return this;
	}
	
});

KG.Model.Country = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		name : "",
		slug : "",
		mainColor : "",
		secondColor : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.name = data.name;
		this.slug = data.slug;
		this.mainColor = data.mainColor;
		this.secondColor = data.secondColor;
		
		return this;
	}
	
});

KG.Collection.AboutCollection = Backbone.Collection.extend({
	model : KG.Model.About
});

KG.Collection.CareersCollection = Backbone.Collection.extend({
	model : KG.Model.Careers
});

KG.Collection.CompanyNewsCollection = Backbone.Collection.extend({
	model : KG.Model.CompanyNews
});

KG.Collection.ContactCollection = Backbone.Collection.extend({
	model : KG.Model.Contact
});

KG.Collection.CookiesPoliciesCollection = Backbone.Collection.extend({
	model : KG.Model.CookiesPolicies
});

KG.Collection.CopyCollection = Backbone.Collection.extend({
	model : KG.Model.Copy
});

KG.Collection.CaseStudyCollection = Backbone.Collection.extend({
	model : KG.Model.CaseStudy
});

KG.Collection.InspirationCollection = Backbone.Collection.extend({
	model : KG.Model.Inspiration
});

KG.Collection.OfferCollection = Backbone.Collection.extend({
	model : KG.Model.Offer
});

KG.Collection.PartnerCollection = Backbone.Collection.extend({
	model : KG.Model.Partner
});

KG.Collection.ChallengeCollection = Backbone.Collection.extend({
	model : KG.Model.Challenge
});

KG.Collection.ProjectCollection = Backbone.Collection.extend({
	model : KG.Model.Project
});

KG.Collection.UnicefCollection = Backbone.Collection.extend({
	model : KG.Model.Unicef
});

KG.Collection.CareerPeopleCollection = Backbone.Collection.extend({
	model : KG.Model.CareerPeople
});

KG.Collection.CareerTemplateCollection = Backbone.Collection.extend({
	model : KG.Model.CareerTemplate
});

KG.Collection.CategoryCollection = Backbone.Collection.extend({
	model : KG.Model.Category
});

KG.Collection.MapCollection = Backbone.Collection.extend({
	model : KG.Model.Map
});

KG.Collection.OfficeCollection = Backbone.Collection.extend({
	model : KG.Model.Office
});

KG.Collection.ArticleCollection = Backbone.Collection.extend({
	model : KG.Model.Article
});

KG.Collection.CountryCollection = Backbone.Collection.extend({
	model : KG.Model.Country,

	getById : function(id) {
		console.log(id);
	}
});

KG.View.Base = Backbone.View.extend({

	id : "",
	path : "",
	el : ".main-content",
	tpl : null,
	collection : null,
	slug : null,
	params : {},

	hide : function ( callbackEvent, callback ) {

		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},
	
	render : function() {

		this.params.models = this.collection ? this.collection.models : null;
		this.params.baseURL = KG.Locations.Images;
		this.params.retinaPrefix = KG.Utils.isRetina ? "" : "tmb_";
		this.params.retinaSuffix = KG.Utils.isRetina ? "" : ".jpg";

		var self = this;
		KG.TemplateManager.get( self.id, self.path, function(tpl) {
			self.tpl = tpl;
			self._display();
		});
	},
	
	_display : function() {

		var self = this;

		self.slug = self.params.slug;

		self.prevId = $("body").attr("class");
		
		$("body").removeClass(self.prevId).addClass(self.id);
		// $("body").attr("class", "").addClass(self.id);
		self._selectNav();

		$(this.el).html( this.tpl(this.params) ).fadeIn(KG.Data.FADE_IN_DURATION, function() {
			self._displayComplete(self);
		});
	},

	_selectNav : function() {
		
		var $container = $(".main-nav");
		$container.find("li.selected").removeClass("selected");
		$container.find("li.open").removeClass("open");
		$container.find("li a[data-page='" + $("body").attr("class") + "']").parent().addClass("selected");
	},

	_displayComplete : function (parent) {
		// TODO Overwrite
		if ( true === false && console ) console.log(parent);
	},

	resize : function () {
		
	}
});


KG.View.About = KG.View.Base.extend({

	id : "about",
	path : "about.html",
	
	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.about = data.about.models;
	}
	
});

KG.View.BaseChild = KG.View.Base.extend({

	_selectNav : function() {
		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='" + $("body").attr("class") + "']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	}
	
});

KG.View.Careers = KG.View.Base.extend({

	id : "careers",
	path : "careers.html",
	interval : null,

	imagesLoaded :  false,
	dataLoaded : false,

	events : {
		"click .link-internal" : "internalLink"
	},

	initialize : function(data) {

		this.params.copy = data.copy;
		this.params.intro = data.intro.models[0];

		KG.EventManager.bind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
	},

	onVizLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
		this.dataLoaded = true;
		this.vizReady();
	},

	hide : function ( callbackEvent, callback ) {
		
		KJV.destroy();
		clearInterval(this.interval);
		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	_displayComplete : function () {

		// Preload images of check sizes
		var 
			self = this,
			loadIndex = 0;
		this.imgsToLoad = $(".careers .template-3 img");
		this.imgsToLoad.each( function(i, img) {

			var 
				$img = $(img),
				image = new Image();

			image.onload = function() {

				loadIndex++;
				if ( loadIndex >= self.imgsToLoad.length ) {
					$(".template-3 .vhidden").removeClass("vhidden");
					self.resize();

					self.imagesLoaded = true;
					self.vizReady();
				}
			};
			
			image.src = $img.attr("src");
			image.alt = i;
		});
	},

	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	},

	vizReady : function() {

		if ( this.imagesLoaded && this.dataLoaded ) {
			KJV.setup();
			$(".btn-big .number").text( KG.Data.JobsTotal );
		}
	},
	
	resize : function( ) {
		
		var 
			wwidth = $(window).width(),
			refWidth = $(".span-1 .span-content").width(),
			$span = $(".span-2 .span-content"),
			$vizHeader = $(".viz-header", $span).height(),
			$viz = $("#viz-content", $span),
			x = (refWidth * 2) + 20;

		if ( wwidth > 1024 ) {

			$span.css("height", x );
			$viz.css("height", x-$vizHeader );

			KJV.resize( x, x-$vizHeader );

		} else if ( wwidth > 480 ) {

			$span.css("height", x+$vizHeader );
			$viz.css("height", x );

			KJV.resize( x, x );

		} else {

			$span.css("height", 500 );
			$viz.css("height", 500-$vizHeader );

			KJV.resize( (wwidth < 467 ? refWidth : (refWidth * 2 + 20) ), 500-$vizHeader );
		}
	}

	
});

KG.View.CompanyNews = KG.View.Base.extend({

	id : "company-news",
	path : "company-news.html",

	initialize : function(data) {
		this.params.news = data.news.models;
		this.params.copy = data.copy;
		this.params.slug = data.slug;
	},
	
	_display : function() {

		var self = this;

		self.slug = self.params.slug;

		$("body").attr("class", "").addClass(self.id);
		self._selectNav();

		$(this.el).html( this.tpl(this.params) ).fadeIn(0, function(){
			self._displayComplete();
		});
	},

	_displayComplete : function () {

		this.resize();
		$(".block-news").addClass("animated");

		var selected = $(".block-news.selected");
		if ( selected.length > 0 ) {
			$("html, body").animate( {
				"scrollTop" : selected.offset().top - 20
			}, 300 );
		}

		this.initBlockNews();
		this.initSocialLinks();
	},

	initBlockNews : function() {

		var self = this;
		$(".block-news").click(function(){

			if ( !$(this).hasClass("selected") ) {
				var blockSelected = $(".block-news.selected");
				blockSelected.removeClass("selected");
				self.sizeBlock(blockSelected);
			}

			$(this).addClass("selected");
			self.sizeBlock(this);

			var $block = $(this);
			setTimeout(function() {
				$('html,body').animate({
					scrollTop: $block.position().top
				}, 300);
			}, 300);

			if ( $(this).hasClass("selected") ) KG.AppRouter.navigate( "/company-news/" + $(this).attr("id"), false );
			else KG.AppRouter.navigate( "/company-news", false );
		});
	},

	sizeBlock : function (block) {
		
		var 
			newHeight = $(block).hasClass("selected") ? 
			($(".news-text", block).height() + 60) : 
			(Math.max( $(".news-title", block).height(), $(".news-excerpt", block).height() + 60 )),
			innerWidth = window.innerWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : document.documentElement.clientWidth,
			extraOffset = KG.Utils.isIE ? 17 : 0;

		if ( $(window).width() <= KG.Data.Layout.Mobile ) {
			
			newHeight = $(".news-title", block).height() + $(".news-date", block).height();
			if ( $(block).hasClass("selected") ) {
				newHeight += $(".news-text", block).height() + 60;
			}

		} else if ( $(window).width() <= KG.Data.Layout.SmallDesktop - 10 ) {
			newHeight += $(".news-title", block).height() - ( $(block).hasClass("selected") ? 0 : 30 );
		} else if ( $(window).width() > KG.Data.Layout.BiggerDesktop - ( innerWidth - $(window).width()) - extraOffset ) {
			newHeight = ($(".news-text", block).height() + 60);
		}

		$(block).css("height", newHeight);
	},

	initSocialLinks : function() {

		$(".social-links a").click(function(e){

			e.preventDefault();
			e.stopPropagation();

			var 
				url = "",
				msg = "",
				$el = $(this);

			switch ($el.data('network')) {

				case "mail" :

					var 
						mailTitle = $el.data('title'),
						mailCopy = $el.data('copy');

					url = 'mailto:?subject=' + mailTitle + '&body=' + mailCopy + " - " + encodeURIComponent(window.location.href);
					window.open(url, 'mailShare');
					break;

				case "facebook" :
					url = 'https://facebook.com/sharer.php?u=' + encodeURIComponent(window.location.href);
					window.open(url, 'facebookShare', "width=800,height=600,toolbar=no");
					break;

				case "twitter" :
					msg = "twitter message";
					url = 'http://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + msg;
					window.open(url, 'twitterShare', "width=550,height=450,toolbar=no");
					break;

				case "google-plus" :
					url = 'https://plus.google.com/share?url=' + encodeURIComponent(window.location.href) + '&hl=en-GB';
					window.open(url, 'gPlusShare', "width=550,height=450,toolbar=no");
					break;

				case "linkedin" :
					url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href);
					window.open( url, 'linkedinShare', "width=600,height=450,toolbar=no");
					break;
			}
		});
	},

	resize : function () {
		
		var self = this;
		$(".block-news").each(function(i, el){
			self.sizeBlock($(el));
		});
	}
});


KG.View.Contact = KG.View.Base.extend({

	id : "contact",
	path : "contact.html",
	
	initialize : function(data) {
		this.params.contacts = data.contacts.models;
		this.params.copy = data.copy;
	},

	_displayComplete : function() {
		this.resize();
	},

	resize : function() {
		this.getLineLength();
		this.setClearSpots();
	},

	getLineLength : function() {

		var 
			defaultWWidth = $(window).width(),
			innerWidth = window.innerWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : document.documentElement.clientWidth,
			wWidth = defaultWWidth - ( innerWidth - defaultWWidth),
			scrollDiff = window.outerWidth ? window.outerWidth - defaultWWidth : 0;

		if ( wWidth < KG.Data.Layout.SmallMobile - scrollDiff ) {
			this.lineLength = 1;
		} else if ( wWidth <= 950 - scrollDiff ) {
			this.lineLength = 2;
		} else if ( wWidth <= 1200 - scrollDiff ) {
			this.lineLength = 3;
		} else if ( wWidth < KG.Data.Layout.BiggerMidDesktop - scrollDiff ) {
			this.lineLength = 4;
		} else {
			this.lineLength = 5;
		}
	},

	setClearSpots : function() {

		var self = this;

		$(".empty-span").remove();
		$(".main-content .grid .span-1").each(function(i, el){
			$(el).removeClass( "clear" ).addClass( (i % self.lineLength === 0 ? "clear" : "") );

			if ( $("html").hasClass("lt-ie8") && (i % self.lineLength === 0) ) {
				var emptySpan = $('<span class="empty-span" style="display:block;clear:both;height:1px;margin-top:-1px;" />');
				emptySpan.insertBefore( el );
			}
		});
	}
	
});

KG.View.CookiesPolicies = KG.View.Base.extend({

	id : "cookies-policies",
	path : "cookies-policies.html",
	
	initialize : function(data) {
		this.params.blocks = data.blocks;
	}
	
});

KG.View.Error404 = KG.View.Base.extend({

	id : "error-404",
	path : "error-404.html",
	
	initialize : function(data) {
		this.params.copy = data.copy;
	}
	
});

KG.View.Home = KG.View.Base.extend({

	id : "home",
	path : "home.html",
	countrySlug : undefined,
	resizeTimer : null,
	articles : null,

	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.countries = data.countries.models;
	},
	
	_display : function() {

		var self = this;
		self.slug = self.params.slug;
		self.prevId = $("body").attr("class");

		$("body").removeClass(self.prevId).addClass(self.id);
		self._selectNav();

		if ( self.prevId == "home" || self.prevId == "news" ) {
			$(this.el).show(0);
		} else {

			$(this.el)
				.html( this.tpl(this.params) )
				.fadeIn(KG.Data.FADE_IN_DURATION, function() {
					self._displayComplete(self);
				});
		}

		self.filter( Backbone.history.fragment.split("/")[1] );
	},

	_displayComplete : function() {

		if ( this.newsReady ) {
			this._initNews( this.articles );
		}
		this._initFilters();
	},

	updateState : function(eventType) {

		switch ( eventType ) {
			
			case KG.Events.SHOW_NEWS :
				this.displayID = "news";
				break;

			case KG.Events.SHOW_HOME :
				this.displayID = "home";
				break;

			default :
				this.displayID = "home";
				break;
		}
	},

	updateNews : function(data) {

		var self = this;
		self.newsReady = true;

		if ( KG.ClientIP !== "::1" && KG.ClientIP !== "127.0.0.1" ) {
			/*$.getJSON("http://freegeoip.net/json/"+KG.ClientIP , function(countryData){
				
				KG.Utils.countryCode = countryData.country_code;
				self._initNews( data.articles.models );

			}).error( function() {
			*/
			
			KG.Utils.countryCode = "GB";  //default in case of timeout
			
			$.ajax({
				dataType: 'json',
				timeout:5000,
				// url: "http://www.telize.com/geoip/"+KG.ClientIP,
				url: "https://freegeoip.net/json/"+KG.ClientIP,
				success: function ( countryData ) {
					KG.Utils.countryCode = countryData.country_code;
					self._initNews( data.articles.models );
				},
				error : function() {
					KG.Utils.countryCode = "GB";
					self._initNews( data.articles.models );
				}
			});

			// } );

		} else {
			self._initNews( data.articles.models );
		}
	},

	_initFilters : function () {

		var self = this;

		$('.no-filter .country-link').on('click', function(e){
			e.preventDefault();

			if ( $(".filter-list").hasClass('open') ) {
				$(".filter-list").removeClass('open');
				KG.AppRouter.navigate("/", true);
			} else {
				$(".filter-list").addClass('open');
			}
			
		});

		$('.filter-country .country-link, .selected-filter .unselect').on('click', function(e){
			e.preventDefault();

			$(".filter-list").removeClass('open');

			var togo = $(this).attr('href');

			if ( '/'+Backbone.history.fragment == togo )
				self.filter(self.countrySlug);
			else {
				var href = $(this).attr("href");

				if ( $("html").hasClass("lt-ie8") ) {

					var 
						urlSplit = href.split( window.location.host ),
						usingHTTP = urlSplit.length > 1;
						
					if ( usingHTTP ) {
						href = urlSplit[1];
						href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
					}
				}

				KG.AppRouter.navigate(href, true);
			}
		});

		$('.selected-filter .country-label').on('click', function(e){
			e.preventDefault();

			$(".filter-list").addClass('open');
			$(".no-filter").removeClass("invisible");
			$(".selected-filter")
				.css("display", "none")
				.removeClass("selected-filter-"+self.countrySlug);
		});
	},

	filter : function( countrySlug ) {

		var 
			$article,
			$selected = $(".selected-filter");

		if ( countrySlug !== undefined ) {

			$selected
				.css("display", "block")
				.addClass('selected-filter-'+countrySlug);

			$('.country-label', $selected).html( $(".filter-"+countrySlug+" .filter-name").text() );
			$(".filter-list").removeClass("open");
			$(".no-filter").addClass("invisible");

			$(".article").each(function(index, el) {
				$article = $(el);
				if ( !$article.hasClass("country-" + countrySlug) ) {
					$article
						.hide()
						.removeClass("article-active");
				} else {
					$article
						.show()
						.addClass("article-active");
				}

				$article
					.removeClass("child-6n-2")
					.removeClass("child-6n-1")
					.removeClass("child-6n")
					.removeClass("child-5n5")
					.removeClass("child-5n4")
					.removeClass("child-5n3")
					.removeClass("child-4n-1")
					.removeClass("child-4n")
					.removeClass("child-3n2")
					.removeClass("child-3n3")
					.removeClass("child-2n");
			});

		} else {

			$selected
				.css("display", "none")
				.removeClass("selected-filter-"+this.countrySlug);

			$('.country-label', $selected).html( '' );
			$(".filter-list").removeClass("open");
			$(".no-filter").removeClass("invisible");

			$(".article").each(function(index, el) {
				$article = $(el);
				
				$article
					.show()
					.addClass("article-active")
					.removeClass("child-6n-2")
					.removeClass("child-6n-1")
					.removeClass("child-6n")
					.removeClass("child-5n5")
					.removeClass("child-5n4")
					.removeClass("child-5n3")
					.removeClass("child-4n-1")
					.removeClass("child-4n")
					.removeClass("child-3n2")
					.removeClass("child-3n3")
					.removeClass("child-2n");
			});
		}

		this.countrySlug = countrySlug;

		this._setChildhood();
		this._reposition();
	},

	_setChildhood : function() {

		var self = this;
		$(".article-active").each(function(index, article){
			$(article).addClass( self._addPositionClass(index) );
		});
	},

	_initNews : function( articles ) {

		var 
			self = this,
			countries = this.params.countries;

		this.articles = articles;

		$(".articles")
			.empty()
			.addClass("show-all");

		_.each( articles, function(article, index){

			var country = self._getCountryById( countries, article.get('country'));
			$(".articles").append( self._getArticleHTML(article, index, country) );
		});

		this.filter( this.countrySlug );
		this._reposition( true );
	},

	_getCountryById : function( countries, selected ) {

		var selectedCountry = null;
		_.each( countries, function( country ) {
			if ( country.get("id") === selected ) selectedCountry = country;
		});
		
		return selectedCountry;
	},

	_getArticleHTML : function(article, index, country) {

		var
			cssClass = "article article-active",
			articleHTML = $("<a />"),
			articleTextInside = $("<span />"),
			articleText = $("<span />"),
			articleDate = $("<span />"),
			articleTitle = $("<span />"),
			articleSubtitle = $("<span />"),
			articleImg = $("<span />"),
			articleImgIndication = $("<span />"),
			articleImgHover = $("<span />"),
			articleImgLink = $("<a />"),
			articleImgElement = $("<img />"),
			articleLink = $("<span />"),
			articleLinkText = $("<span />"),
			date = article.get('dateObject'),

			unix_timestamp = article.get('timestamp'),
			timestamp = new Date(unix_timestamp*1000),
			refDate = unix_timestamp ? timestamp : date;

		articleDate
			.addClass('article-date')
			.text( this._getTimeDifference( KG.ServerHours, KG.ClientHours, refDate ) );

		articleTitle
			.addClass('article-title')
			.text( article.get('Headline') );

		articleSubtitle
			.addClass('article-subtitle')
			.text( article.get('Strapline') );

		articleLinkText
			.addClass("article-link-text")
			.text( country.get('source') );

		articleLink
			.addClass('article-link')
			.append(articleLinkText);

		articleImgIndication
			.addClass("article-image-indication");

		articleImgLink
			.attr( 'href', article.get('link') )
			.attr( 'target', '_blank' )
			.addClass('article-image-link');

		articleImgHover
			.append(articleImgLink)
			.addClass("article-image-hover");

		articleImgElement
			.attr("src", article.get('img'))
			.addClass('article-image-element');

		articleImg
			.append(articleImgHover)
			.append(articleImgIndication)
			.append(articleImgElement)
			.addClass('article-image');

		articleTextInside
			.append( articleDate )
			.append( articleTitle )
			.append( articleSubtitle )
			.append( articleLink )
			.addClass("article-text-inside");

		articleText
			.append( articleTextInside )
			.addClass('article-text');

		articleHTML
			.attr( 'href', article.get('link') )
			.attr( 'target', '_blank' )
			.addClass( cssClass + " " + this._addPositionClass(index) + " country-" + article.get('countrySlug') + " icon-" + country.get("iconColor") )
			.append( articleText )
			.append( articleImg );

		return articleHTML;
	},

	_getTimeDifference : function( serverH, clientTime, articleTime ) {

		var 
			formattedDate,
			articleH = articleTime.getUTCHours(),
			clientH = clientTime.getHours(),
			diffH = clientH - serverH,
			newH = diffH > 0 ? articleH - diffH : articleH + diffH;

		if ( articleTime.getDate() == clientTime.getDate() && articleTime.getMonth() == clientTime.getMonth() && Math.abs(newH - clientH) < 24 ) {
			return KG.Utils._leadingZero( newH ) + ":" + KG.Utils._leadingZero(articleTime.getMinutes()) + ' ' + this.params.copy.news.today;
		} else {

			if ( KG.Utils.countryCode == "US" || KG.Utils.countryCode == "CN" ) {
				formattedDate = KG.Utils._leadingZero( articleTime.getMonth()+1) +"."+ KG.Utils._leadingZero( articleTime.getUTCDate()) +"."+ articleTime.getFullYear();
			} else {
				formattedDate = KG.Utils._leadingZero( articleTime.getUTCDate()) +"."+ KG.Utils._leadingZero( articleTime.getMonth()+1) +"."+ articleTime.getFullYear();
			}
			return formattedDate;
		}
	},

	_addPositionClass : function( index ) {

		var cssClass = "";

		/* Add css classes for cross browser support */
		// 1980
		if ( (index + 3) % 6 === 0 ) {
			cssClass += "child-6n-2 ";
		}
		if ( (index + 2) % 6 === 0 ) {
			cssClass += "child-6n-1 ";
		}
		if ( (index + 1) % 6 === 0 ) {
			cssClass += "child-6n ";
		}

		// 1440
		if ( (index + 1) % 5 === 0 ) {
			cssClass += "child-5n5 ";
		}
		if ( (index + 2) % 5 === 0 ) {
			cssClass += "child-5n4 ";
		}
		if ( (index - 2) % 5 === 0 ) {
			cssClass += "child-5n3 ";
		}

		// 1280
		if ( (index - 3) % 4 === 0 ) {
			cssClass += "child-4n-1 ";
		}

		if ( (index - 2) % 4 === 0 ) {
			cssClass += "child-4n ";
		}

		// 1024
		if ( (index - 1) % 3 === 0 ) {
			cssClass += "child-3n2 ";
		}

		if ( (index - 2) % 3 === 0 ) {
			cssClass += "child-3n3 ";
		}

		// ipad portrait + mobile
		if ( (index - 1) % 2 === 0 ) {
			cssClass += "child-2n ";
		}

		return cssClass;
	},

	resize : function() {

		clearTimeout(this.resizeTimer);
		var self = this;
		this.resizeTimer = setTimeout( function() {
			self._reposition();
		}, 50);

	},

	_reposition : function( isFirstTime, context ) {

		var self = context || this;

		clearTimeout(self.resizeTimer);

		var 
			gridSize = 6,
			windowWidth = $(window).innerWidth(),
			refHeight, refWidth, percentWidth,
			newTop, newLeft,
			$article,
			scrollDiff = window.outerWidth ? window.outerWidth - $(window).width() : 0;

		if ( !$("html").hasClass("lt-ie9") ) {
			windowWidth = window.innerWidth ? window.innerWidth : windowWidth;
			scrollDiff = 0;
		}
		
		if ( self._checkWidth( windowWidth, 1680 - scrollDiff, 1441 - scrollDiff) ) {
			gridSize = 5;
		} else if ( self._checkWidth( windowWidth, 1440 - scrollDiff, 1280 - scrollDiff) ) {
			gridSize = 4;
		} else if ( self._checkWidth( windowWidth, 1279 - scrollDiff, 769 - scrollDiff) ) {
			gridSize = 3;
		} else if ( self._checkWidth( windowWidth, 768 - scrollDiff) ) {
			gridSize = 2;
		}

		percentWidth = ( 100 / gridSize * 2 );
		refWidth = $('.block-content').width();
		refHeight = refWidth * percentWidth * 0.005 - ( gridSize == 6 ? 1 : 0 );

		$('.article-active').each( function(index, article) {
			$article = $(article);

			newTop = Math.floor(refHeight) * Math.floor( index / (gridSize/2) );
			newLeft = (Math.floor(index % (gridSize / 2)) * percentWidth) - 0.1;

			$article.css({
				"top" : Math.floor(newTop) + 'px',
				"left" : Math.max(0, newLeft) + '%'
			});
		});

		if ( isFirstTime ) {
			setTimeout( function() {
				self._reposition(false, self);
			}, 200 );
		}
	},

	_checkWidth : function( refWidth, max, min ) {
		return refWidth <= max && (min ? refWidth >= min : true);
	}
});


KG.View.Loading = KG.View.Base.extend({

	id : "loading",
	path : "loading.html",

	hide : function ( callbackEvent, callback ) {

		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},
	
	_display : function() {

		var self = this;

		self.slug = self.params.slug;

		$("body").attr("class", "").addClass(self.id);
		self._selectNav();
		
		$(this.el).html( this.tpl(this.params) ).fadeIn(KG.Data.FADE_IN_DURATION, function() {
			self._displayComplete(self);
		});
	}
	
});

KG.View.OurCompanies = KG.View.Base.extend({

	id : "our-companies",
	path : "our-companies.html",

	initialize : function(data) {

		this.params.slug = data.slug;
		this.params.map = data.map.at(0);
		this.params.copy = data.copy;

		this.params.categories = this.params.map.get("categories");

		var limit = this.params.categories.length / 2;
		this.params.left = _.filter( this.params.categories, function(o, num) { return num < limit; } );
		this.params.right = _.filter( this.params.categories, function(o, num) { return num >= limit; } );

		limit = this.params.categories.length / 3;
		this.params.left3 = _.filter( this.params.categories, function(o, num) { return num < limit; } );
		this.params.center3 = _.filter( this.params.categories, function(o, num) { return (num >= limit) && (num < limit * 2); } );
		this.params.right3 = _.filter( this.params.categories, function(o, num) { return num >= limit * 2; } );

		this.params.blocks = this.params.map.get("blocks");
		this.params.offices = this.params.map.get("offices");
	},

	_displayComplete : function() {

		this.initLinks();
		this.updateMap( $(".category-selected .category-title").data("id") );
		this.updateOfficesPositions();
	},

	initLinks : function() {

		var
			self = this,
			$this, $els, slug, id;

		$(".category-title").on('click', function(e){

			e.preventDefault();

			$this = $(this);

			slug = $this.data("slug");
			id = $this.data("id");

			$els = $(".category[data-slug='" + slug + "']");

			if ( $els.hasClass("category-selected") ) {

				$els.removeClass("category-selected");
				$(".blocks").addClass("visible");
				self.updateText();
				self.updateMap();

				KG.AppRouter.navigate( "/brands", false );

			} else {

				$(".category-selected").removeClass("category-selected");
				$els.addClass("category-selected");

				$(".blocks").removeClass("visible");
				self.updateText(slug);
				self.updateMap(id);

				KG.AppRouter.navigate( "/brands/" + slug, false );
			}
		});

		$(".category-title").on('mouseover', function(){
			self.updateMap( $(this).data("id") );
		});

		$(".category-title").on('mouseout', function(){
			self.updateMap( $(".category-selected .category-title").data("id") );
		});
	},

	updateText : function( slug ) {

		var $container = $(".category-description");

		if (slug) {

			$container.removeClass("show-default");

			var
				subContainer = $container.find(".selected-text"),
				source = $(".categories .category[data-slug='" + slug + "']"),
				categoryTitle = source.find(".category-title"),
				categoryLink = source.find(".category-link"),
				subLink = subContainer.find(".link");

			subLink
				.attr("href", categoryLink.attr("href"))
				.html( '<span class="link-text">' + categoryTitle.html() + '</span>' );

			subContainer.find(".text").html( source.find(".category-text").html() );

			var img = subContainer.find(".image img");
			if ( categoryTitle.data("image") ) {
				img.show().attr({
					"src" : categoryTitle.data("image"),
					"alt" : categoryTitle.html()
				});
			} else {
				img.hide();
			}


		} else {
			$container.addClass("show-default");
		}

	},


	updateMap : function(id) {

		var $container = $(".offices");

		if ( id !== undefined && id !== null ) {

			$container.find(".office").each(function(index, office){
				var
					$office = $(office),
					category = $office.data("category");

				if( category == id ) {
					// $office.addClass("selected")
					$office.removeClass("unselected");
				} else {
					// $office.removeClass("selected")
					$office.addClass("unselected");
				}

			});

		} else {
			// $container.find(".selected").removeClass("selected");
			$container.find(".unselected").removeClass("unselected");
		}
	},

	resize : function() {
		this.updateOfficesPositions();
	},

	updateOfficesPositions : function() {

		var
			refWidth = 700,
			refHeight = 328,

			bigWidth = 1121,
			bigHeight = 526,

			smallWidth = 524,
			smallHeight = 245,

			wWidth = $(window).width();

		_.each($(".offices .office"), function(office){

			var
				defaultX = $(office).data('x'),
				defaultY = $(office).data('y'),
				newX = defaultX,
				newY = defaultY,
				scrollDiff = KG.Utils.isIE ? 17 : ( window.outerWidth ? window.outerWidth - $(window).width() : 0);

			if ( wWidth < KG.Data.Layout.SmallDesktop - scrollDiff ) {

				newX = (smallWidth * defaultX) / refWidth;
				newY = (smallHeight * defaultY) / refHeight;

			} else if ( wWidth >= KG.Data.Layout.BiggerDesktop - scrollDiff ) {

				newX = (bigWidth * defaultX) / refWidth + 2;
				newY = (bigHeight * defaultY) / refHeight + 2;
			}

			$(office).css({
				"left" : newX,
				"top" : newY
			});
		});
	}

});


KG.View.CaseStudies = KG.View.BaseChild.extend({

	id : "case-studies",
	path : "about/case-studies.html",

	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.caseStudies = data.caseStudies.models;
	},

	_displayComplete : function(parent) {

		var self = parent;
		$(".block-video").each(function(){

			var videoObj = $(this);

			$(".play", this).on("click", function(e){
				e.preventDefault();
				
				if ( $(window).width() <= KG.Data.Layout.SmallMobile && !KG.Utils.isiOS )
					window.open("http://vimeo.com/" + videoObj.attr("data-vimeo-id"), "_blank" );
				else {
					self.preventMultiplePlayers();
					self.createPlayer(videoObj);
				}
			});

			if(Modernizr.touch) {
				self.createPlayer(videoObj);
			} else {
				videoObj.on("VIDEO_FINISHED", function(){
					self.preventMultiplePlayers();
				});
			}
		});
	},

	preventMultiplePlayers : function() {

		var container = $(".is-playing");

		container.find(".video-container").empty();
		container.find(".video-placeholder").removeClass("hidden");
		container.removeClass("is-playing");
	},

	createPlayer : function( videoObj ) {

		videoObj.addClass("is-playing");

		var 
			videoPlaceholder = $(".video-placeholder", videoObj),
			videoContainer = $(".video-container", videoObj),
			videoColour = videoObj.data("vimeo-colour") || "aaaaaa",
			videoWidth = videoPlaceholder.width(),
			videoHeight = videoPlaceholder.height(),
			videoHTML = '<iframe src="http://player.vimeo.com/video/' + videoObj.attr("data-vimeo-id") + '?title=0&amp;byline=0&amp;portrait=0&amp;color=' + videoColour + '&amp;autoplay=1&amp;api=1" data-width="' + videoWidth + '" data-height="' + videoHeight + '" width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

		videoPlaceholder.addClass("hidden");
		videoContainer.empty().append(videoHTML);

		var iframe = videoObj.find("iframe")[0],
		player = $f(iframe);

		player.addEvent('ready', function() {
			
			player.api('setColor', videoColour);
			player.addEvent('finish', function(){
				videoObj.trigger("VIDEO_FINISHED");
			});
		});
	},

	resize : function() {

		$(".video-container iframe").css({
			"width" : $(".video-container").width(),
			"height" : $(".video-container").height()
		});
	}
});

KG.View.OurOffer = KG.View.BaseChild.extend({

	id : "our-offer",
	path : "about/our-offer.html",

	lineLength : 1,

	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.offers = data.offers.models;
		this.params.slug = data.slug;
	},

	hide : function ( callbackEvent, callback ) {

		this.slug = null;
		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	_display : function() {

		var self = this;

		self.slug = self.params.slug;

		$("body").attr("class", "").addClass(self.id);
		self._selectNav();
		
		$(this.el).html( this.tpl(this.params) ).fadeIn(0, function() {
			self._displayComplete(self);
		});
	},

	_displayComplete : function(parent) {

		var self = parent;
		self._initPosition();
		self._initLinks();
		self._initBlocksVideo();
		self.resize();
		self.getLineLength();
	},

	_initPosition : function() {

		var 
			self = this,
			$container = $(".main-content"),
			$currentBlock = !this.slug ? $(".main-content .intro") : $(".offer-video[data-slug='" + this.slug + "']"),
			$img = $currentBlock.find("img"),

			wWidth = $(window).width(),
			newHeight = wWidth > (KG.Data.Layout.BigMidDesktop - ((window.innerWidth || document.documentElement.clientWidth) - wWidth)) && this.slug ? $img.height() + 20 : $currentBlock.height() + (this.slug ? 40 : 0);

		$img.on('load', function(){
			newHeight += $img.height();
			$container.find(".grid").css( KG.Utils.isIE7 ? "padding-top" : "margin-top", newHeight );
			self.resize();
		});
		$img.attr("src", $img.attr("src"));

		$container.find(".grid").css( KG.Utils.isIE7 ? "padding-top" : "margin-top", newHeight );
		setTimeout(function(){
			$container.find("section").addClass("animated");
		}, 50);
	},

	_initLinks : function() {
		
		var 
			self = this,
			spanSelected,
			wWidth,
			newHeight;

		$(".grid .media-link, .grid .media-img").on('click', function(e){

			e.preventDefault();
			self.preventMultiplePlayers();

			$(".template-cols").addClass("show-detail");

			$(".main-content .intro").addClass("hidden");
			$(".offer-video").addClass("hidden");

			$(".main-content .inactive").removeClass("inactive");

			spanSelected = $(this).parents(".span-1");
			spanSelected.removeClass("clear").addClass("inactive");

			self.getLineLength();
			self.setClearSpots();			

			var selectedOffer = $(".offer-video[data-slug='" + $(this).data("slug") + "']");
			selectedOffer.removeClass("hidden");

			if ( Modernizr.touch ) self.createPlayer( selectedOffer.find(".block-video") );

			wWidth = $(window).width() - ((window.innerWidth || document.documentElement.clientWidth) - $(window).width());
			newHeight = wWidth > KG.Data.Layout.BigMidDesktop ? selectedOffer.find('img').height() + 20 : selectedOffer.height() + 40;
			$(".main-content .grid").css( KG.Utils.isIE7 ? "padding-top" : "margin-top", newHeight );

			$("html, body").stop().animate({
				"scrollTop" : 0
			}, 500);

			self.slug = $(this).data("slug");
			KG.AppRouter.navigate($(this).attr("href"), false);
		});
	},

	_initBlocksVideo : function() {

		var self = this;
		$(".block-video").each(function(){

			var videoObj = $(this);

			$(".play", this).on("click", function(e){
				e.preventDefault();
				
				if ( $(window).width() <= KG.Data.Layout.SmallMobile && !KG.Utils.isiOS )
					window.open("http://vimeo.com/" + videoObj.attr("data-vimeo-id"), "_blank" );
				else {
					self.preventMultiplePlayers();
					self.createPlayer(videoObj);
				}
			});

			if(Modernizr.touch) {
				self.createPlayer(videoObj);
			} else {
				videoObj.on("VIDEO_FINISHED", function(){
					self.preventMultiplePlayers();
				});
			}
		});
	},

	preventMultiplePlayers : function() {

		var container = $(".is-playing");

		container.find(".video-container").empty();
		container.find(".video-placeholder").removeClass("hidden");
		container.removeClass("is-playing");
	},

	createPlayer : function( videoObj ) {

		videoObj.addClass("is-playing");

		var 
			videoPlaceholder = $(".video-placeholder", videoObj),
			videoContainer = $(".video-container", videoObj),
			videoColour = videoObj.data("vimeo-colour") || "aaaaaa",
			videoWidth = videoPlaceholder.width(),
			videoHeight = videoPlaceholder.height(),
			videoHTML = '<iframe src="http://player.vimeo.com/video/' + videoObj.attr("data-vimeo-id") + '?title=0&amp;byline=0&amp;portrait=0&amp;color=' + videoColour + '&amp;autoplay=1&amp;api=1" data-width="' + videoWidth + '" data-height="' + videoHeight + '" width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

		videoPlaceholder.addClass("hidden");
		videoContainer.empty().append(videoHTML);

		var iframe = videoObj.find("iframe")[0],
		player = $f(iframe);

		player.addEvent('ready', function() {
			
			player.api('setColor', videoColour);
			player.addEvent('finish', function(){
				videoObj.trigger("VIDEO_FINISHED");
			});
		});
	},

	resize : function() {

		var 
			$container = $(".main-content"),
			$currentBlock = this.slug ? $(".offer-video:not(.hidden)") : $(".main-content .intro"),
			wWidth = $(window).width(),
			newHeight = wWidth > (KG.Data.Layout.BigMidDesktop - ((window.innerWidth || document.documentElement.clientWidth) - wWidth)) && this.slug ? $currentBlock.find('img').height() + 20 : $currentBlock.height() + (this.slug ? 40 : 0);

		$container.find(".grid").css( KG.Utils.isIE7 ? "padding-top" : "margin-top", newHeight );

		$(".video-container iframe").css({
			"width" : $(".video-container").width(),
			"height" : $(".video-container").height()
		});

		this.getLineLength();
		this.setClearSpots();
	},

	getLineLength : function() {

		var wWidth = $(window).width() - ((window.innerWidth || document.documentElement.clientWidth) - $(window).width());

		if ( wWidth < KG.Data.Layout.SmallMobile ) {
			this.lineLength = 1;
		} else if ( wWidth <= KG.Data.Layout.IpadPortrait ) {
			this.lineLength = 2;
		} else if ( wWidth > KG.Data.Layout.SmallDesktop && wWidth <= KG.Data.Layout.BigMidDesktop ) {
			this.lineLength = 4;
		} else {
			this.lineLength = 3;
			if ( !$(".template-cols").hasClass("show-detail") ) {
				if ( wWidth >= KG.Data.Layout.BigMidDesktop && wWidth < KG.Data.Layout.BiggerMidDesktop ) {
					this.lineLength = 4;
				} else if ( wWidth >= KG.Data.Layout.BiggerMidDesktop ) {
					this.lineLength = 5;
				}
			}
		}
	},

	setClearSpots : function() {

		var self = this;

		$(".main-content .grid .span-1:not(.inactive)").each(function(i, el){

			$(el).removeClass( "clear" );
			$(el).addClass( (i % self.lineLength === 0 ? "clear" : "") );
		});
	}
	
});

KG.View.Partners = KG.View.BaseChild.extend({

	id : "partners",
	path : "about/partners.html",

	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.partners = data.partners.models;
	},

	_displayComplete : function() {
		this.resize();
	},

	resize : function() {
		this.getLineLength();
		this.setClearSpots();
	},

	getLineLength : function() {

		var 
			defaultWWidth = $(window).width(),
			innerWidth = window.innerWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : document.documentElement.clientWidth,
			wWidth = defaultWWidth - ( innerWidth - defaultWWidth),
			scrollDiff = window.outerWidth ? window.outerWidth - defaultWWidth : 0;

		if ( wWidth < KG.Data.Layout.SmallMobile - scrollDiff ) {
			this.lineLength = 1;
		} else if ( wWidth <= 950 - scrollDiff ) {
			this.lineLength = 2;
		} else if ( wWidth <= 1200 - scrollDiff ) {
			this.lineLength = 3;
		} else if ( wWidth < KG.Data.Layout.BiggerMidDesktop - scrollDiff ) {
			this.lineLength = 4;
		} else {
			this.lineLength = 5;
		}
	},

	setClearSpots : function() {

		var self = this;

		$(".empty-span").remove();
		$(".main-content .grid .span-1").each(function(i, el){
			$(el).removeClass( "clear" ).addClass( (i % self.lineLength === 0 ? "clear" : "") );

			if ( $("html").hasClass("lt-ie8") && (i % self.lineLength === 0) ) {
				var emptySpan = $('<span class="empty-span" style="display:block;clear:both;height:1px;margin-top:-1px;" />');
				emptySpan.insertBefore( el );
			}
		});
	}
	
});

KG.View.Inspiration = KG.View.BaseChild.extend({

	id : "inspiration",
	path : "about/inspiration/inspiration.html",

	initialize : function(data) {
		this.params.copy = data.copy;
		this.params.inspirations = data.inspirations.models;
	}

	// TODO Write resize script for ipad to 360-mobile, top text height is square height

});

KG.View.InspirationDetail = KG.View.BaseChild.extend({

	id : "inspiration-detail",

	initialize : function(data) {
		this.params.copy = data.copy;
		this.updateContent(data.content);
	},

	render : function() {

		this.params.models = this.collection ? this.collection.models : null;

		this.params.baseURL = KG.Locations.Images;
		this.params.retinaPrefix = KG.Utils.isRetina ? "" : "tmb_";
		this.params.retinaSuffix = KG.Utils.isRetina ? "" : ".jpg";
		
		var
			self = this,
			tplName = "inspiration-" + self.params.content.get("template"),
			tplPath = "about/inspiration/" + tplName + ".html";

		KG.TemplateManager.get( tplName, tplPath, function(tpl) {
			self.tpl = tpl;
			self._display();
		});
	},

	_selectNav : function() {

		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='inspiration']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	},

	updateContent : function(data) {

		this.params.content = data;

		var 
			$text = $('<div>'+this.params.content.get('text') + '</div>'),
			hasBlockquote = $text.find('blockquote').length > 0,
			blockquote = $('blockquote', $text),
			pNum = $text.find('> p').length,
			limit = Math.floor(pNum / 2),
			i = 0;

		this.params.textLeft = "";
		this.params.textRight = "";

		for ( i = 0; i < limit; i ++ ) {
			this.params.textLeft += $($('>p', $text).get(i)).html() + "<br>";
		}
		for ( i = limit; i < pNum; i ++ ) {
			this.params.textRight += $($('>p', $text).get(i)).html() + "<br>";
		}


		if ( hasBlockquote ) {

			if ( limit >= pNum - limit ) {
				this.params.textRight = "<blockquote>" + blockquote.html() + "</blockquote>" + this.params.textRight;
			} else {
				this.params.textLeft += "<blockquote>" + blockquote.html() + "</blockquote>";
			}

		}

		this.updateImages( data.get("images") );
	},

	updateImages : function(images) {
		var 
			limit = Math.floor(images.length / 2),
			halfOpen = false;

		_.each( images, function(image, index) {
			if ( index == limit && halfOpen ) limit++;
			if ( image.size == "half" ) halfOpen = !halfOpen;
		});

		this.params.imagesLeft = _.filter( images, function(o, num) { return num < limit; } );
		this.params.imagesRight = _.filter( images, function(o, num) { return num >= limit; } );
	},

	_displayComplete : function(parent) {

		var self = parent;
		$(".block-video").each(function(){

			var videoObj = $(this);

			$(".play", this).on("click", function(e){
				e.preventDefault();
				
				if ( $(window).width() <= KG.Data.Layout.SmallMobile && !KG.Utils.isiOS )
					window.open("http://vimeo.com/" + videoObj.attr("data-vimeo-id"), "_blank" );
				else {
					self.preventMultiplePlayers();
					self.createPlayer(videoObj);
				}
			});

			if(Modernizr.touch) {
				self.createPlayer(videoObj);
			} else {
				videoObj.on("VIDEO_FINISHED", function(){
					self.preventMultiplePlayers();
				});
			}
		});

		self.initCaptions();
	},

	initCaptions : function() {
		$(".caption").each(function(i, el){
			$(el)
				.css("bottom", "-" + $(el).height() + "px" )
				.addClass("animated");
		});
	},

	preventMultiplePlayers : function() {

		var container = $(".is-playing");

		container.find(".video-container").empty();
		container.find(".video-placeholder").removeClass("hidden");
		container.removeClass("is-playing");
	},

	createPlayer : function( videoObj ) {

		videoObj.addClass("is-playing");

		var 
			videoPlaceholder = $(".video-placeholder", videoObj),
			videoContainer = $(".video-container", videoObj),
			videoColour = videoObj.data("vimeo-colour") || "aaaaaa",
			videoWidth = videoPlaceholder.width(),
			videoHeight = videoPlaceholder.height(),
			videoHTML = '<iframe src="http://player.vimeo.com/video/' + videoObj.attr("data-vimeo-id") + '?title=0&amp;byline=0&amp;portrait=0&amp;color=' + videoColour + '&amp;autoplay=1&amp;api=1" data-width="' + videoWidth + '" data-height="' + videoHeight + '" width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

		videoPlaceholder.addClass("hidden");
		videoContainer.empty().append(videoHTML);

		var iframe = videoObj.find("iframe")[0],
		player = $f(iframe);

		player.addEvent('ready', function() {
			
			player.api('setColor', videoColour);
			player.addEvent('finish', function(){
				videoObj.trigger("VIDEO_FINISHED");
			});
		});
	},

	resize : function() {
		this.initCaptions();

		$(".video-container iframe").css({
			"width" : $(".video-container").width(),
			"height" : $(".video-container").height()
		});
	}
	
});

KG.View.Unicef = KG.View.BaseChild.extend({

	id : "unicef",
	path : "about/unicef/unicef.html",

	initialize : function( data ) {

		this.params.unicef = data.unicef.at(0);
		this.params.copy = data.copy;
		this.params.challenges = this.params.unicef.get("challenges");
		this.params.projects = this.params.unicef.get("projects");
	},

	_displayComplete : function () {

		if ( !Modernizr.csscolumns ) {
			$('.text-cols-2').columnize({
				columns : 2
			});
		}
	}
});

KG.View.UnicefDetail = KG.View.BaseChild.extend({

	id : "unicef-detail",
	path : "about/unicef/unicef-detail.html",

	initialize : function(data) {
		this.updateContent(data.content);
	},

	updateContent : function(data) {
		this.params.content = data;
	}
});

KG.View.CreativityInspiration = KG.View.BaseChild.extend({

	id : "creativity-inspiration",
	path : "careers/creativity-inspiration.html",

	dataLoaded : false,
	displayCompleted : false,

	events : {
		"click .link-internal" : "internalLink"
	},

	initialize : function(data) {
		
		this.params.copy = data.copy;
		this.params.content = data.content.models[0];

		KG.EventManager.bind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
	},

	onVizLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
		this.dataLoaded = true;
		if ( this.displayCompleted ) {
			this.showButton();
		}
	},

	_displayComplete : function () {

		this.resize();
		this.displayCompleted = true;
		if ( this.dataLoaded ) {
			this.showButton();
		}

		var self = this;
		$('.template-4').imagesLoaded( function() {
			self.resize();
		});
	},
	
	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	},

	showButton : function() {

		var $btn = $(".btn-big");
		$(".number", $btn).text( KG.Data.JobsTotal );
		$btn.animate({
			"opacity" : 1
		}, 200);
	},

	_selectNav : function() {
		
		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='careers']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	},

	resize : function() {

		// RESIZE PEOPLE
		var 
			$el, 
			$spanImage = $(".span-image"),
			$blockImage = $(".block-media", $spanImage),
			max = 0;

		$blockImage.css( "height", "" );

		$spanImage.each( function( i, el ) {
			$el = $(el);
			max = Math.max( max, $el.height() );
		});

		$blockImage.css( "height", max - 20 );
	}

});

KG.View.GrowCareer = KG.View.BaseChild.extend({

	id : "grow-your-career",
	path : "careers/grow-your-career.html",
	
	dataLoaded : false,
	displayCompleted : false,

	events : {
		"click .link-internal" : "internalLink"
	},
	
	initialize : function(data) {
		
		this.params.baseURL = KG.Locations.Images;
		this.params.copy = data.copy;
		this.params.growContent = data.content.models[0];

		var 
			exp = data.people.filter( function( person ) {
				return person.get("skale") != KG.Data.LabelGraduate && person.get("skale") != KG.Data.LabelExperienced;
			} );
		this.params.peopleGrow = exp;

		KG.EventManager.bind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
	},

	onVizLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
		this.dataLoaded = true;
		if ( this.displayCompleted ) {
			KJV.setup("nongraduate");
			$(".btn-big .number").text( KG.Data.JobsNonGraduateTotal );
		}
	},

	_displayComplete : function () {

		this.displayCompleted = true;
		if ( this.dataLoaded ) {
			KJV.setup("nongraduate");
			$(".btn-big .number").text( KG.Data.JobsNonGraduateTotal );
		}

		var self = this;
		$('.template-4').imagesLoaded( function() {
			self.resize();
		});
	},
	
	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	},

	hide : function ( callbackEvent, callback ) {

		this.displayCompleted = false;
		KJV.destroy();
		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	resize : function( ) {
		
		// Reposition VIZ
		var 
			wwidth = $(window).width(),
			jobViz = $(".span-job-search").detach(); 

		if ( wwidth < 1110 /*&& wwidth > 945*/ ) {
			jobViz.insertBefore($(".span-about-text .span-content"));
		} else {
			jobViz.prependTo( $(".span-left") );
		}

		// RESIZE VIZ
		var 
			$span = $(".span-job-search .span-content"),
			$viz = $("#viz-content", $span),
			$vizHeader = $(".viz-header", $span),
			vizW = $span.width(),
			vizHeaderH = $vizHeader.height();

		$span.css("height", vizW );
		$viz.css("height", vizW - vizHeaderH );

		if ( KJV ) KJV.resize( vizW, vizW - vizHeaderH );

		// RESIZE PEOPLE
		var 
			$el, 
			$people = $(".span-people"),
			$blockPeople = $(".block-media", $people),
			max = 0;

		$blockPeople.css( "height", "" );

		$people.each( function( i, el ) {
			$el = $(el);
			max = Math.max( max, $el.height() );
		});

		$blockPeople.css( "height", max - 20 );
	}

});

KG.View.JobDetail = KG.View.BaseChild.extend({

	id : "job-detail",
	path : "careers/job-detail.html",

	initialize : function(data) {
		
		this.params.copy = data.copy;
		this.params.job = null;

		KG.EventManager.bind( KG.Events.JOB_DETAIL_INIT, $.proxy(this.onInit, this) );
		KG.EventManager.bind( KG.Events.JOB_DETAIL_LOADED, $.proxy(this.onDataLoaded, this) );
	},

	onInit : function() {

		this.params.job = null;

		var self = this;
		$(this.el).fadeOut(200, function () {
			$(self.el).html( self.tpl(self.params) ).fadeIn( 200 );
		});
	},

	onDataLoaded : function() {

		// KG.EventManager.unbind( KG.Events.JOB_DETAIL_LOADED, $.proxy(this.onDataLoaded, this) );

		this.params.job = KG.Data.currentJob;
		this.initView();
	},

	initView : function() {

		var self = this;
		$(this.el).fadeOut(200, function () {
			$(self.el).html( self.tpl(self.params) ).fadeIn(200, $.proxy(self.initViewComplete, self) );
		});
	},

	initViewComplete : function() {

		var data = this.params.job;

		if ( _gaq ) {
			_gaq.push(['b._setAccount', KG.SecondaryAnalytics ]);
			_gaq.push(['b._trackPageview']);
		}

		// Custom tracking
		if ( _gaq ) _gaq.push(['b._trackEvent', 'Job Page Loaded', data.company + ' - ' + data.title + ' - ' + data.id ]);
		$(".btn-apply").on("click", function() {
			if ( _gaq ) {
				_gaq.push(['b._trackEvent', 'Apply Button Clicked', data.company + ' - ' + data.title + ' - ' + data.id ]);
			}
		});
	},

	_selectNav : function() {
		
		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='careers']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	}

});

KG.View.JobSearch = KG.View.BaseChild.extend({

	id : "job-search",
	path : "careers/job-search.html",

	events : {
		"click .link-filter" : "onFilter",
		"click .link-select" : "onSelect",
		"click .link-unselect" : "onUnselect",
		"click .job-line" : "onJobClicked",
		"click .extend-filter" : "onExtendFilter",
		"click .load-more" : "onLoadMore"
	},

	dataLoaded : false,
	displayCompleted : false,
	viewInited : false,

	limit : 50,
	max : 0,
	filters : {},
	QS : {},

	initialize : function(data) {

		this.params.copy = data.copy;
		this.params.jobs = null;
		this.params.filters = null;
		this.params.limit = this.limit;

		KG.EventManager.bind( KG.Events.JOB_DATA_LOADED, $.proxy(this.onDataLoaded, this) );
	},

	onDataLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_DATA_LOADED, $.proxy(this.onDataLoaded, this) );
		this.dataLoaded = true;
		this.dataReady();
	},

	_displayComplete : function () {

		this.displayCompleted = true;
		this.dataReady();
	},

	dataReady : function() {

		if ( this.viewInited ) {

			this.updateView();

		} else {
			if ( this.displayCompleted && this.dataLoaded ) {

				this.viewInited = true;
				this.initView();
			}
		}
	},

	initView : function() {

		this.params.filters = KG.Data.Jobs.filters;
		this.params.jobs = KG.Data.Jobs.jobs;

		this.filters.locations = this.params.filters.countries;
		
		var self = this;
		$(this.el).fadeOut(200, function () {
			$(self.el).html( self.tpl(self.params) ).fadeIn(200, function() {

				$.proxy( self.updateView(), self );
			});
		});
	},

	updateView : function() {

		this.$inputLocation = $(".input-location");
		this.$listFilter = $(".span-filter ul");

		this.$inputLocation.placeholder();

		this.$plural = $(".plural");
		this.$num = $(".block-top-text .num");
		this.$num.text( KG.Data.Jobs.jobs.length );
		
		if ( KG.Data.Jobs.jobs.length == 1 ) this.$plural.hide();
		else this.$plural.show();
		
		this.max = KG.Data.Jobs.jobs.length;

		this.initFilters();
		this.initAutocomplete();
		this.resize();
	},

	initAutocomplete : function() {

		var self = this;

		if ( this.$inputLocation ) {
			this.$inputLocation.autocomplete({
				lookup: this.filters.locations,
				minChars: 1,
				maxHeight : '100%',
				triggerSelectOnValidInput : false,
				onSelect: function (suggestion) {
					self.selectHandler(suggestion.value);
				}
			});

		// $("<div class='shadow'></div>").appendTo( $(".autocomplete-suggestions") );

			this.$inputLocation.on("focus", function() {
				$(".block-filters .open").removeClass("open");
			});
		}
	},

	onExtendFilter : function(e) {

		e.preventDefault();
		this.extendFilter();
	},

	extendFilter : function() {

		$(".extend-filter").hide();
		$(".span-hidden").slideDown();
	},

	selectHandler : function ( suggestion ) {
		
		if ( this.$inputLocation )
			this.$inputLocation
				.attr("readonly", "true")
				.addClass("disabled")
				.parents(".span-autocomplete").addClass("input-selected");

		this.filterTable( "location", suggestion );
	},

	initFilters : function() {

		this.$jobs = $("table tbody tr");
		
		var 
			baseSearch = KG.Utils.isIE ? window.location.hash.split("?")[1] : window.location.search.split("?")[1],
			type, location, company, level, special;

		baseSearch = baseSearch ? baseSearch.split("&") : [];

		if ( baseSearch.length ) {
			
			_.each( baseSearch, function( param ) {

				var p = param.split("=");

				switch ( p[0] ) {
					case "location":
						location = decodeURIComponent(p[1]);
						break;
					case "type":
						type = decodeURIComponent(p[1]);
						break;
					case "company":
						company = decodeURIComponent(p[1]);
						break;
					case "level":
						level = decodeURIComponent(p[1]);
						break;
					case "special": // use for job viz to job search from Start and Grow
						special = decodeURIComponent(p[1]);
				}
			});
		}
		
		if ( !!type ) this.doFilter("type", type);
		if ( !!location ) this.doFilter("location", location);
		if ( !!company ) this.doFilter("company", company);
		if ( !!level ) this.doFilter("level", level);

		if ( !!company || !!level ) this.extendFilter();

		if ( !type && !location && !company && !level ) this.updateFilterNumber();

		if ( !!special ) {

			var
				indexShown = 0,
				limit = this.limit,
				$job, joblevel;

			_.each( this.$jobs, function(job, i) {

				$job = $(job);
				joblevel = $job.data("level");

				if ( 
						( special == "graduate" && ( joblevel == KG.Data.LabelGraduate || joblevel == KG.Data.LabelExperienced ) ) || 
						( special == "non-graduate" && joblevel != KG.Data.LabelGraduate && joblevel != KG.Data.LabelExperienced ) 
					) {

					$job.removeClass("vhidden-level");
					
					if ( i >= limit && indexShown < limit )
						$job.removeClass("hidden");

					if ( indexShown % 2 === 0 ) {
						$job.removeClass("odd");
					} else {
						$job.addClass("odd");
					}

					if ( !$job.hasClass("vhidden-type") && !$job.hasClass("vhidden-company") && !$job.hasClass("vhidden-level") && !$job.hasClass("vhidden-location") ) 
						indexShown++;

				} else {
					$job.addClass("vhidden-level");
				}
			} );

			this.updateFilterNumber();
			this.checkExtraTable( indexShown );
		}
	},

	onSelect : function(e) {

		e.preventDefault();

		var $block, $list;

		$block = $(e.currentTarget).parents(".span-filter");
		$list = $block.find("ul");

		if ( !$list.hasClass("open") ) $(".block-filters .open").removeClass("open");
		$list.toggleClass("open");
	},

	onFilter : function(e) {

		e.preventDefault();

		var
			$target = $(e.currentTarget),
			$block = $target.parents(".span-filter"),
			$filter = $block.data("filter");

		if ( $target.hasClass("disabled") ) return false;
		$(".open", $block).removeClass("open");

		if ( $target.hasClass("selected") ) {

			$target.removeClass("selected");
			this.removeFilter( $filter );

		} else {

			this.doFilter( $filter, $target.data($filter) );
		}

		var scrollTop = ( $(window).width() <= KG.Data.Layout.Mobile ) ? $(".block-top-text").position().top : 0;
		$("html, body").stop().animate({
			"scrollTop" : scrollTop
		}, 500);
	},

	doFilter : function ( filter, value ) {

		if ( filter == "location" ) {
			this.$inputLocation.val(value);
			this.selectHandler( value );
		} else 
			this.selectFilter( filter, value );

		this.filterTable( filter, value );
	},

	selectFilter : function( filter, value ) {

		var 
			$block = $(".span[data-filter='" + filter + "']"),
			$target = $(".link-filter[data-"+ filter +"='" + value + "']", $block),
			$selectable = $(".selectable", $block);

		$(".selected", $block).removeClass("selected");
		$target.addClass("selected");

		$(".link-select .link-text", $selectable).text( $target.find(".link-text").text() );
		$selectable.addClass("selectable-selected");
	},

	filterTable : function( filter, value ) {

		this.updateQS( filter, value );

		var
			indexShown = 0,
			limit = this.limit,
			$job, patt;

		_.each( this.$jobs, function(job, i) {

			$job = $(job);

			patt = new RegExp( value, "g" );
			if ( (filter != "location" && $job.data(filter) === value) || (filter == "location" && patt.test( $job.data(filter)) ) ) {

				$job.removeClass("vhidden-" + filter);
				
				if ( i >= limit && indexShown < limit )
					$job.removeClass("hidden");

				if ( indexShown % 2 === 0 ) {
					$job.removeClass("odd");
				} else {
					$job.addClass("odd");
				}

				if ( !$job.hasClass("vhidden-type") && !$job.hasClass("vhidden-company") && !$job.hasClass("vhidden-level") && !$job.hasClass("vhidden-location") ) 
					indexShown++;

			} else {
				$job.addClass("vhidden-" + filter);
			}
		} );

		this.updateFilterNumber(  );
		this.checkExtraTable( indexShown );
	},

	removeFilter : function( filter ) {

		this.updateQS(filter, null);
		
		var 
			limit = this.limit,
			$block = $(".span-filter[data-filter='" + filter + "']"),
			$selectable = $(".selectable", $block),
			$linkSelect = $(".link-select", $selectable),
			indexShown = 0,
			$job;

		_.each( this.$jobs, function( job ) {

			$job = $(job);
			$job.removeClass("vhidden-"+filter);

			if ( indexShown % 2 === 0 ) {
				$job.removeClass("odd");
			} else {
				$job.addClass("odd");
			}

			if ( !$job.hasClass("vhidden-type") && !$job.hasClass("vhidden-company") && !$job.hasClass("vhidden-level") && !$job.hasClass("vhidden-location") ) 
				indexShown++;

			if ( indexShown > limit )
				$job.addClass("hidden");
		});

		$selectable.removeClass("selectable-selected");
		$(".link-text", $linkSelect).text( $linkSelect.data("default") );
		$(".selected", $block).removeClass("selected");

		this.updateFilterNumber(  );
		this.checkExtraTable( indexShown );
	},

	updateFilterNumber : function() {

		var $job;

		$(".link-filter .link-num").text(0);

		_.each( this.$jobs, function( job ) {

			$job = $(job);

			if ( !$job.hasClass("vhidden-type") && !$job.hasClass("vhidden-company") && !$job.hasClass("vhidden-level") && !$job.hasClass("vhidden-location") ) {

				var 
					$type = $(".link-filter[data-type='" + $job.data("type") + "']"),
					$typeNum = $type.find(".link-num"),
					newVal = parseInt($typeNum.text(), 10) + 1;

				$typeNum.text( newVal );
				
				var 
					$company = $(".link-filter[data-company='" + $job.data("company") + "']"),
					$companyNum = $company.find(".link-num");

				newVal = parseInt($companyNum.text(), 10) + 1;
				$companyNum.text( newVal );
				
				var 
					$level = $(".link-filter[data-level='" + $job.data("level") + "']"),
					$levelNum = $level.find(".link-num");

				newVal = parseInt($levelNum.text(), 10) + 1;
				$levelNum.text( newVal );
			}
		});

		// Add/remove disable

		var $linkFilter;
		_.each( $(".link-filter"), function( linkFilter ) {

			$linkFilter = $(linkFilter);

			if ( parseInt( $linkFilter.find( ".link-num" ).text(), 10 ) === 0 ) {
				$linkFilter.addClass("disabled");
			} else {
				$linkFilter.removeClass("disabled");
			}

		});

	},

	checkExtraTable : function ( indexShown, noUpdate ) {
		
		if ( !noUpdate ) {
			this.$num.text( indexShown );
			this.max = indexShown;

			if ( indexShown == 1 ) this.$plural.hide();
			else this.$plural.show();
		}

		if ( indexShown < this.limit || this.max <= $("tbody tr:not(.hidden):not(.vhidden-type):not(.vhidden-company):not(.vhidden-location):not(.vhidden-level)").length ) {
			$(".load-more").hide();
		} else {
			$(".load-more").show();
		}

		if ( indexShown === 0 ) {
			$(".no-results").show();
		} else {
			$(".no-results").hide();
		}
	},

	onJobClicked : function(e) {
		e.preventDefault();

		//var link = $(e.currentTarget).data("href");
		//window.open(link, '_blank');

		var job_id = $(e.currentTarget).data("id");
		KG.AppRouter.navigate("careers/jobs/"+job_id, true);
	},

	onLoadMore : function(e) {
		
		e.preventDefault();

		var 
			limit = this.limit,
			indexShown = 0,
			$job;

		$("tr.hidden").each( function(i, tr) {

			$job = $(tr);

			if ( !$job.hasClass("vhidden-type") && !$job.hasClass("vhidden-company") && !$job.hasClass("vhidden-level") && !$job.hasClass("vhidden-location") ) {
				$job.removeClass("hidden");
				indexShown++;
			}
	
			if ( indexShown >= limit ) {
				return false;
			}
		});

		this.checkExtraTable( indexShown, true );
	},

	onUnselect : function(e) {
		e.preventDefault();

		$(".block-filters .open").removeClass("open");
		var filter = $(e.currentTarget).data("filter");

		if ( filter == "location" ) {
			this.$inputLocation
				.val("")
				.removeAttr("readonly")
				.removeClass("disabled")
				.parents(".span-autocomplete").removeClass("input-selected");
		}
		
		this.removeFilter( filter );
	},

	updateQS : function ( filter, value ) {

		this.QS[filter] = value;

		var 
			querystring = "",
			index = 0;

		_.each( this.QS, function( val, key ) {

			if ( val != null ) {
				querystring += index === 0 ? "?" : "&";
				querystring += key + "=" + val;
				index++;
			}
		});


		Backbone.history.navigate( "/careers/job-search" + querystring, false );
	},

	resize : function() {

		if ( this.$inputLocation )
			this.$inputLocation.css("width", this.$inputLocation.parent().width() - 40 ); // 40 is the padding inside the input
		
		this.$listFilter.css("width", this.$listFilter.parent().width() ); // 40 is the padding inside the list
	},

	hide : function ( callbackEvent, callback ) {

		if ( this.$inputLocation ) this.$inputLocation.autocomplete("dispose");
		this.QS = {};
		
		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	}

});


KG.View.PeopleStories = KG.View.BaseChild.extend({

	id : "people-stories",
	path : "careers/people-stories.html",

	events: {
		'click .btn-open' : 'toggleBlockClick',
		'click .link-block' : 'toggleBlockClick',
		'click .btn-close' : 'toggleBlockClick',
		'click .link-internal' : 'internalLink'
	},

	initialize : function(data) {

		this.params.baseURL = KG.Locations.Images;
		this.params.copy = data.copy;
		this.params.slug = data.slug;

		this.allPeople = data.people;
		this.params.people = data.people.models;
	},

	render : function() {

		var slug = Backbone.history.fragment.split("/")[2];
		if ( slug )
			this.params.selected = this.allPeople.where( { slug : slug } )[0];
		else 
			this.params.selected = null;

		this.params.people = KG.Utils.shuffleArray( this.params.people );
		
		this.params.models = this.collection ? this.collection.models : null;
		this.params.baseURL = KG.Locations.Images;
		this.params.retinaPrefix = KG.Utils.isRetina ? "" : "tmb_";
		this.params.retinaSuffix = KG.Utils.isRetina ? "" : ".jpg";

		var self = this;
		KG.TemplateManager.get( self.id, self.path, function(tpl) {
			self.tpl = tpl;
			self._display();
		});
	},

	_selectNav : function() {
		
		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='careers']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	},

	_displayComplete : function() {
		
		var 
			self = this,
			$item, $text;

		$(".span-people").each( function( i, item ) {

			$item = $(item);
			$text = $item.find(".people-text");

			$item.data("height", $item.height() );
			$text.hide();
		});

		$('.template-3').imagesLoaded( function() {

			$('.template-3').isotope({
				itemSelector: '.span-1'
			});
			self.resize();
			self.openBlock();
		});
	},
	
	hide : function ( callbackEvent, callback ) {

		$('.template-3').isotope("destroy");

		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	toggleBlockClick : function(e) {

		e.preventDefault();

		var href = $(e.currentTarget).attr("href");
		
		if ( $("html").hasClass("lt-ie8") ) {
			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;

			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}

		KG.AppRouter.navigate(href, false);
		this.toggleBlock();
	},

	toggleBlock : function() {

		var 
			self = this,
			$opened = $(".span-people:not(.span-closed)");

		if ( $opened.length ) {

			$(".people-text", $opened).slideUp({
				complete : function() {
					
					$(".people-text", $opened).animate({
						"opacity" : 0
					}, 200);

					$opened
						.css("height", "")
						.addClass("span-closed");

					$(".template-3").isotope("layout");
					self.openBlock( $opened );
				}
			});

		} else {
			self.openBlock();
		}
	},

	openBlock : function( extra ) {

		var 
			self = this,
			slug = Backbone.history.fragment.split("/")[2],
			$toOpen = $(".span-people[data-slug='" + slug + "']");

		if ( slug ) {

			// REMOVE PREVIOUS STYLE
			$(".block-media", $toOpen).css("height", "");
			
			// SET BLOCK HEIGHT FROM DATA
			$toOpen.css("height", $toOpen.data("height") );

			// LAYOUT
			$(".template-3").isotope("layout");

			// THEN ANIMATE OPENING
			$(".people-text", $toOpen).slideDown({
				complete : function() {
					
					$("html, body").animate({
						scrollTop : $toOpen.position().top
					}, 500);

					$toOpen.removeClass("span-closed");

					$(".people-text", $toOpen).animate({
						"opacity" : 1
					}, 200);

					self.resize();
				}
			});
		} else {

			if ( extra ) {
				// IF only close then go to top of the closed block
				$("html, body").stop().animate({
					"scrollTop" : extra.position().top
				}, 500);
			}

			self.resize();
		}
	},

	resize : function() {

		var $item, $text;

		$(".span-people").each( function( i, item ) {

			$item = $(item);
			$text = $item.find(".people-text");

			if ( $item.hasClass("span-closed") ) {
				$text.show();
				$item.data("height", $item.height() );
				$text.hide();
			} else {
				$item.css("height", "" );
				$item.data("height", $item.height() );
				$item.css("height", $item.data("height") );
			}
		});

		var 
			$el, 
			$people = $(".span-people.span-closed"),
			$blockPeople = $(".block-media", $people),
			max = 0;

		$blockPeople.css( "min-height", "" );

		$people.each( function( i, el ) {
			$el = $(el);
			max = Math.max( max, $el.height() );
		});

		$blockPeople.css( "min-height", max - 20 );
		$(".template-3").isotope("layout");
	},

	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	}

});

KG.View.StartCareer = KG.View.BaseChild.extend({

	id : "start-your-career",
	path : "careers/start-your-career.html",
	
	dataLoaded : false,
	displayCompleted : false,

	events : {
		"click .link-internal" : "internalLink"
	},

	initialize : function(data) {
		
		this.params.baseURL = KG.Locations.Images;
		this.params.copy = data.copy;
		this.params.startContent = data.content.models[0];
		
		var 
			exp = data.people.filter( function( person ) {
				return person.get("skale") == KG.Data.LabelGraduate || person.get("skale") == KG.Data.LabelExperienced;
			} );

		this.params.peopleStart = exp;

		KG.EventManager.bind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
	},

	onVizLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
		this.dataLoaded = true;
		if ( this.displayCompleted ) {
			KJV.setup("graduate");
			$(".btn-big .number").text( KG.Data.JobsGraduateTotal );
		}
	},

	_displayComplete : function () {

		// this.resize();
		this.displayCompleted = true;
		if ( this.dataLoaded ) {
			KJV.setup("graduate");
			$(".btn-big .number").text( KG.Data.JobsGraduateTotal );
		}		

		var self = this;
		$('.template-4').imagesLoaded( function() {
			self.resize();
		});
	},
	
	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	},

	hide : function ( callbackEvent, callback ) {

		this.displayCompleted = false;
		KJV.destroy();
		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	resize : function( ) {
		
		// Reposition VIZ
		var 
			wwidth = $(window).width(),
			jobViz = $(".span-job-search").detach(); 

		if ( wwidth < 1110 /*&& wwidth > 945*/ ) {
			jobViz.insertBefore($(".span-about-text .span-content"));
		} else {
			jobViz.prependTo( $(".span-left") );
		}

		// RESIZE VIZ
		var 
			$span = $(".span-job-search .span-content"),
			$viz = $("#viz-content", $span),
			$vizHeader = $(".viz-header", $span),
			vizW = $span.width(),
			vizHeaderH = $vizHeader.height();

		$span.css("height", vizW );
		$viz.css("height", vizW - vizHeaderH );

		if ( KJV ) KJV.resize( vizW, vizW - vizHeaderH );

		// RESIZE PEOPLE
		var 
			$el, 
			$people = $(".span-people"),
			$blockPeople = $(".block-media", $people),
			max = 0;

		$blockPeople.css( "height", "" );

		$people.each( function( i, el ) {
			$el = $(el);
			max = Math.max( max, $el.height() );
		});

		$blockPeople.css( "height", max - 20 );
	}

});

KG.View.Unicef = KG.View.BaseChild.extend({

	id : "unicef",
	path : "careers/unicef.html",
	itvs : [],

	events : {
		"click .link-internal" : "internalLink"
	},

	initialize : function(data) {
		
		this.params.copy = data.copy;
		this.params.content = data.content.models[0];
		KG.EventManager.bind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
	},

	onVizLoaded : function() {

		KG.EventManager.unbind( KG.Events.JOB_VIZ_LOADED, $.proxy(this.onVizLoaded, this) );
		this.dataLoaded = true;
		if ( this.displayCompleted ) {
			this.showButton();
		}
	},

	_displayComplete : function () {

		this.resize();
		this.displayCompleted = true;
		if ( this.dataLoaded ) {
			this.showButton();
		}

		var self = this;
		$(".media-img-inside").each( function( i, media ) {
			self.initSlideshow( media );
		});
	},
	
	internalLink : function(e) {

		e.preventDefault();

		$("html, body").stop().animate({
			"scrollTop" : 0
		}, 500);
		
		$("#wrapper").removeClass('show-mobile-nav');

		var href = $(e.currentTarget).attr("href");

		if ( $("html").hasClass("lt-ie8") ) {

			var 
				urlSplit = href.split( window.location.host ),
				usingHTTP = urlSplit.length > 1;
				
			if ( usingHTTP ) {
				href = urlSplit[1];
				href = KG.Locations.Root !== "" ? href.replace( KG.Locations.Root, "" ) : href;
			}
		}
		
		KG.AppRouter.navigate(href, true);
	},

	showButton : function() {

		var $btn = $(".btn-big");
		$(".number", $btn).text( KG.Data.JobsTotal );
		$btn.animate({
			"opacity" : 1
		}, 200);
	},

	_selectNav : function() {
		
		var 
			$container = $(".main-nav"),
			$link = $container.find("li a[data-page='careers']");

		$container.find("li.selected").removeClass("selected");
		$link.parent().addClass("selected");
		$link.parents('.has-child').addClass("open");
	},

	initSlideshow : function(container) {

		var $imgs = $('img', container);
		$imgs.css("opacity", 0 );

		var
			maxImg = $imgs.length,
			currentImg = 0;

		$imgs.eq(currentImg).css("opacity", 1);

		if ( maxImg > 1 ) {
			var interval = setInterval(function(){

				$imgs.eq(currentImg).animate({
					"opacity": 0
				}, 1000);

				currentImg++;
				if ( currentImg >= maxImg ) {
					currentImg = 0;
				}

				$imgs.eq(currentImg).animate({
					"opacity": 1
				}, 1000);

			}, 5000);

			this.itvs.push(interval);
		}
	},

	hide : function ( callbackEvent, callback ) {

		_.each( this.itvs, function(itv) {
			clearInterval(itv);
		} );
		this.itvs = [];

		var $el = $(this.el);
		$el.fadeOut(KG.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

});

KG.View.Components.Line = function( options ) {

	var 
		container = null,
		index = 0,
		articles = null,
		grid = null,
		cellSize = 0,
		gridSize = 0,

		rightOffset = null,
		leftOffset = null,

		_init = function( options ) {

			index = options.index;
			cellSize = options.cellSize;
			gridSize = options.gridSize;

			grid = options.grid;
			articles = options.articles;

			container = $('<div class="line line-' + index + '" />');

			_build();
			
		},

		_build = function () {

			_.each(grid, function ( article ){
				if ( typeof article == "object" )
					container.append( getArticleHTML(article) );
			});
		},

		getArticleHTML = function( article, direction ) {

			var 
				articleData = articles[article.index],
				size = article.size,
				country = article.country.get('slug'),
				css = "article " + size + " " + country + " icon-" + article.country.get("iconColor"),
				data = null,
				left = null,
				$article = $("<div />");

			data = {
				"country" : country,
				"size" : size,
				"index" : articleData.get("id")
			};

			// TODO Use underscore template
			var 
				date = '<div class="article-date">' + articleData.get("date") + '</div>',
				title = '<div class="article-title"><a target="_blank" href="' + articleData.get("link") + '">' + articleData.get("title") + '</a></div><span class="small-title">' + articleData.get("title") + '</span>',
				link = '<a target="_blank" href="' + articleData.get("link") + '" class="link"><span class="link-text">' + article.country.get("source") + '</span></a>',
				articleHTML = '<div data-index="'+ articleData.get("id") +'" class="article-link' + (Modernizr.touch ? " visible" : "") + '">' + date + title + link + '</div>';

			$article.html( articleHTML );
			$article.addClass(css);
			$article.data(data);

			// TODO use "direction"
			if ( direction ) {

				if ( direction == "rightToLeft" ) {
					if ( !rightOffset ) {
						rightOffset = gridSize - article.position;
					}

					left = ((article.position + rightOffset) * cellSize) + "%";

				} else if ( direction == "leftToRight" ) {

					if ( !leftOffset ) {
						leftOffset = article.position;
					}

					left = (( article.position - leftOffset - (size == "big" ? 3 : 1) ) * cellSize ) + "%";
				}
			}
			else {
				left = (article.position * cellSize) + "%";
			}
			
			$article.css("left", left);

			if ( !Modernizr.touch ) {
				$($article.find('.article-title a'))
					.on('mouseover', function(){
						$(this).parents(".article-link").addClass("visible");
					})
					.on('mouseout', function(){
						$(this).parents(".article-link").removeClass("visible");
					});
			}

			return $article;
		},

		update = function ( newGrid, newCellSize ) {

			var 
				$line = $(".line").eq(index),
				$articles = $line.find(".article"),
				fromLeft = true,

				$newArticle,
				min = (grid[0].index !== undefined ? grid[0].index : (grid[1] ? grid[1].index : 0) ),
				max = grid[grid.length - 1].index !== undefined ? grid[grid.length - 1].index : (grid[grid.length - 2] ? grid[grid.length - 2].index : 0);

			cellSize = newCellSize;
			rightOffset = null;
			leftOffset = null;

			$articles.each( function(i, article) {

				var 
					$article = $(article),
					data = _.where(newGrid, {index : $article.data("index")})[0];

				if ( data ) {

					$article
						.removeClass("big")
						.removeClass("small")
						.addClass( data.size )
						.css("left", (data.position * cellSize) + "%");

					fromLeft = false;

				} else {

					if ( fromLeft )
						$article.css("left", - ( (($article.hasClass("big") ? 3 : 1) + i * ($article.hasClass("big") ? 3 : 1)) * cellSize) + "%");
					else
						$article.css("left", (gridSize * cellSize) + "%");

					setTimeout(function() {
						$article.remove();
					}, 500);

					// TODO use transitionEnd instead of setTimeout
					// $article.on( "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
					// });
				}

			});

			_.each( newGrid, function(gridItem) {

				if ( typeof gridItem !== "object" ) return;

				if ( gridItem.index > max ) {
					$newArticle = getArticleHTML(gridItem, "rightToLeft");
					$line.append($newArticle);

					// $newArticle.css("left", (gridItem.position * cellSize) + "%" );
					$newArticle.animate({
						"left" : (gridItem.position * cellSize) + "%" 
					}, 0);
				}
			});


			for ( var i = newGrid.length - 1, minIndex = 0; i >= minIndex; i-- ) {

				var gridItem = newGrid[i];
				if ( typeof gridItem == "object" ) {

					if ( gridItem.index < min ) {
						$newArticle = getArticleHTML(gridItem, "leftToRight");
						$line.prepend($newArticle);
						
						$newArticle.animate({
							"left" : (gridItem.position * cellSize) + "%" 
						}, 0);
					}
				}
			}


			grid = newGrid;

		},

		getHTML = function() {
			return container;
		};

	_init( options );
	return {
		update : update,
		getHTML : getHTML
	};

};

//	Raphael extension
var archFn = function (xloc, yloc, value, R) {
    var alpha = value,
        a = (90 - alpha) * Math.PI / 180,
        x = xloc + R * Math.cos(a),
        y = yloc - R * Math.sin(a),
        path;
    path = [
        ["M", xloc, yloc - R],
        ["A", R, R, 0, +(alpha > 180), 1, x, y],
        ["L", xloc, yloc] //
    ];
    return {
        path: path
    };
};

//	app
window.KJV = window.KJV || {

	COLORS: [
		["#dcb450","#724d02","#434241","#a29e97","#d3d0ca"],
		["#d3d0ca","#ffe789","#dcb450","#724d02","#2a2a28","#a29e97","#d3d0ca","#e3e1dd"],
		["#ffe789","#f7db6e","#eecf63","#dcb450","#c89735","#a97816","#724d02","#2a2a28","#434241","#88847c","#a29e97","#bdb9b1","#d3d0ca","#e3e1dd"],
		["#ffe789","#f7db6e","#eecf63","#dcb450","#c89735","#ba8927","#a97816","#724d02","#463004","#000000","#2a2a28","#434241","#625f5a","#88847c","#a29e97","#bdb9b1","#d3d0ca","#e3e1dd","#edede9","#ffffff"]
		],
	W: 742,
	H: 621,
	radius: 194, // H / 3.2
	ratioRadius : 3.6,
	pie: 0,
	data: 0,
	section : null,
	mode : null,

	setup: function ( mode ) {

		this.mode = mode;

		KJV.data = KG.Data.JobViz;
		KJV.defaultData = KJV.data.tabs[0].elements;
		KJV.init();

		$("#viz-content .loading").remove();

		$(".location-btn").click(function(e){
			e.preventDefault();

			KJV.section = "location";
			KJV.pie.setWedges( KJV.defaultData );
			$(".tab-btn").removeClass("selected");
			$(this).children(".tab-btn").addClass("selected");
		});

		$(".job-btn").click(function(e){
			e.preventDefault();

			if ($(this).children(".tab-btn").hasClass("selected") ) return;

			KJV.section = "type";
			KJV.pie.setWedges(KJV.data.tabs[1].elements);
			$(".tab-btn").removeClass("selected");
			$(this).children(".tab-btn").addClass("selected");
		});

		$(".company-btn").click(function(e){
			e.preventDefault();

			if ($(this).children(".tab-btn").hasClass("selected") ) return;

			KJV.section = "company";
			KJV.pie.setWedges(KJV.data.tabs[2].elements);
			$(".tab-btn").removeClass("selected");
			$(this).children(".tab-btn").addClass("selected");
		});

		$(".experience-btn").click(function(e){
			e.preventDefault();

			if ($(this).children(".tab-btn").hasClass("selected") ) return;

			KJV.section = "level";
			KJV.pie.setWedges(KJV.data.tabs[3].elements);
			$(".tab-btn").removeClass("selected");
			$(this).children(".tab-btn").addClass("selected");
		});
	},

	init:function() {

		var paper = new Raphael( "viz-content", "100%", "100%");
		paper.customAttributes.arc = archFn;

		KJV.section = "location";
		KJV.pie = new KJV.Pie(KJV.W*0.5, KJV.H*0.5,paper, this.mode);
		KJV.pie.setWedges( KJV.defaultData );
	},

	getColorForCount: function(count) {
		var colorset = 0;
		for(var i=0; i<KJV.COLORS.length;i++) {
			if(count<=KJV.COLORS[i].length || (!colorset && i===KJV.COLORS.length-1)) return KJV.COLORS[i];
		}
	},

	resize : function( w, h ) {

		KJV.W = w || KJV.W;
		KJV.H = h || KJV.H;
		KJV.radius = Math.round(KJV.H / KJV.ratioRadius);

		if ( KJV.pie ) {
			KJV.pie.resize(w*0.5, h*0.5, KJV.radius);
		}
	},

	destroy : function() {

		$("#viz-content").empty();
		KJV.pie = null;
		KJV.data = null;
		KJV.section = null;
	}
};


KJV.Pie = function( px, py, paper, mode) {

	this.mode = mode;
	this.radius = KJV.radius;
	this.x = px;
	this.y = py;
	this.wedgedata = [];
	this.wedges = [];
	this.labels = [];
	this.names = [];
	this.paper = paper;
	this.ease = "cubic-bezier(0.645, 0.045, 0.355, 1)";
	this.duration = 800;
	this.hf = 1.4;
	this.defaultangles = [];
	this.mouseset=0;

	this.submenu = false;

	this.updateWedges = function(wd,wid) {

		if(this.wedgedata.length<wd.length) return;

		var wedge=0,
			name=0,
			dir = wid===this.wedges.length-1 ? 1 : -1,
			ca=45 + (wid||wid===0 ? dir * (wd[wid]-this.defaultangles[wid])*0.5 : 0),
			a=0,
			f=1,
			index=0;

		for(var i=0; i<wd.length; i++) {
			a = wd[i];
			if(a===0) continue;
			f = wid==i ? 10 : 0;

			//	wedge
			wedge = this.wedges[index];
			wedge.stop();
			wedge.animate({
				arc:[this.x,this.y, Math.min( Math.ceil(a), 359.9), this.radius+f],
				transform: "r" + ca + "," + this.x + "," + this.y
						},
					450,
					"cubic-bezier(0.165, 0.840, 0.440, 1.000)");

			//	names
			var halfa = (ca+a*0.5-90);
			var lxa = Math.cos(halfa/180*Math.PI);
			var lya = Math.sin(halfa/180*Math.PI);
			var tx = this.x+lxa*((this.radius+f)*1.07);
			var ty = this.y+lya*((this.radius+f)*1.07);
			name = this.names[index];
			var anim = Raphael.animation({
				"x":tx,
				"y":ty,
				transform: "R"+((name.attr("text-anchor")=="end"?halfa+180:halfa)%360)+","+tx+","+ty,
					"fill": wid==i ? "#2a2a28" :"#7a7a78",
					"fill-opacity": 1
						},
					450+Math.round(Math.random()*200),
					"cubic-bezier(0.165, 0.840, 0.440, 1.000)");
			name.stop();
			name.animate(anim.delay(Math.round(Math.random()*100)));

			ca += a;
			index++;
		}

	};

	this.setWedges = function(wd, isSubmenu) {

		if ( this.submenu && !isSubmenu ) {
			this.submenu = false;
			this.hideclose();
		}

		this.currentWD = wd;
		var wedge=0,
			name=0,
			defaultangle=45,
			ca=defaultangle,
			sr=this.wedges.length>0?this.radius*0.75:0,		//	start radius
			sa=this.wedges.length>0?defaultangle:-135,		//	start angle
			a=0,
			colors=KJV.getColorForCount(wd.length);

		//
		//		old wedges & labels
		//

		for(var k=0; k<this.wedges.length; k++) {
			wedge = this.wedges[k];
			wedge.stop();
			wedge.animate({
				arc:[this.x,this.y, 0, this.radius*0.85],
				transform: "r" + (360+defaultangle) + "," + this.x + "," + this.y
						},
					this.duration,
					this.ease,
					this.onwedgehidden);

			name = this.names[k];
			name.remove();
		}

		//
		//		new wedges & labels
		//

		this.wedgedata = wd;
		this.wedges = [];
		this.labels = [];
		this.names = [];
		this.defaultangles = this.getAnglesForValues(wd);

		for(var i=0; i<wd.length; i++) {
			//	angle
			a = this.defaultangles[i];
			if(a===0) continue;

			//
			//	wedges
			//
			wedge = this.paper.path().attr({
				"fill": colors[i%colors.length],
				"stroke-width": 0,
				"stroke-opacity": 0,
				arc: [this.x,this.y, 0, sr] // x, y, valore su, totale, raggio
			}).toFront().rotate(sa,this.x,this.y);

			wedge.stop();
			wedge.animate({
				arc:[this.x,this.y, Math.min( Math.ceil(a), 359.9), this.radius],
				transform: "r" + ca + "," + this.x + "," + this.y
						},
					this.duration,
					this.ease);
			this.wedges.push(wedge);
			//	mouse event
			wedge.data({"wedgeid": i,"pie":this});
			wedge.mouseover( this.onwedgeover );
			wedge.mouseout( this.onwedgeout );
			wedge.click( this.onwedgeclick );

			//
			//	labels
			//

			var halfa = (ca+a*0.5-90);
			var lxa = Math.cos(halfa/180*Math.PI);
			var lya = Math.sin(halfa/180*Math.PI);
			var tx = this.x+lxa*(this.radius*1.2);
			var ty = this.y+lya*(this.radius*1.2);

			//
			//	names
			//
			var sx = this.x+lxa*(this.radius*0.7);
			var sy = this.y+lya*(this.radius*0.7);
			tx = this.x+lxa*(this.radius*1.07);
			ty = this.y+lya*(this.radius*1.07);
			name = this.paper.text(0,0, wd[i].displayName || wd[i].name ).attr({
					"font-family": "KantarBrown-Regular",
					"font-size": "11px",
					"fill": "#7a7a78",
					// "fill": "#2a2a28",
					"x":sx,
					"y":sy,
					"transform": "R"+((halfa>90&&halfa<270?halfa+180:halfa)%360)+","+sx+","+sy,
					"text-anchor": halfa>90&&halfa<270?"end":"start",
					"fill-opacity": 0
				});
			var anim = Raphael.animation({
					"x":tx,
					"y":ty,
					"transform": "R"+((halfa>90&&halfa<270?halfa+180:halfa)%360)+","+tx+","+ty,
					"fill-opacity": 1
						},
					300,
					"cubic-bezier(0.19, 1, 0.22, 1)");
			name.toBack();

			name.stop();
			name.animate(anim.delay(this.duration-200+i*(100/wd.length)));
			this.names.push(name);

			name.data({"wedgeid": i,"pie":this});
			name.mouseover( this.onnameover );
			name.mouseout( this.onnameout );
			name.click( this.onwedgeclick );

			//
			ca += a;

		}


		if ( this.label ) {
			this.label.remove();
			this.label = null;
		}

		if(!this.label) {
			this.label = this.paper.set();
			this.labeltext = paper.text(0,2, "0").attr({
					"font-family": "KantarBrown-Regular",
					"font-size": "20px",
					"fill": "#2a2a28"
				});
			this.label.push(
				this.paper.circle(0,0,28).attr({
					//fill:"#fff",
					fill:"rgb(255, 255, 255)",
					"stroke-width": 0,
					"stroke-opacity": 0
				})
			);
			this.label.push(this.labeltext);

			this.label.attr({
				"transform": "T"+this.x+","+this.y+"S0R-80"
			});
			this.label.data({"pie":this});
			this.label.mouseover(this.onlabelover);
			this.label.mouseout(this.onlabelout);
		}


		if ( this.close ) {
			this.close.remove();
			this.close = null;
		}

		if ( !this.close ) {

			this.close = this.paper.set();
			this.closeshape = this.paper.set();

			var
				rectLeft = this.paper.rect(-15, -2, 30, 4),
				rectRight = this.paper.rect(-2, -15, 4, 30);

			rectLeft.attr({
				"fill" : "#000",
				"stroke-width" : 0,
				"stroke-opacity": 0
			});

			rectRight.attr({
				"fill" : "#000",
				"stroke-width" : 0,
				"stroke-opacity": 0
			});

			rectLeft.node.setAttribute("class","cpointer");
			rectRight.node.setAttribute("class","cpointer");

			this.closeshape.push(
				rectLeft, rectRight
			);

			var circle = this.paper.circle(0,0,28).attr({
				"fill":"#fff",
				"stroke-width": 0,
				"stroke-opacity": 0
			});
			circle.node.setAttribute("class","cpointer");
			this.close.push(circle);

			this.close.push(this.closeshape);

			this.close.attr({
				"transform": "T"+this.x+","+this.y+"S0R45"
			});
			this.close.data({"pie":this});
			this.close.click( this.oncloseclick );
		}

		this.close.toFront();
		this.label.toFront();
	};

	this.getAnglesForValues = function(data,wid) {

		var total = 0, ra = [], f=1, count;
		wid = (wid||wid===0) || -1;
		for(var j=0; j<data.length; j++) {
			f = wid==j ? this.hf : 1;

			count = this.mode == "graduate" ? data[j].countGraduate : ( this.mode == "nongraduate" ? data[j].count - data[j].countGraduate : data[j].count);
			total += count*f;
		}

		for(var i=0; i<data.length; i++) {
			f = wid==i ? this.hf : 1;

			count = this.mode == "graduate" ? data[i].countGraduate : ( this.mode == "nongraduate" ? data[i].count - data[i].countGraduate : data[i].count);
			ra.push( (f*count)/total*360 );
		}

		return ra;
	};

	this.wedgeover = function(wid) {

		var
			angles = this.getAnglesForValues(this.wedgedata,wid),
			count = this.mode == "graduate" ? this.wedgedata[wid].countGraduate : ( this.mode == "nongraduate" ? this.wedgedata[wid].count - this.wedgedata[wid].countGraduate : this.wedgedata[wid].count);

		this.updateWedges(angles,wid);

		if ( KG.Utils.isIE ) {

			this.labeltext.attr({ "text":count });
			this.labeltext.toFront();

		} else {

			var anim = Raphael.animation({"transform":"r0,0,0"}, 500);
			this.labeltext.stop();

			this.labeltext.attr({
				"text":count
			}).rotate(-90);

			this.labeltext.animate(anim.delay(50));
		}
	};

	this.wedgeout = function() {
		this.updateWedges(this.defaultangles);
	};

	this.showlabel = function() {
		this.label.stop();
		this.label.animate({ "transform": "T"+this.x+","+this.y+"S1" },
			300,
			"cubic-bezier(0.175, 0.885, 0.320, 1.275)"
		);
	};

	this.hidelabel = function() {

		this.label.stop();
		this.label.animate({ "transform": "T"+this.x+","+this.y+"S0R-80" },
			300,
			"cubic-bezier(0.19, 1, 0.22, 1)"
		);
	};

	this.showclose = function() {

		this.close.stop();
		this.close.animate({ "transform": "T"+this.x+","+this.y+"S1R45" },
			300,
			"cubic-bezier(0.175, 0.885, 0.320, 1.275)"
		);
	};

	this.hideclose = function() {

		this.close.stop();
		this.close.animate({ "transform": "T"+this.x+","+this.y+"S0R-35" },
			300,
			"cubic-bezier(0.19, 1, 0.22, 1)"
		);
	};

	//
	//		event listeners
	//

	this.onwedgeover = function() {
		this.data("pie").wedgeover(this.data("wedgeid"));
		this.data("pie").showlabel();
	};

	this.onwedgeout = function() {

		if ( this.data("pie") ) {
			this.data("pie").wedgeout(this.data("wedgeid"));
			this.data("pie").hidelabel();
		}
	};

	this.onlabelover = function() {

		if ( this.data("pie").submenu )
			this.data("pie").hidelabel();
		else
			this.data("pie").showlabel();
	};

	this.onlabelout = function() {
		this.data("pie").hidelabel();
	};

	this.onwedgehidden = function() {
		this.remove();
	};

	this.onwedgeclick = function() {

		var
			self = this.data("pie"),
			index = this.data("wedgeid"),
			nextWD = self.currentWD[index].elements;

		if ( nextWD ) {
			self.submenu = true;
			self.showclose();
			self.setWedges( nextWD, true );
		} else {

			$("html, body").stop().animate({
				"scrollTop" : 0
			}, 500);

			Backbone.history.navigate( "/careers/job-search?" + KJV.section + "=" + self.wedgedata[index].name + ( self.mode == "graduate" ? "&special=graduate" : (self.mode == "nongraduate" ? "&special=non-graduate" : "") ), true );
		}
	};

	this.onnameover = function() {
		this.attr({
			"fill" : "#2a2a28",
			"fill-opacity": 1
		});
	};

	this.onnameout = function() {
		this.attr({
			"fill" : "#7a7a78",
			"fill-opacity": 1
		});
	};

	this.oncloseclick = function() {

		this.data("pie").hideclose();
		this.data("pie").setWedges( KJV.defaultData );
	};


	//
	//		resize
	//

	this.resize = function(px, py, radius) {

		this.x = px;
		this.y = py;
		this.radius = radius;

		if ( this.currentWD ) {

			if ( !KG.Utils.isIE ) {

				var wedge=0,
					name=0,
					defaultangle=45;

				for(var k=0; k<this.wedges.length; k++) {
					wedge = this.wedges[k];
					wedge.stop();
					wedge.animate({
						arc:[this.x,this.y, 0, this.radius*0.85],
						transform: "r" + (360+defaultangle) + "," + this.x + "," + this.y
								},
							0,
							this.ease,
							this.onwedgehidden);

					name = this.names[k];
					name.remove();
				}

				this.label.attr({
					"transform": "T"+this.x+","+this.y+"S0R-80"
				});
				this.close.attr({
					"transform": "T"+this.x+","+this.y+"S0R45"
				});
			}

			var
				self = this,
				hasSubmenu = this.submenu;

			clearTimeout(this.timeout);
			this.timeout = setTimeout( function() {
				self.setWedges( self.currentWD );
				self.submenu = hasSubmenu;
				if ( self.submenu ) self.showclose();
			}, 100 );

		}
	};

};


KG.Utils = KG.Utils || {};

KG.Utils.TRANSITION_END = 'webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd';
KG.Utils.isiOS = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)));
KG.Utils.isiPad = navigator.userAgent.match(/iPad/i);
KG.Utils.isRetina = (window.devicePixelRatio > 1);
KG.Utils.isFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
KG.Utils.isIE = (navigator.appVersion.indexOf("MSIE") != -1);
KG.Utils.isIE7 = (navigator.appVersion.indexOf("MSIE 7.") != -1);
KG.Utils.isNexus7 = (navigator.appVersion.indexOf("Nexus 7") != -1);
KG.Utils.isGalaxyTab = (navigator.appVersion.indexOf("GT-P5110") != -1);
KG.Utils.isUS = (navigator.userLanguage ? navigator.userLanguage.indexOf("US") != -1 : false) || (navigator.language ? navigator.language.indexOf("US") != -1 : false);

KG.Utils._leadingZero = function( num ) {
	return ( num < 10 ) ? '0'+num : num;
};

KG.Utils.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KantarOAuthApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var name = HttpContext.Request.LogonUserIdentity.Name;
            ViewBag.Title = name;
            Redirect("http://localhost:3979/api/auth/receive?code=Worksing !");
            
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LogSearchResults.Controllers
{
    //public class CarRESTService
    //{

    //    readonly string uri = "http://localhost:2236/api/cars";

    //    public async Task<List<Car>> GetCarsAsync()
    //    {

    //        using (HttpClient httpClient = new HttpClient())
    //        {

    //            return JsonConvert.DeserializeObject<List<Car>>(
    //                await httpClient.GetStringAsync(uri)
    //            );
    //        }
    //    }
    //}
    public class delController : Controller
    {
        // GET: del
        public ActionResult Index()
        {
            return View();
        }

    }
}
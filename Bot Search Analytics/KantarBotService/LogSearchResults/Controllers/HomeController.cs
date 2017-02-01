using LogSearchResults.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace LogSearchResults.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            var s = new TestApi();
                
            var l = new SearchLog
            {
                instance = "as",
                searchtype = "delete",
                username = "delete",
                keyword = "delete"
            };

             s.PostRecommendationLog(new AssetRecommendation { AssetID = 1, RecommendedAssetID = 99 });
            //var r = s.PutSearchLog();
            return View();
        }
    }
    public class TestApi
    {

        readonly string uri = "http://localhost:52727/api/SearchLog";

        public async Task<List<SearchLog>> PutSearchLog()
        {

            using (HttpClient httpClient = new HttpClient())
            {

                return JsonConvert.DeserializeObject<List<SearchLog>>(
                    await httpClient.GetStringAsync(uri)
                );
            }
        }

        public async Task<HttpResponseMessage> PostRecommendationLog(AssetRecommendation l)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                return (
                await httpClient.PostAsJsonAsync<AssetRecommendation>("http://localhost:52727/api/AssetRecommendations", l)
                //return JsonConvert.DeserializeObject<List<SearchLog>>(
                //    await httpClient.GetStringAsync(uri)
                );
            }

        }

        public async Task<HttpResponseMessage> PostSearchLog(SearchLog l)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                return (
                await httpClient.PostAsJsonAsync<SearchLog>(uri, l)
                //return JsonConvert.DeserializeObject<List<SearchLog>>(
                //    await httpClient.GetStringAsync(uri)
                );
            }

        }
    }
}

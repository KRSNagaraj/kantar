using KantarBotService.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace KantarBotService.Controllers
{
    public class oauthController : Controller
    {
        // GET: oauth
        public ActionResult Index()
        {
            return View();
        }

        [Route("api/auth/receivetoken")]
        [HttpGet()]
        public async Task<string> ReceiveToken(string code = null, string state = null)
        {
            if (!string.IsNullOrEmpty(code) && !string.IsNullOrEmpty(state))
            {

                common.UserName = code;
                string firstName = code;

                var reply = common.CurrentActivity.CreateReply("Welcome, " + firstName + ". How can I help you?");

                //await common.Connector.Conversations.ReplyToActivityWithHttpMessagesAsync(reply);

                return "Congratulations! You have been authenticated as " + firstName + " and can now return the Clippy for OfficePoint experience.";
            }

            return "Something went wrong - please try again!";
        }
    }
}
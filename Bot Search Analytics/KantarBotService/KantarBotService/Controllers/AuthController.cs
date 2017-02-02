using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.Dialogs;
using System.Collections.Generic;
using KantarBotService.Dialog;
using Autofac;
using KantarBotService.App_Start;

namespace KantarBotService.Controllers
{
    [BotAuthentication]
    public class AuthController : ApiController
    {

        //localhost:49450/

        [Route("api/auth/home")]
        [HttpGet]
        public async Task<HttpResponseMessage> Home(string UserId)
        {
            var resp = Request.CreateResponse(System.Net.HttpStatusCode.Found);
            //resp.Headers.Location = CreateOAuthCodeRequestUri(UserId);
            return resp;
        }

        [Route("api/auth/receivetoken")]
        [HttpGet()]
        public async Task<string> ReceiveToken(string code = null, string state = null)
        {
            if (!string.IsNullOrEmpty(code) && !string.IsNullOrEmpty(state))
            {

                common.UserName = code;
                string firstName = common.UserName;

                var reply = common.CurrentActivity.CreateReply("Welcome, " + firstName + ". How can I help you?");

                await common.Connector.Conversations.ReplyToActivityAsync(reply);

                return "Congratulations! You have been authenticated as " + firstName + " and can now return the Clippy for OfficePoint experience.";
            }

            return "Something went wrong - please try again!";
        }
    }
}
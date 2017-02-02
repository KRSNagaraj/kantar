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
using System.Web;

namespace KantarBotService.Controllers
{
    [BotAuthentication]
    public class MessagesController : ApiController
    {
        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            common.Connector = new ConnectorClient(new Uri(activity.ServiceUrl));
            common.CurrentActivity = activity;

            if (activity.Type == ActivityTypes.Message)
            {
                //ConnectorClient connector = new ConnectorClient(new Uri(activity.ServiceUrl));
                //// calculate something for us to return
                //int length = (activity.Text ?? string.Empty).Length;

                //// return our reply to the user

                //Activity reply = activity.CreateReply($"Apologies, we still working on enhancing this search engine, however, we record your request : ** { activity.Text} ** ");
                ////Activity reply = activity.CreateReply($"You sent {activity.Text} which was {length} characters");
                ////await connector.Conversations.ReplyToActivityAsync(reply);
                //await Conversation.SendAsync(activity, () => new CardsDialog());

                //var name = HttpContext.Current.Request.LogonUserIdentity.Name;
                //string prompt = "Welcome Kantar " + name + " !";
                ////string prompt = $"Please authenticate your account at {loginUri.ToString()} to associate your user identity to your Microsoft Id.";
                //var reply = common.CurrentActivity.CreateReply(prompt);
                //string prompt;
                //Activity reply =null;
                ////await common.Connector.Conversations.ReplyToActivityAsync(reply);

                //if (common.UserName == "" || common.UserName == null)
                //{
                //    //var loginUri = new Uri("http://http://kantarsearchanalytics-v01.azurewebsites.net/api/auth/receivetoken/?code=Working%20!&state=postlogin");
                //    ////string prompt = $"Please authenticate your account at {loginUri.ToString()} to associate your user identity to your Microsoft Id.";
                //    //prompt = "Welcome Kantar " + common.UserName + " !";
                //    //reply = common.CurrentActivity.CreateReply(prompt);

                //    //await common.Connector.Conversations.ReplyToActivityAsync(reply);
                //}
                //var loginUri = new Uri("http://kantarsearchanalytics-v01.azurewebsites.net/api/auth/receivetoken/?code=Working&state=postlogin");
                ////string prompt = $"Please authenticate your account at {loginUri.ToString()} to associate your user identity to your Microsoft Id.";
                //prompt = "Welcome Kantar " + common.UserName + " !";
                //reply = common.CurrentActivity.CreateReply(prompt + " " + loginUri.ToString());
                //await common.Connector.Conversations.ReplyToActivityAsync(reply);


                using (var scope = DialogModule.BeginLifetimeScope(Conversation.Container, activity))
                {
                    await Conversation.SendAsync(activity, () => scope.Resolve<IDialog<object>>());
                }
                //await Conversation.SendAsync(activity, () => new BaseDialog());
            }
            else
            {
                HandleSystemMessage(activity);
            }
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == ActivityTypes.DeleteUserData)
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == ActivityTypes.ConversationUpdate)
            {
                // Handle conversation state changes, like members being added and removed
                // Use Activity.MembersAdded and Activity.MembersRemoved and Activity.Action for info
                // Not available in all channels
                    IConversationUpdateActivity update = message;
                    using (var scope = DialogModule.BeginLifetimeScope(Conversation.Container, message))
                    {
                        var client = new ConnectorClient(new Uri(message.ServiceUrl)); ;//scope.Resolve<IConnectorClient>();
                        if (update.MembersAdded.Any())
                        {
                            var reply = message.CreateReply();
                            var newMembers = update.MembersAdded?.Where(t => t.Id != message.Recipient.Id);
                            foreach (var newMember in newMembers)
                            {

                                reply.Attachments = new List<Attachment>();
                                reply.Attachments.Add(new Attachment()
                                {
                                    //ContentUrl = "https://upload.wikimedia.org/wikipedia/en/0/0c/Kantar_logo.png",
                                    ContentUrl = Url.Content("/img/kantar_logo_02.png"),
                                    ContentType = "image/jpeg",
                                    Name = "Welcome Kantar User! ",

                                });
                                client.Conversations.ReplyToActivityAsync(reply);

                                //reply = message.CreateReply();
                                //reply.Text = "Welcome Kantar ";
                                //if (!string.IsNullOrEmpty(newMember.Name))
                                //{
                                //    reply.Text += $" {newMember.Name}";
                                //}
                                //reply.Text += "!";
                                //client.Conversations.ReplyToActivityAsync(reply);
                            }
                        }
                    }
                
            }
            else if (message.Type == ActivityTypes.ContactRelationUpdate)
            {
                // Handle add/remove from contact lists
                // Activity.From + Activity.Action represent what happened
            }
            else if (message.Type == ActivityTypes.Typing)
            {
                // Handle knowing tha the user is typing
            }
            else if (message.Type == ActivityTypes.Ping)
            {
            }

            return null;
        }
    }
}
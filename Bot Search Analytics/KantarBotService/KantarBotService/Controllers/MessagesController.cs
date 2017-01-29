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

namespace KantarBotService
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

                                reply = message.CreateReply();
                                reply.Text = "Welcome Kantar ";
                                if (!string.IsNullOrEmpty(newMember.Name))
                                {
                                    reply.Text += $" {newMember.Name}";
                                }
                                reply.Text += "!";
                                client.Conversations.ReplyToActivityAsync(reply);
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
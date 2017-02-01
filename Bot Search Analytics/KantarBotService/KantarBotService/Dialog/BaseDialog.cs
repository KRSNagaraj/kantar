using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Search.Azure.Services;
using Microsoft.Bot.Builder.Internals.Fibers;
using KantarBotService.Map;
using Microsoft.Bot.Builder.Dialogs.Internals;

namespace KantarBotService.Dialog
{
    [Serializable]
    public class BaseDialog : IDialog<object>
    {
        private static AzureSearchClient _searchClient = new AzureSearchClient(new AssetSearchMapper());


        private const string SearchOption = "Search";
        private const string SemanticSearchOption = "Semantic  Search";
        //private const string RecommendationSearchOption = "Recommendation Search";
        private const string ShareIdeaOption = "Share your ideas";

        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }

        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;

            if (message.Text.ToLower().Contains("help") || message.Text.ToLower().Contains("support") || message.Text.ToLower().Contains("problem"))
            {
                await context.Forward(new TicketDialog(), this.ResumeAfterSupportDialog, message, CancellationToken.None);
            }
            else
            {
                this.ShowOptions(context);
            }
        }

        private void ShowOptions(IDialogContext context)
        {
            PromptDialog.Choice(context, this.OnOptionSelected, new List<string>()
            { SearchOption,  SemanticSearchOption, ShareIdeaOption}
            , "Do you want to find something?", "Not a valid option", 3);
        }

        private async Task OnOptionSelected(IDialogContext context, IAwaitable<string> result)
        {
            try
            {
                string optionSelected = await result;
                //var activity = context.MakeMessage();
                switch (optionSelected)
                {
                    case SearchOption:
                        //context.Call(new SearchIntroDialog(_searchClient), this.ResumeAfterOptionDialog);
                        //using (var scope = DialogModule.BeginLifetimeScope(Conversation.Container, activity))
                        //{
                        //using (var scope = DialogModule.BeginLifetimeScope(Conversation.Container, null))
                        //{
                        //    await Conversation.SendAsync(activity, () => scope.Resolve<IDialog<object>>());
                        //}
                        context.Call(new SearchIntroDialog(_searchClient), this.ResumeAfterOptionDialog);
                        //}
                        break;

                    case SemanticSearchOption:
                        context.Call(new SemanticDialog(), this.ResumeAfterOptionDialog);
                        break;

                    case ShareIdeaOption:
                        context.Call(new ShareIdeasDialog(), this.ResumeAfterOptionDialog);
                        break;
                }
            }
            catch (TooManyAttemptsException ex)
            {
                await context.PostAsync($"Ooops! Too many attemps :(. But don't worry, I'm handling that exception and you can try again!");

                context.Wait(this.MessageReceivedAsync);
            }
        }

        private async Task ResumeAfterSupportDialog(IDialogContext context, IAwaitable<int> result)
        {
            var ticketNumber = 0; //  await result;

            await context.PostAsync($"Thanks for contacting our support team. Your ticket number is {ticketNumber}.");
            context.Wait(this.MessageReceivedAsync);
        }

        private async Task ResumeAfterOptionDialog(IDialogContext context, IAwaitable<object> result)
        {
            try
            {
                var message = await result;
            }
            catch (Exception ex)
            {
                await context.PostAsync($"Failed with message: {ex.Message}");
            }
            finally
            {
                context.Wait(this.MessageReceivedAsync);
            }
        }
    }
}

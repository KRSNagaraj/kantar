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
using Microsoft.Bot.Builder.FormFlow;
using KantarBotService.AzureSearch;
using KantarBotService.App_Start;

namespace KantarBotService.Dialog
{
    [Serializable]
    public class BaseDialog : IDialog<object>
    {
        private static AzureSearchClient _searchClient = new AzureSearchClient(new AssetSearchMapper());
        private static AzureSearchClient _semanticSearchClient = new AzureSearchClient(new AssetSearchMapper());


        private const string SearchOption = "Search";
        private const string SemanticSearchOption = "Semantic  Search";
        private const string RecommendationSearchOption = "Recommendation For you";
        private const string ShareIdeaOption = "Share your ideas";
        public string UserName = "";

        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }

        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;

            if (message.Text.ToLower().Contains("help") || message.Text.ToLower().Contains("support") || message.Text.ToLower().Contains("problem"))
            {
                await context.Forward(new ShareIdeasDialog(), this.ResumeAfterSupportDialog, message, CancellationToken.None);
            }
            else
            {
                if (UserName == "" || UserName == null)
                {
                    await context.PostAsync("Welcome to the Kantar Bot!");
                    var loginFormDialog = FormDialog.FromForm(this.BuildLoginForm, FormOptions.PromptInStart);

                    context.Call(loginFormDialog, this.ShowOptions);
                }
                else
                {
                    this.ShowOptions(context);
                }
                //await context.Wait<LoginData>(_LoginWorkflow); //._LoginWorkflow(context);
            }
        }

        public async Task _LoginWorkflow(IDialogContext context, IAwaitable<LoginData> data)
        {
            //var result = AzureSearch.SearchHelper.search(context.UserData.ToString());
            //await context.PostAsync(result);

            var loginFormDialog = FormDialog.FromForm(this.BuildLoginForm, FormOptions.PromptInStart);

            context.Call(loginFormDialog, this.ShowOptions);
        }

        private IForm<LoginData> BuildLoginForm()
        {
            OnCompletionAsyncDelegate<LoginData> StartkantarBot = async (context, state) =>
            {
                UserName = state.Name;
                await context.PostAsync($"Thank you and Welcome {state.Name}");
                //await context.PostAsync($"Ok. Searching for Hotels in {state.Destination} from {state.CheckIn.ToString("MM/dd")} to {state.CheckIn.AddDays(state.Nights).ToString("MM/dd")}...");
            };

            return new FormBuilder<LoginData>()
                .Field(nameof(LoginData.Name))
                .OnCompletion(StartkantarBot)
                .Build();
        }

        private async Task ShowOptions(IDialogContext context, IAwaitable<LoginData> data)
        {
            await ShowOptions(context);
        }
        private async Task ShowOptions(IDialogContext context)
        {
            PromptDialog.Choice(context, this.OnOptionSelected, new List<string>()
            { SearchOption,  SemanticSearchOption, RecommendationSearchOption, ShareIdeaOption}
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
                        context.Call(new SemanticSearchIntroDialog(_semanticSearchClient), this.ResumeAfterOptionDialog);
                        break;

                    case ShareIdeaOption:
                        context.Call(new ShareIdeasDialog(), this.ResumeAfterSupportDialog);
                        break;

                    case RecommendationSearchOption:
                        context.Call(new RFYDialog(), this.ResumeAfterSupportDialog);
                        break;
                }
            }
            catch (TooManyAttemptsException ex)
            {
                await context.PostAsync($"Ooops! Too many attemps :(. But don't worry, I'm handling that exception and you can try again!");

                context.Wait(this.MessageReceivedAsync);
            }
        }

        private async Task ResumeAfterSupportDialog(IDialogContext context, IAwaitable<object> result)
        {
            //var ticketNumber = 0; //  await result;
          
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

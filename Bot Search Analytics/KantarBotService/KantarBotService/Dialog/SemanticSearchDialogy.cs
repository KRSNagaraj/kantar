using System;
using Search.Dialogs;
using Search.Services;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using System.Linq;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Internals.Fibers;
using System.Collections.Generic;
using Search.Models;

namespace KantarBotService.Dialog
{
    [Serializable]
    public class SemanticSearchIntroDialog : IDialog<object>
    {
        private ISearchClient searchClient;
        private SemanticSearchDialog _assetSearchDialog;


        public SemanticSearchIntroDialog(ISearchClient searchClient)
        {
            SetField.NotNull(out this.searchClient, nameof(searchClient), searchClient);
            _assetSearchDialog = new SemanticSearchDialog(this.searchClient);
        }

        public Task StartAsync(IDialogContext context)
        {
            context.Call(_assetSearchDialog, this.Done);
            //context.Wait(this.StartSearchDialog);
            return Task.CompletedTask;
        }

        public Task StartSearchDialog(IDialogContext context, IAwaitable<IMessageActivity> input)
        {
            context.Call(_assetSearchDialog, this.Done);
            return Task.CompletedTask;
        }

        public async Task Done(IDialogContext context, IAwaitable<IList<SearchHit>> input)
        {
            var selection = await input;

            //if (selection != null && selection.Any())
            //{
            //    string list = string.Join("\n\n", selection.Select(s => $"* {s.Title} ({s.Key})"));
            //    await context.PostAsync($"Done! For future reference, you selected these properties:\n\n{list}");
            //}

            context.Done<object>(null);
        }
    }
    [Serializable]
    public class SemanticSearchDialog : SearchDialog
    {
        private static readonly string[] TopRefiners = { "countrylist", "brandinsights", "sector" };

        public SemanticSearchDialog(ISearchClient searchClient) : base(searchClient, multipleSelection: false)
        {
        }

        protected override string[] GetTopRefiners()
        {
            return TopRefiners;
        }

       public override async Task Search(IDialogContext context, IAwaitable<string> input)
        {
            string text = input != null ? await input : null;

            if (text != null)
            {
                this.QueryBuilder.SearchText = text;
                var response = await this.ExecuteSearchAsync();
                if (response.Results.Count() == 0)
                {
                    await this.NoResultsConfirmRetry(context);
                }
                else
                {
                    this.QueryBuilder.SearchText = response.Results.LastOrDefault().Context ==null ? response.Results.LastOrDefault().Recommend:
                                    response.Results.LastOrDefault().Context;
                    input = null;
                    await base.Search(context, input);
                }
            }
            else
                await base.Search(context, input);

        }
    }
}

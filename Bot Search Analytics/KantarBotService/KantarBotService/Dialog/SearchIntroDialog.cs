using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Internals.Fibers;
using Microsoft.Bot.Connector;
using Search.Models;
using Search.Services;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace KantarBotService.Dialog
{

    [Serializable]
    public class SearchIntroDialog : IDialog<object>
    {
        private ISearchClient searchClient;
        private AssetSearchDialog _assetSearchDialog;
        

        public SearchIntroDialog(ISearchClient searchClient)
        {
            SetField.NotNull(out this.searchClient, nameof(searchClient), searchClient);
            _assetSearchDialog = new AssetSearchDialog(this.searchClient);
        }

        public Task StartAsync(IDialogContext context)
        {
            context.Call(_assetSearchDialog, this.Done );
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

            if (selection != null && selection.Any())
            {
                string list = string.Join("\n\n", selection.Select(s => $"* {s.Title} ({s.Key})"));
                await context.PostAsync($"Done! For future reference, you selected these properties:\n\n{list}");
            }

            context.Done<object>(null);
        }
    }
}

namespace Search.Dialogs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Bot.Builder.Dialogs;
    using Microsoft.Bot.Builder.Internals.Fibers;
    using Microsoft.Bot.Connector;
    using Search.Models;
    using Search.Services;

    [Serializable]
    public abstract class SearchDialog : IDialog<IList<SearchHit>>
    {
        protected readonly ISearchClient SearchClient;
        protected readonly SearchQueryBuilder QueryBuilder;
        protected readonly PromptStyler HitStyler;
        protected readonly bool MultipleSelection;
        private readonly IList<SearchHit> selected = new List<SearchHit>();

        private bool firstPrompt = true;
        private IList<SearchHit> found;
        private bool isRecommend = false;

        public SearchDialog(ISearchClient searchClient, SearchQueryBuilder queryBuilder = null, PromptStyler searchHitStyler = null, bool multipleSelection = false)
        {
            SetField.NotNull(out this.SearchClient, nameof(searchClient), searchClient);

            this.QueryBuilder = queryBuilder ?? new SearchQueryBuilder();
            this.HitStyler = searchHitStyler ?? new SearchHitStyler();
            this.MultipleSelection = multipleSelection;
        }

        public Task StartAsync(IDialogContext context)
        {
            return this.InitialPrompt(context);
        }

        public async Task Search(IDialogContext context, IAwaitable<string> input)
        {
            string text = input != null ? await input : null;
            if (this.MultipleSelection && text != null && text.ToLowerInvariant() == "list")
            {
                await this.ListAddedSoFar(context);
                await this.InitialPrompt(context);
            }
            else
            {
                if (text != null)
                {
                    this.QueryBuilder.SearchText = text;
                }

                var response = await this.ExecuteSearchAsync();

                if (response.Results.Count() == 0)
                {
                    await this.NoResultsConfirmRetry(context);
                }
                else if( isRecommend == false)
                {
                    var message = context.MakeMessage();
                    this.found = response.Results.ToList();
                    this.HitStyler.Apply(
                        ref message,
                        "Here are a few good options I found:",
                        this.found.ToList().AsReadOnly());
                    await context.PostAsync(message);
                    await context.PostAsync(
                        this.MultipleSelection ?
                        "You can select one or more to add to your list, *list* what you've selected so far, *refine* these results, see *more* or search *again*." :
                        "You can select one, *refine* these results, see *more* or search *again*.");
                    context.Wait(this.ActOnSearchResults);
                }
                else
                    this.found = response.Results.ToList();

            }
        }

        protected virtual Task InitialPrompt(IDialogContext context)
        {
            string prompt = "What would you like to search for?";

            if (!this.firstPrompt)
            {
                prompt = "What else would you like to search for?";
                if (this.MultipleSelection)
                {
                    prompt += " You can also *list* all items you've added so far.";
                }
            }

            this.firstPrompt = false;

            PromptDialog.Text(context, this.Search, prompt);
            return Task.CompletedTask;
        }

        protected virtual Task NoResultsConfirmRetry(IDialogContext context)
        {
            PromptDialog.Confirm(context, this.ShouldRetry, "Sorry, I didn't find any matches. Do you want to retry your search?");
            return Task.CompletedTask;
        }

        protected virtual async Task ListAddedSoFar(IDialogContext context)
        {
            var message = context.MakeMessage();
            if (this.selected.Count == 0)
            {
                await context.PostAsync("You have not added anything yet.");
            }
            else
            {
                this.HitStyler.Apply(ref message, "Here's what you've added to your list so far.", this.selected.ToList().AsReadOnly());
                await context.PostAsync(message);
            }
        }

        protected virtual async Task AddSelectedItem(IDialogContext context, string selection)
        {
            SearchHit hit = this.found.SingleOrDefault(h => h.Key == selection);
            if (hit == null)
            {
                await this.UnkownActionOnResults(context, selection);
            }
            else
            {
                if (!this.selected.Any(h => h.Key == hit.Key))
                {
                    this.selected.Add(hit);
                }

                if (this.MultipleSelection)
                {
                    await context.PostAsync($"'{hit.Title}' was added to your list!");
                    PromptDialog.Confirm(context, this.ShouldContinueSearching, "Do you want to continue searching and adding more items?");
                }
                else
                {
                    context.Done(this.selected);
                }
            }
        }

        protected virtual async Task UnkownActionOnResults(IDialogContext context, string action)
        {
            await context.PostAsync("Not sure what you mean. You can search *again*, *refine*, *list* or select one of the items above. Or are you *done*?");
            context.Wait(this.ActOnSearchResults);
        }

        protected virtual async Task ShouldContinueSearching(IDialogContext context, IAwaitable<bool> input)
        {
            try
            {
                bool shouldContinue = await input;
                if (shouldContinue)
                {
                    await this.InitialPrompt(context);
                }
                else
                {
                    context.Done(this.selected);
                }
            }
            catch (TooManyAttemptsException)
            {
                context.Done(this.selected);
            }
        }

        protected void SelectRefiner(IDialogContext context)
        {
            var dialog = new SearchSelectRefinerDialog(this.GetTopRefiners(), this.QueryBuilder);
            context.Call(dialog, this.Refine);
        }

        protected virtual async Task SelectRecommender(IDialogContext context, string choice)
        {
            var message = context.MakeMessage();
            if (choice.Split(':').Count() == 1)
            {
                await context.PostAsync("You have not added anything yet.");
            }
            else
            {
                this.selected.Clear();
                //KantarBotDB.SearchBotDB _db = new KantarBotDB.SearchBotDB();
                //var aa = _db.AssetRecommendations.Where(f => f.ID.ToString() == choice.Split(':')[1]).ToList();
                var _oldSearchtext = this.QueryBuilder.SearchText;
                this.QueryBuilder.SearchText = choice.Split(':')[1].ToString();
                this.isRecommend = true;
                await this.Search(context, null);

                this.HitStyler.Apply(
                       ref message,
                       "Here are a few good options I found:",
                       this.found.ToList().AsReadOnly());

                this.QueryBuilder.SearchText = _oldSearchtext;
                this.isRecommend = false;
                await context.PostAsync(message);

                //this.selected.Add(
                //    new SearchHit { Key = new Random().Next(1, 99).ToString(), Title = "Forecast Architect", Description = "Forecast Architect is an Excel-based software program which allows you to apply insight and assumptions to model any number of possible scenarios for products based on epidemiology or sales volume. The program can establish baseline trends in treatment rates, market share and market size using utility trends."
                //    , PictureUrl = "http://fr.kantar.com/media/1493472/sucre_SennepImage.jpg"
                //    });
                //this.selected.Add(
                //    new SearchHit { Key = new Random().Next(1, 99).ToString(), Title = "Global MONITOR" ,Description = "Our Oncology Market Access service analyses critical shifts in the US market most likely to affect reimbursement, pricing and utilisation of cancer drugs.  Our analyses are based on qualitative and quantitative market research and our team’s in-depth industry experience."
                //    ,
                //        PictureUrl = "http://cn.kantar.com/media/1469130/single_consumer_sennep_SennepImage.jpg"
                //    });
                //this.selected.Add(
                //    new SearchHit { Key = new Random().Next(1,99).ToString(), Title = "Mobile Behavioral Data" });
                //this.selected.Add(
                //    new SearchHit { Key = new Random().Next(1, 99).ToString(), Title = "Worldpanel ComTech / Telecoms", Description = "Kantar Worldpanel ComTech provides mobile phone, tablet and quad-play ownership, purchasing and usage trends in 13 countries. Our ComTech service can provide insights and analysis around the following broad areas: installed base & sales, consumer demographics, usage including named app detail, value (spend on handset, bills & apps), tariff (data, call & SMS allowance), drivers of handset purchase, customer movement (churn, loyalty & switching), Net Promoter Score, customer journey, and forecasting."
                //    ,
                //        PictureUrl = "http://uk.kantar.com/media/1480463/gettyimages-551688983_SennepImage.jpg"
                //    });
                //this.HitStyler.Apply(ref message, "Here's are the recommendated assets for the selection -.", this.selected.OrderBy(s => s.Key).ToList().AsReadOnly());
                //await context.PostAsync(message);
            }
        }

        protected async Task Refine(IDialogContext context, IAwaitable<string> input)
        {
            string refiner = await input;

            if (!string.IsNullOrWhiteSpace(refiner))
            {
                var dialog = new SearchRefineDialog(this.SearchClient, refiner, this.QueryBuilder);
                context.Call(dialog, this.ResumeFromRefine);
            }
            else
            {
                await this.Search(context, null);
            }
        }

        protected async Task ResumeFromRefine(IDialogContext context, IAwaitable<string> input)
        {
            await input; // refiner filter is already applied to the SearchQueryBuilder instance we passed in
            await this.Search(context, null);
        }

        protected async Task<GenericSearchResult> ExecuteSearchAsync()
        {
            return await this.SearchClient.SearchAsync(this.QueryBuilder);
        }

        protected abstract string[] GetTopRefiners();

        private async Task ShouldRetry(IDialogContext context, IAwaitable<bool> input)
        {
            try
            {
                bool retry = await input;
                if (retry)
                {
                    await this.InitialPrompt(context);
                }
                else
                {
                    context.Done<IList<SearchHit>>(null);
                }
            }
            catch (TooManyAttemptsException)
            {
                context.Done<IList<SearchHit>>(null);
            }
        }

        private async Task ActOnSearchResults(IDialogContext context, IAwaitable<IMessageActivity> input)
        {
            var activity = await input;
            var choice = activity.Text;

            switch (choice.ToLowerInvariant().Split(':')[0])
            {
                case "again":
                case "reset":
                    this.QueryBuilder.Reset();
                    await this.InitialPrompt(context);
                    break;

                case "more":
                    this.QueryBuilder.PageNumber++;
                    await this.Search(context, null);
                    break;

                case "refine":
                    this.SelectRefiner(context);
                    break;

                case "list":
                    await this.ListAddedSoFar(context);
                    context.Wait(this.ActOnSearchResults);
                    break;

                case "done":
                    context.Done(this.selected);
                    break;

                case "recommended":
                    await this.SelectRecommender(context, choice);
                    context.Wait(this.ActOnSearchResults);
                    break;

                default:
                    await this.AddSelectedItem(context, choice);
                    break;
            }
        }
    }
}

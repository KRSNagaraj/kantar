using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Search.Models;
using System.Collections.Generic;
using System.Linq;

namespace KantarBotService.Dialog
{
    [Serializable]
    public class RFYDialog : IDialog<object>
    {
        private IList<SearchHit> selected = new List<SearchHit>();

        public async Task StartAsync(IDialogContext context)
        {
            //context.Fail(new NotImplementedException("Semantic Search option is not implemented and currently its in progress..."));

            await context.PostAsync($"PLease find the below recommended assets based on your interest");

            //context.Wait(this.MessageReceivedAsync);
            var message = context.MakeMessage();
            var a = work(message);
            await context.PostAsync(a);
            context.Done(message);
        }

        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;
            var a = work(message);
            await context.PostAsync(a);
            context.Done(await result);
        }
        private IMessageActivity work(IMessageActivity message)
        {
            _getList();
            var cards = this.selected.Select(h => new ThumbnailCard
            {
                Title = h.Title,
                Subtitle = h.Subtitle,
                Images = new[] { new CardImage(h.PictureUrl) },
                Buttons = new[] { new CardAction(ActionTypes.OpenUrl, "Open ⇗", value: h.DocURL) },
                Text = h.Description
            });

            message.AttachmentLayout = AttachmentLayoutTypes.Carousel;
            message.Attachments = cards.Select(c => c.ToAttachment()).ToList();
            return message;
        }
        private void _getList()
        {

            this.selected.Add(
                new SearchHit
                {
                    Key = new Random().Next(1, 99).ToString(),
                    Title = "Forecast Architect",
                    Description = "Forecast Architect is an Excel-based software program which allows you to apply insight and assumptions to model any number of possible scenarios for products based on epidemiology or sales volume. The program can establish baseline trends in treatment rates, market share and market size using utility trends."
                ,
                    PictureUrl = "http://fr.kantar.com/media/1493472/sucre_SennepImage.jpg"
                });
            this.selected.Add(
                new SearchHit
                {
                    Key = new Random().Next(1, 99).ToString(),
                    Title = "Global MONITOR",
                    Description = "Our Oncology Market Access service analyses critical shifts in the US market most likely to affect reimbursement, pricing and utilisation of cancer drugs.  Our analyses are based on qualitative and quantitative market research and our team’s in-depth industry experience."
                ,
                    PictureUrl = "http://cn.kantar.com/media/1469130/single_consumer_sennep_SennepImage.jpg"
                });
            this.selected.Add(
                new SearchHit { Key = new Random().Next(1, 99).ToString(), Title = "Mobile Behavioral Data" });
            this.selected.Add(
                new SearchHit
                {
                    Key = new Random().Next(1, 99).ToString(),
                    Title = "Worldpanel ComTech / Telecoms",
                    Description = "Kantar Worldpanel ComTech provides mobile phone, tablet and quad-play ownership, purchasing and usage trends in 13 countries. Our ComTech service can provide insights and analysis around the following broad areas: installed base & sales, consumer demographics, usage including named app detail, value (spend on handset, bills & apps), tariff (data, call & SMS allowance), drivers of handset purchase, customer movement (churn, loyalty & switching), Net Promoter Score, customer journey, and forecasting."
                ,
                    PictureUrl = "http://uk.kantar.com/media/1480463/gettyimages-551688983_SennepImage.jpg"
                });

        }

    }
}
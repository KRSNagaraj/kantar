﻿namespace Search.Dialogs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Bot.Builder.Dialogs;
    using Microsoft.Bot.Connector;
    using Search.Models;

    [Serializable]
    public class SearchHitStyler : PromptStyler
    {
        public override void Apply<T>(ref IMessageActivity message, string prompt, IReadOnlyList<T> options, IReadOnlyList<string> descriptions = null)
        {
            var hits = options as IList<SearchHit>;
            if (hits != null)
            {
                var cards = hits.Select(h => new ThumbnailCard
                {
                    Title = h.Title,
                    Subtitle = h.Subtitle,
                    Images = new[] { new CardImage(h.PictureUrl) },
                    Buttons = new[] { new CardAction(ActionTypes.OpenUrl, "Open ⇗", value: h.DocURL),
                        new CardAction(ActionTypes.PostBack, "Recommended", value: "Recommended:" +  h.Recommend), },
                    Text = h.Description
                });

                message.AttachmentLayout = AttachmentLayoutTypes.Carousel;
                message.Attachments = cards.Select(c => c.ToAttachment()).ToList();
                message.Text = prompt;
            }
            else
            {
                base.Apply<T>(ref message, prompt, options, descriptions);
            }
        }
    }
}
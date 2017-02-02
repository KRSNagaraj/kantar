using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
namespace KantarBotService.Dialog
{
    [Serializable]
    public class ShareIdeasDialog : IDialog<object>
    {
        //public async Task StartAsync(IDialogContext context)
        //{
        //    context.Fail(new NotImplementedException("Sharing Ideas option is in progress..."));
        //}
        public async Task StartAsync(IDialogContext context)
        {
            await context.PostAsync($"Please share your ideas");

            context.Wait(this.MessageReceivedAsync);
        }

        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;

            var ticketNumber = new Random().Next(0, 90000);

            await context.PostAsync($"Thanks for contacting our support team. Your reference number is {ticketNumber}.");//context.Wait(this.IdeaReceivedAsync);

            context.Done(await result);
        }
        public virtual async Task IdeaReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            context.Done(await result);
        }

    }
}
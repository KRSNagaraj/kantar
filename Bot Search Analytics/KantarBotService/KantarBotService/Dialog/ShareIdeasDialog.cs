using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
namespace KantarBotService.Dialog
{
    [Serializable]
    public class ShareIdeasDialog : IDialog<object>
    {
        public async Task StartAsync(IDialogContext context)
        {
            context.Fail(new NotImplementedException("Sharing Ideas option is in progress..."));
        }
    }
}
using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
namespace KantarBotService.Dialog
{
    [Serializable]
    public class SemanticDialog : IDialog<object>
    {
        public async Task StartAsync(IDialogContext context)
        {
            context.Fail(new NotImplementedException("Semantic Search option is not implemented and currently its in progress..."));
        }
    }
}
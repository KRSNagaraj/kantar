using Microsoft.Bot.Builder.FormFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KantarBotService.AzureSearch
{
    [Serializable]
    public class LoginData
    {
        [Prompt("Please enter your *{&}* (will integrate with corporate AD soon)")]
        public string Name { get; set; }

    }
   
}
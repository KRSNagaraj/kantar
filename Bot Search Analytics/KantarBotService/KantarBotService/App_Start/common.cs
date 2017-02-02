using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KantarBotService.App_Start
{
    public static class common
    {
        public static string UserName{ get; set; }
        public static ConnectorClient Connector { get; set; }
        public static Activity CurrentActivity { get; set; }
    }
}
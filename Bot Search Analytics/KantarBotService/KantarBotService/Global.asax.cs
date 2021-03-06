﻿using Autofac;
using KantarBotService.Dialog;
using KantarBotService.Map;
using Microsoft.Azure.Search.Models;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Internals.Fibers;
using Search.Azure.Services;
using Search.Models;
using Search.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace KantarBotService
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            ContainerBuilder builder = new ContainerBuilder();

            builder.RegisterType<BaseDialog>()
              .As<IDialog<object>>()
              .InstancePerDependency();

            builder.RegisterType<AssetSearchMapper>()
               .Keyed<IMapper<DocumentSearchResult, GenericSearchResult>>(FiberModule.Key_DoNotSerialize)
               .AsImplementedInterfaces()
               .SingleInstance();

            builder.RegisterType<AzureSearchClient>()
                .Keyed<ISearchClient>(FiberModule.Key_DoNotSerialize)
                .AsImplementedInterfaces()
                .SingleInstance();

            builder.Update(Conversation.Container);
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}

﻿using System;
using Search.Dialogs;
using Search.Services;


namespace KantarBotService.Dialog
{
    [Serializable]
    public class AssetSearchDialog : SearchDialog
    {
        private static readonly string[] TopRefiners = { "Country", "Sector", "Contact" };

        public AssetSearchDialog(ISearchClient searchClient) : base(searchClient, multipleSelection: false)
        {
        }

        protected override string[] GetTopRefiners()
        {
            return TopRefiners;
        }
    }
}
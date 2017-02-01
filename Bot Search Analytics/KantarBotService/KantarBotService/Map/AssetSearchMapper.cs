﻿using System.Linq;
using Microsoft.Azure.Search.Models;
using Search.Azure.Services;
using Search.Models;


namespace KantarBotService.Map
{
    
    public class AssetSearchMapper : IMapper<DocumentSearchResult, GenericSearchResult>
    {
        public GenericSearchResult Map(DocumentSearchResult documentSearchResult)
        {
            var searchResult = new GenericSearchResult();

            searchResult.Results = documentSearchResult.Results.Select(r => ToSearchHit(r)).ToList();
            searchResult.Facets = documentSearchResult.Facets?.ToDictionary(kv => kv.Key, kv => kv.Value.Select(f => ToFacet(f)));

            return searchResult;
        }

        private static GenericFacet ToFacet(FacetResult facetResult)
        {
            return new GenericFacet
            {
                Value = facetResult.Value,
                Count = facetResult.Count.Value
            };
        }

        private static SearchHit ToSearchHit(SearchResult hit)
        {
            return new SearchHit
            {
                Key = (string)hit.Document["id"],
                Title = (string)hit.Document["Name"], //GetTitleForItem(hit),
                PictureUrl = (string)hit.Document["img_url"],
                DocURL = (string)hit.Document["doc_url"],
                Subtitle = (string)hit.Document["DataType"],
                Description = (string)hit.Document["Description"]
            };
        }

    }
}
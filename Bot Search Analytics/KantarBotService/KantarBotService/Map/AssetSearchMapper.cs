using System.Linq;
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
                Title = (string)hit.Document["assetname"], //GetTitleForItem(hit),
                PictureUrl = (string)hit.Document["assetthumbnail"],
                DocURL = (string)hit.Document["asseturl"],
                Subtitle = string.Concat("Opco : ", (string)hit.Document["opco"], 
                ", Context :" , (string)hit.Document["context"]),
                Description = (string)hit.Document["assetdescription"],
                Recommend = ((string)hit.Document["assetname"])
            };
        }

    }
}

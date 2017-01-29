using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;
using System.Configuration;

namespace test
{
    public static class SearchHelper
    {
        public static string search(string keyword)
        {
            SearchServiceClient serviceClient = GetSearchClient();
            ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("temp");
            ISearchIndexClient indexClientForQueries = CreateSearchIndexClient();

            RunQueries(indexClientForQueries);
            return "";
        }

        private static SearchIndexClient CreateSearchIndexClient()
        {
            string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
            string queryApiKey = ConfigurationManager.AppSettings["SearchServiceQueryApiKey"];

            SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, "temp", new SearchCredentials(queryApiKey));
            return indexClient;
        }

        private static SearchServiceClient GetSearchClient()
        {
            string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
            string adminApiKey = ConfigurationManager.AppSettings["SearchServiceAdminApiKey"];

            SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
            return serviceClient;
        }
        private static void RunQueries(ISearchIndexClient indexClient)
        {
            SearchParameters parameters;
            DocumentSearchResult<Assets> results;

            Console.WriteLine("Search the entire index for the term 'budget' and return only the hotelName field:\n");

            parameters =
                new SearchParameters()
                {
                    Select = new[] { "*" }
                };

            results = indexClient.Documents.Search<Assets>("budget", parameters);

            WriteDocuments(results);

            Console.Write("Apply a filter to the index to find hotels cheaper than $150 per night, ");
            Console.WriteLine("and return the hotelId and description:\n");

            parameters =
                new SearchParameters()
                {
                    Filter = "baseRate lt 150",
                    Select = new[] { "hotelId", "description" }
                };

            results = indexClient.Documents.Search<Assets>("*", parameters);

            WriteDocuments(results);

            Console.Write("Search the entire index, order by a specific field (lastRenovationDate) ");
            Console.Write("in descending order, take the top two results, and show only hotelName and ");
            Console.WriteLine("lastRenovationDate:\n");

            parameters =
                new SearchParameters()
                {
                    OrderBy = new[] { "lastRenovationDate desc" },
                    Select = new[] { "hotelName", "lastRenovationDate" },
                    Top = 2
                };

            results = indexClient.Documents.Search<Assets>("*", parameters);

            WriteDocuments(results);

            Console.WriteLine("Search the entire index for the term 'motel':\n");

            parameters = new SearchParameters();
            results = indexClient.Documents.Search<Assets>("motel", parameters);

            WriteDocuments(results);
        }

        private static void WriteDocuments(DocumentSearchResult<Assets> searchResults)
        {
            foreach (SearchResult<Assets> result in searchResults.Results)
            {
                Console.WriteLine(result.Document);
            }

            Console.WriteLine();
        }
    }
}
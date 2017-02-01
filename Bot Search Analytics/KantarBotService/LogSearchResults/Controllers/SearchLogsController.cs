using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;
using System.Web.Http.OData.Routing;
using LogSearchResults.Models;
using Microsoft.Data.OData;

namespace LogSearchResults.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using LogSearchResults.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<SearchLog>("SearchLogs");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SearchLogsController : ODataController
    {
        private static ODataValidationSettings _validationSettings = new ODataValidationSettings();

        // GET: odata/SearchLogs
        public async Task<IHttpActionResult> GetSearchLogs(ODataQueryOptions<SearchLog> queryOptions)
        {
            // validate the query.
            try
            {
                queryOptions.Validate(_validationSettings);
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

            // return Ok<IEnumerable<SearchLog>>(searchLogs);
            return StatusCode(HttpStatusCode.NotImplemented);
        }

        // GET: odata/SearchLogs(5)
        public async Task<IHttpActionResult> GetSearchLog([FromODataUri] int key, ODataQueryOptions<SearchLog> queryOptions)
        {
            // validate the query.
            try
            {
                queryOptions.Validate(_validationSettings);
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

            // return Ok<SearchLog>(searchLog);
            return StatusCode(HttpStatusCode.NotImplemented);
        }

        // PUT: odata/SearchLogs(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<SearchLog> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Get the entity here.

            // delta.Put(searchLog);

            // TODO: Save the patched entity.

            // return Updated(searchLog);
            return StatusCode(HttpStatusCode.NotImplemented);
        }

        // POST: odata/SearchLogs
        public async Task<IHttpActionResult> Post(SearchLog searchLog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Add create logic here.

            // return Created(searchLog);
            return StatusCode(HttpStatusCode.NotImplemented);
        }

        // PATCH: odata/SearchLogs(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<SearchLog> delta)
        {
            Validate(delta.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Get the entity here.

            // delta.Patch(searchLog);

            // TODO: Save the patched entity.

            // return Updated(searchLog);
            return StatusCode(HttpStatusCode.NotImplemented);
        }

        // DELETE: odata/SearchLogs(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            // TODO: Add delete logic here.

            // return StatusCode(HttpStatusCode.NoContent);
            return StatusCode(HttpStatusCode.NotImplemented);
        }
    }
}

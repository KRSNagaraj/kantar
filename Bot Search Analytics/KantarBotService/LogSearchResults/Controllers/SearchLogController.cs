using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using LogSearchResults.Models;

namespace LogSearchResults.Controllers
{
    public class SearchLogController : ApiController
    {
        private KantarBotContext db = new KantarBotContext();

        // GET: api/SearchLog
        public IQueryable<SearchLog> GetSearchLog()
        {
            return db.SearchLog;
        }

        // GET: api/SearchLog/5
        [ResponseType(typeof(SearchLog))]
        public async Task<IHttpActionResult> GetSearchLog(int id)
        {
            SearchLog searchLog = await db.SearchLog.FindAsync(id);
            if (searchLog == null)
            {
                return NotFound();
            }

            return Ok(searchLog);
        }

        // PUT: api/SearchLog/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSearchLog(int id, SearchLog searchLog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != searchLog.Id)
            {
                return BadRequest();
            }

            db.Entry(searchLog).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SearchLogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/SearchLog
        [ResponseType(typeof(SearchLog))]
        public async Task<IHttpActionResult> PostSearchLog(SearchLog searchLog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SearchLog.Add(searchLog);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = searchLog.Id }, searchLog);
        }

        // DELETE: api/SearchLog/5
        [ResponseType(typeof(SearchLog))]
        public async Task<IHttpActionResult> DeleteSearchLog(int id)
        {
            SearchLog searchLog = await db.SearchLog.FindAsync(id);
            if (searchLog == null)
            {
                return NotFound();
            }

            db.SearchLog.Remove(searchLog);
            await db.SaveChangesAsync();

            return Ok(searchLog);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SearchLogExists(int id)
        {
            return db.SearchLog.Count(e => e.Id == id) > 0;
        }
    }
}
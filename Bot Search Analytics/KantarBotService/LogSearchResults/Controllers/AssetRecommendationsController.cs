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
    public class AssetRecommendationsController : ApiController
    {
        private KantarBotContext db = new KantarBotContext();

        // GET: api/AssetRecommendations
        public IQueryable<AssetRecommendation> GetAssetRecommendations()
        {
            return db.AssetRecommendation;
        }

        // GET: api/AssetRecommendations/5
        [ResponseType(typeof(AssetRecommendation))]
        public async Task<IHttpActionResult> GetAssetRecommendation(int id)
        {
            IList<AssetRecommendation> assetRecommendations = await db.AssetRecommendation.Where(x => x.AssetID == id).ToListAsync();
            if (assetRecommendations == null)
            {
                return NotFound();
            }

            return Ok(assetRecommendations);
        }

        // PUT: api/AssetRecommendations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAssetRecommendation(int id, AssetRecommendation assetRecommendation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != assetRecommendation.ID)
            {
                return BadRequest();
            }

            db.Entry(assetRecommendation).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssetRecommendationExists(id))
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

        // POST: api/AssetRecommendations
        [ResponseType(typeof(AssetRecommendation))]
        public async Task<IHttpActionResult> PostAssetRecommendation(AssetRecommendation assetRecommendation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AssetRecommendation.Add(assetRecommendation);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = assetRecommendation.ID }, assetRecommendation);
        }

        // DELETE: api/AssetRecommendations/5
        [ResponseType(typeof(AssetRecommendation))]
        public async Task<IHttpActionResult> DeleteAssetRecommendation(int id)
        {
            AssetRecommendation assetRecommendation = await db.AssetRecommendation.FindAsync(id);
            if (assetRecommendation == null)
            {
                return NotFound();
            }

            db.AssetRecommendation.Remove(assetRecommendation);
            await db.SaveChangesAsync();

            return Ok(assetRecommendation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AssetRecommendationExists(int id)
        {
            return db.AssetRecommendation.Count(e => e.ID == id) > 0;
        }
    }
}
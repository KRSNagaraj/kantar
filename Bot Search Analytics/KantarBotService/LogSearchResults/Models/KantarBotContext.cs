using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace LogSearchResults.Models
{
    public class KantarBotContext : DbContext
    {

        public KantarBotContext() : base("name=KantarBot")
        {
            //this.Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
        }
        
        public DbSet<SearchLog> SearchLog { get; set; }
        public DbSet<AssetRecommendation> AssetRecommendation { get; set; }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    //DONT DO THIS ANYMORE
        //    //base.OnModelCreating(modelBuilder);
        //    //modelBuilder.Entity<Vote>().ToTable("Votes")
        //    modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        //}
    }
}
namespace KantarBotDB
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class SearchBotDB : DbContext
    {
        public SearchBotDB()
            : base("name=SearchBotDB")
        {
        }

        public virtual DbSet<AssetRecommendation> AssetRecommendations { get; set; }
        public virtual DbSet<SearchLog> SearchLogs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}

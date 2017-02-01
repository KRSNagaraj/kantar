namespace KantarBotService.DB
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class KantarBotDB : DbContext
    {
        public KantarBotDB()
            : base("name=KantarBotDB")
        {
        }

        public virtual DbSet<AssetRecommendation> AssetRecommendation { get; set; }
        public virtual DbSet<SearchLogs> SearchLogs { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}

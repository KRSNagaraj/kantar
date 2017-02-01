namespace KantarBotDB
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("AssetRecommendation")]
    public partial class AssetRecommendation
    {
        public int ID { get; set; }

        public int? AssetID { get; set; }

        public int? RecommendedAssetID { get; set; }
    }
}

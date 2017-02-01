using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LogSearchResults.Models
{
    public class AssetRecommendation
    {
        [Key]
        public int ID { get; set; }
        public int AssetID { get; set; }
        public int RecommendedAssetID { get; set; }
    }
}
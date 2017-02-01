namespace KantarBotService.DB
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class SearchLogs
    {
        public int Id { get; set; }

        public string instance { get; set; }

        public string username { get; set; }

        public string keyword { get; set; }

        public string searchtype { get; set; }
    }
}

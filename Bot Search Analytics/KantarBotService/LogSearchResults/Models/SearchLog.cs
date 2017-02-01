using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LogSearchResults.Models
{
    public class SearchLog
    {
        [Key]
        public int Id { get; set; }
        public string instance{ get; set; }
        public string username { get; set; }
        public string keyword { get; set; }
        public string searchtype { get; set; }
        
    }
}
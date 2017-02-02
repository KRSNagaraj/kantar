﻿namespace Search.Models
{
    using System;
    using System.Collections.Generic;

    [Serializable]
    public class SearchHit
    {
        public SearchHit()
        {
            this.PropertyBag = new Dictionary<string, object>();
        }

        public string Key { get; set; }

        public string Title { get; set; }
        public string Subtitle { get; set; }

        public string PictureUrl { get; set; }
        public string DocURL { get; set; }
        public string Recommend { get; set; }
        public string Context { get; set; }

        public string Description { get; set; }

        public IDictionary<string, object> PropertyBag { get; set; }
    }
}
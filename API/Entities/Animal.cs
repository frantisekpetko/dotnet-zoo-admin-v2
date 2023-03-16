using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace API.Entities
{
    [Table("animal")]
    public class Animal: BaseEntity
    {

        [JsonProperty("id")]
        public int Id { get; set; }
        
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("latinname")]
        public string Latinname { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("images")]
        public List<Image> Images { get; set; }

        [JsonProperty("extlinks")]
        public List<Extlink> Extlinks { get; set; }

    }

  
}

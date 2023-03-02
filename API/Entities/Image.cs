using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("image")]
    public class Image: BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("urlName")]
        public string UrlName { get; set; }

        public int AnimalId { get; set; }
        public Animal Animal { get; set; }


    }
}

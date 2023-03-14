using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("extlink")]
    public class Extlink: BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("link")]
        public string Link { get; set; }

        public int AnimalId { get; set; }

        public Animal Animal { get; set; }
    }
}

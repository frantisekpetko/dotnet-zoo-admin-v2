using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using API.Entities;
namespace API.Entities
{
    [Table("user")]

    public class User: BaseEntity
{
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("password")]
        public byte[] PasswordHash { get; set; }
        
        [JsonProperty("salt")]
        public byte[] PasswordSalt { get; set; }
    }
}
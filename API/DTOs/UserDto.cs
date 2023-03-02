using Newtonsoft.Json;

namespace API.DTOs
{
    public class UserDto
    {
        [JsonProperty("username")]
        public string Username { get; set; }
        [JsonProperty("token")]
        public string Token { get; set; }
    }
}
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class LoginDto
    {
        [JsonProperty("username")]
        [Required(ErrorMessage = "Username is empty.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is empty.")]
        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
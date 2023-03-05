using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [JsonProperty("username")]
        [Required]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 4)]
        public string Username { get; set; }
        [JsonProperty("password")]
        [Required]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 8)]
        [RegularExpression(@"((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$",
         ErrorMessage = "Password too weak, must include at least 8 characters, one digit, upper case letter and 'non-word' character")]
        public string Password { get; set; }
    }
}
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace API.DTOs
{
    public class ImageDto
    {
        [JsonProperty("fileName")]
        public string FileName { get; set; }
        [JsonProperty("image")]
        public IFormFile Image { get; set; }

    }
}

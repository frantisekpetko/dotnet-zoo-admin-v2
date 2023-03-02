using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreateUpdateAnimalDto {
        [JsonProperty("id")]
        [ValidateNever()]
        int Id { get; set; }
        [JsonProperty("name")]
        [Required(ErrorMessage = "Name is empty.")]
        public string Name { get; set; }
        [JsonProperty("latinname")]
        [Required(ErrorMessage = "Latin name is empty.")]
        public string Latinname { get; set; }
        [JsonProperty("description")]
        [Required(ErrorMessage = "Description is empty.")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Image is not present.")]
        [JsonProperty("image")]
        public string Image { get; set; }
        [JsonProperty("extlinks")]
        [Url(ErrorMessage = "Is not URL.")]
        [Required(ErrorMessage = "Extlinks are not present.")]
        public string[] Extlinks { get; set; }


    }
}

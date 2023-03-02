using Newtonsoft.Json;

namespace API.Errors
{
    public class ApiException
    {
        public ApiException(
            int statusCode, 
            string message = null,
            string details = null,
            string method = null,
            string path = null,
            string timestamp = null
        )
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
            Method = method;
            Path = path;
            Timestamp = timestamp;

        }
        [JsonProperty("code")]
        public int StatusCode { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("details")]
        public string Details { get; set; }
        [JsonProperty("method")]
        public string Method { get; set; }
        [JsonProperty("path")]
        public string Path { get; set; }
        [JsonProperty("timestamp")]
        public string Timestamp { get; set; }
    }
}
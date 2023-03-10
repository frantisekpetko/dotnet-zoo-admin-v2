using API.DTOs;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using SQLitePCL;
using System.Reflection.Metadata;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.Extensions.Hosting;

namespace API.Controllers
{

    public class ImageResponse {
        [JsonProperty("image")]
        public string Image {get; set; }
    }

    public class AnimalsController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IHostEnvironment _env;


        public AnimalsController(DataContext context, IHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet("pages")]
        public async Task<ActionResult<int>> getPagesLength(
            [FromQuery(Name = "page")] int? page,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            //List<Animal> animals = await this.getAll(null, limit, search);
            //return (int) Math.Ceiling((double) animals.Count / limit);

            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                    .Include(a => a.Images)
                    .ToListAsync();

            (await this.getAll())
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                    )
                .ToList();

            return (int)Math.Ceiling((double)animals.Count / limit);
        }

        private async Task<List<Animal>> getAll(
            int page = 1,
            int limit = 12,
            string search = ""
)
        {
            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                    .Include(a => a.Images)
                    .ToListAsync();

            return animals;
        }

        [HttpGet]
        public async Task<ActionResult<List<Animal>>> findAll(
            [FromQuery(Name = "page")] int page = 1,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            //return await getAll(page, limit, search);
            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                .Include(a => a.Images)
                .ToListAsync();


            return (await this.getAll())
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                 )
                .Skip(page == 1 ? 0 : (page - 1) * limit)
                .Take(limit)
                .ToList();
            //search = search.ToLower();

            /*return await _context.Animals
                    .Where(
                        x =>
                        EF.Functions.Like(EF.Functions.Collate(x.Name.ToLower(), "SQL_Latin1_General_CP1_CS_AS"), $"%{search.ToLower()}%") ||
                        EF.Functions.Like(EF.Functions.Collate(x.Latinname.ToLower(), "SQL_Latin1_General_CP1_CS_AS"), $"%{search.ToLower()}%"))
                    .Include(a => a.Images)
                    .ToListAsync();*/

            /*
            List<Animal> animals = await _context.Animals

                    .Include(a => a.Images)
                    .ToListAsync();
            */

            /*return animals
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                 )
                .Skip(page == 1 ? 0 : (page - 1) * limit)
                .Take(limit)
                .ToList();*/


            /*return await _context.Animals
                    .Where(x => EF.Functions.Like(x.Name, $"%{search}%") || EF.Functions.Like(x.Latinname, $"%{search}%"))
                    .Include(a => a.Images)
                    .ToListAsync();*/

            //x.Name.Equals(search)
            // || x.Latinname.Equals(search)
            //return BadRequest(new { message = "Error" });

            /*return await _context.Animals.Include(x => x.Images).Skip(page == 1 ? 0 : page * limit)
                .Take(limit)
                .ToListAsync();*/

            //.ToListAsync();

        }


        [HttpPost]
        public async Task<ActionResult> create(CreateUpdateAnimalDto createUpdateAnimalDto)
        {
            Animal _animal = new Animal();
            _animal.Name = createUpdateAnimalDto.Name;
            _animal.Latinname =  createUpdateAnimalDto.Latinname;
            _animal.Description = createUpdateAnimalDto.Description;

            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
            i.CreatedAt = DateTime.UtcNow;
            Console.WriteLine($"Image: {createUpdateAnimalDto.Image}");
            _animal.Images.Add(i);

            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {
                Extlink e = new Extlink();

                e.Link = extlink;
                e.CreatedAt = DateTime.UtcNow;
                _animal.Extlinks.Add(e);

            }

            await _context.SaveChangesAsync();

            return NoContent();


        }

        private async Task<Animal> findAnimal(int? id)
        {
            var animal = await _context.Animals
            .Include(a => a.Images)
            .Include(a => a.Extlinks)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

            return animal;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> findOne([FromRoute] int? id)
        {
            var animal = await this.findAnimal(id);

            if (animal == null)
            {
                return NotFound();
            }

            return animal;
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> update([FromRoute] int? id)
        {

            var animal = await this.findAnimal(id);

            Animal _animal = new Animal();
            _animal.Name = animal.Name;
            _animal.Latinname =  animal.Latinname;
            _animal.Description = animal.Description;

            Image i = new Image();
            i.UrlName = animal.Images.First().UrlName;
            i.CreatedAt = DateTime.UtcNow;
            _animal.Images.Add(i);

            foreach (Extlink extlink in animal.Extlinks)
            {
                Extlink e = new Extlink();

                e.Link = extlink.Link;
                e.CreatedAt = DateTime.UtcNow;
                _animal.Extlinks.Add(e);

            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> delete([FromRoute] int? id)
        {
            var _animal = await this.findAnimal(id);

            if (_animal is Animal animal)
            {

                _context.Animals.Remove(animal);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return NotFound();
        }

        
        [HttpPost("file")]
        public ActionResult<ImageResponse> handleUpload([FromForm] IFormFile file)
        {
            string FileName = file.FileName;

            // combining GUID to create unique name before saving in wwwroot
            string uniqueFileName = Guid.NewGuid().ToString() + Math.Ceiling(new Random().Next() * 1e9) + "_" + FileName;

            // getting full path inside wwwroot/images
            var imagePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                _env.IsDevelopment() 
                ? "../frontend/public/images" 
                : "../frontend/dist/images", uniqueFileName);

            // copying file
            file.CopyTo(new FileStream(imagePath, FileMode.Create));

            return new ImageResponse { Image = uniqueFileName };
        }
        

    }
}

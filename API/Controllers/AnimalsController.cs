using API.DTOs;
using API.Data;
using API.Entities;
using API.Interfaces;
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

    public class ImageResponse
    {
        [JsonProperty("image")]
        public string Image { get; set; }
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

        public IAnimalsRepository _animalsRepository => new AnimalsRepository(_context);

        [HttpGet("pages")]
        public async Task<ActionResult<int>> getPagesLength(
            [FromQuery(Name = "page")] int? page,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                    .Include(a => a.Images)
                    .ToListAsync();

            (await _animalsRepository.getAll())
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                    )
                .ToList();

            return (int)Math.Ceiling((double)animals.Count / limit);
        }


        [HttpGet]
        public async Task<ActionResult<List<Animal>>> findAll(
            [FromQuery(Name = "page")] int page = 1,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                .Include(a => a.Images)
                .ToListAsync();


            return (await _animalsRepository.getAll())
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                 )
                .Skip(page == 1 ? 0 : (page - 1) * limit)
                .Take(limit)
                .ToList();
        }


        [HttpPost]
        public async Task<ActionResult> Create(CreateUpdateAnimalDto createUpdateAnimalDto)
        {
            Animal _animal = new Animal();
            _animal.Name = createUpdateAnimalDto.Name;
            _animal.Latinname =  createUpdateAnimalDto.Latinname;
            _animal.Description = createUpdateAnimalDto.Description;
            _animal.CreatedAt = DateTime.UtcNow;

            _context.Attach(_animal);
       
            //Console.WriteLine("Image: " + createUpdateAnimalDto.Image + " " + createUpdateAnimalDto.Image.Equals(""));
         
            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
       
            i.CreatedAt = DateTime.UtcNow;
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_animal));

        
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_animal));
            _animal.Images = new List<Image>();
            _animal.Images.Add(i);
      

            _animal.Extlinks = new List<Extlink>();
            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {
                Extlink e = new Extlink();

                e.Link = extlink;
                e.CreatedAt = DateTime.UtcNow;
                _animal.Extlinks.Add(e);

            }
            _context.Add(_animal);
            await _context.SaveChangesAsync();

            return NoContent();


        }




        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> findOne([FromRoute] int? id)
        {
            var animal = await _animalsRepository.findAnimal(id);

            if (animal == null)
            {
                return NotFound();
            }

            return animal;
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Animal>> Update([FromRoute] int? id, CreateUpdateAnimalDto createUpdateAnimalDto)
        {

            Animal _animal = await _animalsRepository.findAnimal(id);

            _animal.Name = createUpdateAnimalDto.Name;
            _animal.Latinname =  createUpdateAnimalDto.Latinname;
            _animal.Description = createUpdateAnimalDto.Description;
            _animal.UpdatedAt = DateTime.UtcNow;


            _context.Attach(_animal);
         
            var i = new List<Image>();
            string origImage = _animal.Images.First().UrlName;
            _animal.Images.Clear();
            _animal.Images = new List<Image>();
       
            Image _i = new Image();
     

            if (createUpdateAnimalDto.Image != null)
                _i.UrlName = createUpdateAnimalDto.Image;
            else
                _i.UrlName = origImage;

            _i.UpdatedAt = DateTime.UtcNow;
       
            i.Add(_i);
       
            _context.Attach(_i);
         
            int index = 0;
            var e = new List<Extlink>(_animal.Extlinks);
            _animal.Extlinks.Clear();
            _animal.Extlinks = new List<Extlink>();
        
            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {

                Extlink _e = new Extlink();
                _e.Link = extlink;
                _e.CreatedAt = DateTime.UtcNow;
                index++;
                _context.Attach(_e);
                _animal.Extlinks.Add(_e);
 
            }
  
   
;
     
            _animal.Images.Add(_i);
            _context.Update(_animal);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int? id)
        {
            var _animal = await _animalsRepository.findAnimal(id);

            if (_animal is Animal animal)
            {

                _context.Animals.Remove(animal);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return NotFound();
        }


        [HttpPost("file")]
        public ActionResult<ImageResponse> handleUpload([FromForm] ImageDto file)
        {
 
            // combining GUID to create unique name before saving
            string uniqueFileName = Guid.NewGuid().ToString() + Math.Ceiling(new Random().Next() * 1e9) + "_" + file.FileName;

            // getting full path inside frontend/public/images or frontend/dist/images depends on development or production mode
            var imagePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                _env.IsDevelopment()
                ? "../frontend/public/images"
                : "../frontend/dist/images", uniqueFileName);

            // copying file
            file.Image.CopyTo(new FileStream(imagePath, FileMode.Create));

            return new ImageResponse { Image = uniqueFileName };
        }


    }
}

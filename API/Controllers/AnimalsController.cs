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
            //List<Animal> animals = await this.getAll(null, limit, search);
            //return (int) Math.Ceiling((double) animals.Count / limit);

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
        /*
        private async Task<Animal> findAnimal(int? id)
        {
            var animal = await _context.Animals
            .Include(a => a.Images)
            .Include(a => a.Extlinks)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

            return animal;
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
        */

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


            return (await _animalsRepository.getAll())
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
        public async Task<ActionResult> Create(CreateUpdateAnimalDto createUpdateAnimalDto)
        {
            Animal _animal = new Animal();
            _animal.Name = createUpdateAnimalDto.Name;
            _animal.Latinname =  createUpdateAnimalDto.Latinname;
            _animal.Description = createUpdateAnimalDto.Description;
            _animal.CreatedAt = DateTime.UtcNow;

            _context.Attach(_animal);
            /*
            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
            i.CreatedAt = DateTime.UtcNow;
            Console.WriteLine($"Image: {createUpdateAnimalDto.Image}");
            _animal.Images.Add(i);
            */


            Console.WriteLine("Image: " + createUpdateAnimalDto.Image + " " + createUpdateAnimalDto.Image.Equals(""));
            //_animal.Images.Clear();
            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
            //i.Animal = _animal;
            //i.UrlName = createUpdateAnimalDto.Image;
            //Console.WriteLine($"UrlName: {createUpdateAnimalDto.Image}");
            i.CreatedAt = DateTime.UtcNow;
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_animal));

            //_context.Attach(_animal);
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_animal));
            _animal.Images = new List<Image>();
            _animal.Images.Add(i);
            //_animal.Images.First().UrlName = createUpdateAnimalDto.Image;
            //_animal.Images.First().CreatedAt = DateTime.UtcNow;

            _animal.Extlinks = new List<Extlink>();
            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {
                Extlink e = new Extlink();

                e.Link = extlink;
                e.CreatedAt = DateTime.UtcNow;
                //e.Animal = _animal;
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
            //_animal.Images.Clear();
            Console.WriteLine("Image: " + createUpdateAnimalDto.Image);

            //var i = new List<Image>(_animal.Images.ToList());
            var i = new List<Image>();
            string origImage = _animal.Images.First().UrlName;
            _animal.Images.Clear();
            _animal.Images = new List<Image>();
       
            Image _i = new Image();
            //i.First().UrlName = createUpdateAnimalDto.Image;

            if (createUpdateAnimalDto.Image != null)
                _i.UrlName = createUpdateAnimalDto.Image;
            else
                _i.UrlName = origImage;

            _i.UpdatedAt = DateTime.UtcNow;
            //Console.WriteLine($"UrlName: {createUpdateAnimalDto.Image}");
            //i.First().UpdatedAt = DateTime.UtcNow;
            i.Add(_i);
            //i.Animal = _animal;
            _context.Attach(_i);
            //_animal.Images.First().UrlName = createUpdateAnimalDto.Image;
            //_animal.Images.First().CreatedAt = DateTime.UtcNow;


            /*
            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
            Console.WriteLine($"UrlName: {createUpdateAnimalDto.Image}");
            i.CreatedAt = DateTime.UtcNow;
            _animal.Images.Add(i);
            */
            //_animal.Extlinks.Clear();
            int index = 0;
            var e = new List<Extlink>(_animal.Extlinks);
            _animal.Extlinks.Clear();
            _animal.Extlinks = new List<Extlink>();
            //Console.WriteLine("Extlinks:" + Newtonsoft.Json.JsonConvert.SerializeObject(e));
            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {
                //List<Extlink> e = _animal.Extlinks;
                Extlink _e = new Extlink();
                _e.Link = extlink;
                _e.CreatedAt = DateTime.UtcNow;
                index++;
                _context.Attach(_e);
                _animal.Extlinks.Add(_e);
                //e.Animal = _animal;


            }
            //_context.Attach(_animal);
            //_context.Add(_animal);
            //_context.Update(_animal);
            //_context.Add(_animal);
   
;
     
            _animal.Images.Add(_i);
            _context.Update(_animal);
            await _context.SaveChangesAsync();
            return await _animalsRepository.findAnimal(id);
            //return NoContent();
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
            //string FileName = file.FileName;

            // combining GUID to create unique name before saving in wwwroot
            string uniqueFileName = Guid.NewGuid().ToString() + Math.Ceiling(new Random().Next() * 1e9) + "_" + file.FileName;

            // getting full path inside wwwroot/images
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

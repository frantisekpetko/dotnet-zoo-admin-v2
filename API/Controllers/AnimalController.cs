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

namespace API.Controllers
{
    public class AnimalController : BaseApiController
    {
        private readonly DataContext _context;

        public AnimalController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("/pages")]
        public async Task<ActionResult<int>> getPagesLength(
            [FromQuery(Name = "page")] int page = 1,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
           List<Animal> animals = await this.getAll(page, limit, search);
           return Ok(Math.Ceiling((double) animals.Count / limit));
        }

        public async Task<Animal> getAll(
            int page = 1,
            int limit = 12,
            string search = ""
)
        {
            Console.WriteLine(search);

            List<Animal> animals = await _context.Animals
                    .Include(a => a.Images)
                    .ToListAsync();


            return animals
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                 )
                .Skip(page == 1 ? 0 : (page - 1) * limit)
                .Take(limit)
                .ToList();


  

        }

        [HttpGet]
        public async Task<ActionResult<List<Animal>>> findAll(
            [FromQuery(Name = "page")] int page = 1,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            return await getAll(page, limit, search); 
            //search = search.ToLower();
            
            /*return await _context.Animals
                    .Where(
                        x =>
                        EF.Functions.Like(EF.Functions.Collate(x.Name.ToLower(), "SQL_Latin1_General_CP1_CS_AS"), $"%{search.ToLower()}%") ||
                        EF.Functions.Like(EF.Functions.Collate(x.Latinname.ToLower(), "SQL_Latin1_General_CP1_CS_AS"), $"%{search.ToLower()}%"))
                    .Include(a => a.Images)
                    .ToListAsync();*/

            
            List<Animal> animals = await _context.Animals
                    /*.Where(
                        x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower()))*/
                    .Include(a => a.Images)
                    .ToListAsync();


            return animals
                .Where(
                    x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())
                 )
                .Skip(page == 1 ? 0 : (page - 1) * limit)
                .Take(limit)
                .ToList();


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
            //return _animal;
            Image i = new Image();
            i.UrlName = createUpdateAnimalDto.Image;
            i.CreatedAt = DateTime.UtcNow;
            _animal.Images.Add(i);

            foreach (string extlink in createUpdateAnimalDto.Extlinks)
            {
                Extlink e = new Extlink();
  
                e.Link = extlink;
                e.CreatedAt = DateTime.UtcNow;
                _animal.Extlinks.Add(e);

            }

            await _context.SaveChangesAsync();

            return Ok();


        }
    }
}

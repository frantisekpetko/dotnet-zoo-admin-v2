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

        [HttpGet]
        public async Task<ActionResult<List<Animal>>> findAll(
            [FromQuery(Name = "page")] int page = 1,
            [FromQuery(Name = "limit")] int limit = 12,
            [FromQuery(Name = "search")] string search = ""
        )
        {
            //
            //
            //List<Animal> data = new List<Animal>();
            //var data = null;
            //search = search.ToLower();
            Console.WriteLine(search);
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


            List<Animal> filteredAnimals = animals.Where(x =>
                        x.Name.ToLower().Contains(search.ToLower()) ||
                        x.Latinname.ToLower().Contains(search.ToLower())).ToList();
            List<Animal> slicedAnimals = filteredAnimals.Skip(page == 1 ? 0 : (page - 1) * limit).Take(limit).ToList();
            

            return slicedAnimals;


            /*return await _context.Animals
                    .Where(x => EF.Functions.Like(x.Name, $"%{search}%") || EF.Functions.Like(x.Latinname, $"%{search}%"))
                    .Include(a => a.Images)
                    .ToListAsync();*/

            //x.Name.Equals(search)
            // || x.Latinname.Equals(search)
            //return BadRequest(new { message = "Error" });
            if (false)
            {
                /*return await _context.Animals.Include(a => a.Images)
                    .Where(x => x.Name.ToLower() == search.ToLower())
                    .Where(x => x.Latinname.ToLower() == search.ToLower())

                    //.Include(c => c.Orders.Where(o => o.Name != "Foo")).ThenInclude(o => o.Images)
                    //.Include(c => c.Orders.Where(o => o.Name != "Foo")).ThenInclude(o => o.Customer)
                    .Skip(page == 1 ? 0 : page * limit)
                    .Take(limit).ToListAsync();*/
            }
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

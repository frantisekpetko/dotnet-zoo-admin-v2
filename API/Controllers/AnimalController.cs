using API.DTOs;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;

namespace API.Controllers
{
    public class AnimalController : BaseApiController
    {
        private readonly DataContext _context;

        public AnimalController(DataContext context)
        {
            _context = context;
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

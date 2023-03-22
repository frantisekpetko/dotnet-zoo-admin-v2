using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace API.Data
{
    public class AnimalsRepository : IAnimalsRepository
    {
        private readonly DataContext _context;
        public AnimalsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Animal> findAnimal(int? id)
        {
            var animal = await _context.Animals
            .Include(a => a.Images)
            .Include(a => a.Extlinks)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

            return animal;
        }

        public async Task<List<Animal>> getAll(
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
    }
}
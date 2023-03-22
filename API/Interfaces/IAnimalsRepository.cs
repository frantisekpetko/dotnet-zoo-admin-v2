using API.DTOs;
using API.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAnimalsRepository
    {
        Task<Animal> FindAnimal(int? id);

        Task<List<Animal>> GetAll(
            int page = 1,
            int limit = 12,
            string search = ""
        );
    }
}
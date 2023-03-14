using API.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Design;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Text.Json;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.IO;
using Microsoft.Extensions.Logging;

namespace API.Data {

    public class JsonAnimal
    {

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("latinname")]
        public string Latinname { get; set; }


        [JsonProperty("extract")]
        public string Description { get; set; }

        [JsonProperty("image")]
        public string Image { get; set; }

        [JsonProperty("extlinks")]
        public List<string> Extlinks { get; set; }
    }


    public class DataContext : DbContext
    {


        public DataContext(DbContextOptions options, ILogger<DataContext> logger) : base(options)
        {


        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        /*
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var insertedEntries = this.ChangeTracker.Entries()
                                   .Where(x => x.State == EntityState.Added)
                                   .Select(x => x.Entity);

            foreach (var insertedEntry in insertedEntries)
            {
                var auditableEntity = insertedEntry as BaseEntity;
                //If the inserted object is an Auditable. 
                if (auditableEntity != null)
                {
                    Console.WriteLine(DateTimeOffset.UtcNow);
                    auditableEntity.CreatedAt = DateTimeOffset.UtcNow;
                }
            }

            var modifiedEntries = this.ChangeTracker.Entries()
                       .Where(x => x.State == EntityState.Modified)
                       .Select(x => x.Entity);

            foreach (var modifiedEntry in modifiedEntries)
            {
                //If the inserted object is an Auditable. 
                var auditableEntity = modifiedEntry as BaseEntity;
                if (auditableEntity != null)
                {
                    auditableEntity.UpdatedAt = DateTimeOffset.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
        */

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var insertedEntries = this.ChangeTracker.Entries()
                                   .Where(x => x.State == EntityState.Added)
                                   .Select(x => x.Entity);

            foreach (var insertedEntry in insertedEntries)
            {
                var auditableEntity = insertedEntry as BaseEntity;
                //If the inserted object is an Auditable. 
                if (auditableEntity != null)
                {
                    auditableEntity.CreatedAt = DateTime.UtcNow;
                }
            }

            var modifiedEntries = this.ChangeTracker.Entries()
                       .Where(x => x.State == EntityState.Modified)
                       .Select(x => x.Entity);

            foreach (var modifiedEntry in modifiedEntries)
            {
                //If the inserted object is an Auditable. 
                var auditableEntity = modifiedEntry as BaseEntity;
                if (auditableEntity != null)
                {
                    auditableEntity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Image>()
                .HasOne(p => p.Animal)
                .WithMany(b => b.Images);


            modelBuilder.Entity<Extlink>()
                .HasOne(p => p.Animal)
                .WithMany(b => b.Extlinks);

            using var hmac = new HMACSHA512();

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "user",
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("123456")),
                    PasswordSalt = hmac.Key,
                    CreatedAt = DateTime.UtcNow
                }
            );

            string fileName = Path.GetFullPath(Directory.GetCurrentDirectory() + @"\Data\animals.json");
            string jsonString = File.ReadAllText(fileName);
            var jsonAnimal = JsonConvert.DeserializeObject<List<JsonAnimal>>(jsonString);

            int animalId = 1;
            int extlinkId = 1;

            foreach (JsonAnimal _animal in jsonAnimal)
            {

                Animal animal = new Animal();
                animal.Id =  animalId;
                animal.Name = _animal.Name;
                animal.Latinname =  _animal.Latinname;
                animal.Description =  _animal.Description;
                animal.CreatedAt = DateTime.UtcNow;
       

                modelBuilder.Entity<Animal>().HasData(animal);
       
                Image i = new Image();
                i.Id = animalId;
                i.UrlName = _animal.Image;
                i.AnimalId = animalId;
                i.CreatedAt = DateTime.UtcNow;

                modelBuilder.Entity<Image>().HasData(i);

                
   
                foreach (string extlink in _animal.Extlinks)
                {
                    Extlink e = new Extlink();
                    e.Id = extlinkId;
                    e.Link = extlink;
                    e.AnimalId =  animalId;
                    e.CreatedAt = DateTime.UtcNow;
                    modelBuilder.Entity<Extlink>().HasData(e);
                    extlinkId++;

                }

                animalId++;


            }
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Animal> Animals { get; set; }

        public DbSet<Image> Images { get; set; }

        public DbSet<Extlink> Extlinks { get; set; }

    }
}
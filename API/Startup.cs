using System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using API.Extensions;
using API.Middleware;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using System.Net;
using API.Errors;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using System.Text.Json.Serialization;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration  config)
        {
            _config = config;
        }

        private readonly IConfiguration _config;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationServices(_config);
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });
            services.AddCors();
            services.AddIdentityServices(_config);
            //services.AddControllers().AddNewtonsoftJson();


            services.AddResponseCompression(options =>
            {
                 options.EnableForHttps = true;
                 options.Providers.Add<BrotliCompressionProvider>();
                 options.Providers.Add<GzipCompressionProvider>();
            });

            services.Configure<BrotliCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Optimal;
            });

            /*
            services.AddMvc().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });
            */
            
            services.AddControllers().AddNewtonsoftJson(
                options => 
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            
            app.UseMiddleware<ExceptionMiddleware>();
            Console.WriteLine(env.IsDevelopment());
            if (env.IsDevelopment())
            {
                app.UseHsts();

                //app.UseDeveloperExceptionPage();

            }

            app.UseResponseCompression();
            /*
            app.UseFileServer(new FileServerOptions
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "../frontend/dist")),
                    RequestPath = "",
                    EnableDefaultFiles = true,
                    EnableDirectoryBrowsing = true
            });
            */
            app.UseCors(policy => policy
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
               .WithOrigins("http://localhost:5000", "http://localhost:4000"));

            //, "http://localhost:5000" "http://localhost:4000"

            var fileServerOptions = new FileServerOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../frontend/dist")),
                RequestPath = "",
                EnableDirectoryBrowsing = false,
                EnableDefaultFiles = true
            };

            // try to find a static file that matches the request
            app.UseFileServer(fileServerOptions);

            // no static file, try to find an MVC controller
            //app.UseMvc();
            
            // if we made it this far and the route still wasn't matched, return the index
            /*app.Use(async (context, next) =>
            {
                context.Request.Path = "/";
                await next();
            });*/
            
            // send the request through the static file middleware one last time to find your default file
            app.UseFileServer(fileServerOptions);


            //app.UseHttpsRedirection();

            app.UseRouting();

   

            app.UseAuthentication();
            app.UseAuthorization();
       

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

using Chronometer.Hubs;
using Chronometer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chronometer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChronometerController : ControllerBase
    {
        private static readonly Dictionary<int, ChronometerService> _chronometerServices = new();
        private readonly IHubContext<ChatHub> _chronometerHubContext;

        public ChronometerController(IHubContext<ChatHub> chronometerHubContext)
        {
            _chronometerHubContext = chronometerHubContext;
        }

        // GET: api/<ChronometerController>
        [HttpGet]
        public Task<ChronometerModel[]> Get()
        {
            var models = _chronometerServices.Values.Select(cs => cs.GetModel()).ToArray();
            return Task.FromResult(models);
        }

        // GET api/<ChronometerController>/5
        [HttpGet("{id}")]
        public Task<ChronometerModel> Get(int id)
        {
            if (!_chronometerServices.TryGetValue(id, out var result))
            {
                throw new Exception($"Timer with id {id} does not exists");
            }
            return Task.FromResult(result.GetModel());
        }

        // POST api/<ChronometerController>
        [HttpPost]
        public async Task Post()
        {
            var model = ChronometerModelFactory.Create();
            if (!_chronometerServices.TryAdd(model.ID, new ChronometerService(model)))
            {
                throw new Exception($"Timer with {model.ID} already exists");
            }
            await _chronometerHubContext.Clients.All.SendAsync("Add", model);
        }

        // PUT api/<ChronometerController>/5
        [HttpPut]
        public async Task Put([FromBody] ChronometerModel value)
        {
            int id = value.ID;
            if (!_chronometerServices.ContainsKey(id))
            {
                throw new Exception($"Chronometer with id {id} does not exist");
            }
            _chronometerServices[id].Update(
                new ChronometerModel(
                    id, 
                    new TimeSpanModel(value.Timer.Minutes, value.Timer.Seconds, value.Timer.Milliseconds), 
                    !value.IsRunning
                )
            );
            await _chronometerHubContext.Clients.All.SendAsync("Update", _chronometerServices[id].GetModel());
        }

        // DELETE api/<ChronometerController>/5
        [HttpDelete]
        public async Task Delete([FromBody]int id)
        {
            if (!_chronometerServices.ContainsKey(id))
            {
                throw new Exception($"Chronometer with id {id} does not exist");
            }
            _chronometerServices.Remove(id);
            await _chronometerHubContext.Clients.All.SendAsync("Delete", id);
        }
    }
}

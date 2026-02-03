
using Microsoft.EntityFrameworkCore;
using Todo.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy//ルールの中身を設定
            .WithOrigins("http://localhost:5173",
"https://salmon-stone-0a038d500.4.azurestaticapps.net")//React と通信するため
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("TodoContext"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    )
);


var app = builder.Build();

// Swagger を本番でも有効化
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.Run();


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
            .WithOrigins("http://localhost:5173")//React と通信するため
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

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();//エラーが起きたとき、詳細(しょうさい）detailsなエラー画面を表示
    app.UseSwagger();//API の情報ていぎdefine（定義）を作る
    app.UseSwaggerUI(); //ブラウザで API をテストできる画面を表示する
}


app.UseHttpsRedirection();//HTTP で来たアクセスを、自動的に HTTPS に変換。
app.UseCors("AllowReactApp"); //Reactからのアクセスを確認

app.UseAuthorization();//認可をチェック

app.MapControllers();//リクエストされた URL や HTTP メソッドに合ったController のメソッドを動かす

app.Run();// アプリを起動して、リクエストリクエストを ずっと待つ。
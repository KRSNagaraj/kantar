using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(KantarOAuthApp.Startup))]
namespace KantarOAuthApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

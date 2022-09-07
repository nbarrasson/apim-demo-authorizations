

using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyAmbassadorDemo.Function
{
  public class ReadCommentsJob {
    private ApimService _apimService;
    private string ApimServiceUrl = Environment.GetEnvironmentVariable("APIM_SERVICE_URL");
    private string ApimServiceSubscriptionKey = Environment.GetEnvironmentVariable("APIM_SERVICE_SUBSCRIPTION_KEY");

    public ReadCommentsJob() {
      _apimService = new ApimService(ApimServiceUrl,ApimServiceSubscriptionKey);
    }

     public async Task RunAsync() {
        var comments = await _apimService.ListDiscussionCommentsAsync();
        var newComments = comments.Where(c => c.CreatedAt > DateTimeOffset.UtcNow.AddSeconds(-12)).ToArray();
        var aliases = newComments.Where(c => c.Body.Contains(" - ")).Select(c => c.Body.Split(" - ")[0]).ToArray();

        if (aliases.Any()) {
          var result = await _apimService.PostDiscussionCommentAsync(aliases);
        }
    }
  }
}
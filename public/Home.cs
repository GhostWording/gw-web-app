using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Web;

namespace Cyrano.UI.Web.Site.Generic
{
    /*
    public class AngularRoutePatternMatcher : IRoutePatternMatcher
    {
        public IRoutePatternMatchResult Match(string requestedPath, string routePath, IEnumerable<string> segments, NancyContext context)
        {
            if (routePath.ToLowerInvariant().Contains("angular"))
            {
                return new AngularRoutePatternMatchResult(context,true,new DynamicDictionary());
            } 
            return new RoutePatternMatchResult(false,new DynamicDictionary(), context);
        }
    }

    public class AngularRoutePatternMatchResult : IRoutePatternMatchResult
    {
        public NancyContext Context { get; private set; }
        public bool IsMatch { get; private set; }
        public DynamicDictionary Parameters { get; private set; }

        public AngularRoutePatternMatchResult(NancyContext context, bool isMatch, DynamicDictionary parameters)
        {
            Parameters = parameters;
            IsMatch = isMatch;
            Context = context;
        }
    }
    public class GenericApplicationBoostrapper : DefaultNancyBootstrapper
    {
        public void ConfigureConventions(NancyConventions conventions)
        {
            conventions.StaticContentsConventions.Add(
                    StaticContentConventionBuilder.AddDirectory("assets", @"assets")
                );
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("scripts", @"Scripts")
            );
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("views", @"views")
            );
        }

        protected virtual NancyInternalConfiguration InternalConfiguration
        {
            get
            {
                return NancyInternalConfiguration.WithOverrides(
                    x => x.RoutePatternMatcher = typeof (AngularRoutePatternMatcher));
            }
        }
    }
    public class Home : NancyModule
    {
        public Home()
        {
            Get[@"{angular-views}"] = _ =>
            {
                return View["index.html"];
            };
            //Get[@"/areas/(.*)"] = _ => View["index.html"];
        }
    }
     * */
}
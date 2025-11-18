---
title: .NET Useful Package - commandline
bgImageUrl: assets/images/29/29-0.jpeg
description: A useful package commandline, which parses CLI parameters and uses Attributes to set options
published: true
tags: [csharp, dotnet, command-line, tool]
---

In the .NET Framework, there was no built-in CLI command parameter parsing. In .NET Core, although there is a package [System.CommandLine](https://www.nuget.org/packages/System.CommandLine), I don't think it is very easy to use. I have found a package [commandline](https://github.com/commandlineparser/commandline) before. The setting and reading reference are very simple and easy to use. I will write a review to share with you.

## Setting

```csharp
public class DefaultOptions
    {

        [Option('n', "name", Required = true, HelpText = "Name")]
        public string Name { get; set; }

        [Option('r', "retry", HelpText = "Whether to re-execute")]
        public bool Retry { get; set; }

        [Option('d', "date", HelpText = "Date to be executed")]
        public string Date { get; set; }
    }

```

First, create an Options class. `Commandline` will map properties and CLI parameters through `Attribute`. You can refer to the [document](https://github.com/commandlineparser/commandline/wiki/Option-Attribute), so the first parameter sets the short name, and the second parameter sets the full name, which looks very easy to understand.

## Parsing parameters

```csharp
await Parser.Default.ParseArguments<DefaultOptions>(args).WithParsedAsync(RunJob);

 async Task RunJob(DefaultOptions options)
{
    //do something
    Console.WriteLine($"name:{options.Name}");
}
```

Use `ParseArguments` and `WithParsedAsync` to parse the parameters and get the options object, which is also very easy to understand.

<img class="img-responsive" loading="lazy" src="assets/images/29/29-1.png">

Then you can use the familiar [unix style](https://github.com/commandlineparser/commandline/wiki/CommandLine-Grammar) to set the parameters to execute.

## Another way

<img class="img-responsive" loading="lazy" src="assets/images/29/29-2.png">

Sometimes it is necessary to obtain different Options objects according to different parameters. After looking at the source file, I found that `ParseArguments` has another multi-loading method, which can be passed in a factory method to determine the output Options object.

```csharp
public class ActionAOptions: DefaultOptions
 {
        [Option('a', "action")]
        public string Action { get; set; }
  }

await Parser.Default.ParseArguments<DefaultOptions>(SelectOptions(args), args)
.WithParsedAsync(RunJob2);

async Task RunJob2(DefaultOptions options)
{
    var actionOptions = (ActionAOptions)options;

    //do something
    Console.WriteLine($"name:{actionOptions.Name}, action:{actionOptions.Action}");
}

Func<DefaultOptions> SelectOptions(string[] args)
{
    return () =>
    {
        var isAction = args[1]?.IndexOf("action") != -1;
        if (isAction)
        {
            return new ActionAOptions();
        }
        return new DefaultOptions();
    };
}
```

<img class="img-responsive" loading="lazy" src="assets/images/29/29-3.png">

As in the code above, you can retrieve different options objects according to different names. For example, when the name (-n/--name) is action, you can pass in an additional parameter action.

## Conclusion

In summary, using a command line parameter parsing tool can make it easier for us to process parameters, which not only makes the code more readable, but also makes program development easier. Through a simple setting and analysis process, we can focus more on the actual work. This method not only improves efficiency, but also increases the overall readability of the code.

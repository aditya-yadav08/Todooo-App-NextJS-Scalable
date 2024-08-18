import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
const gemini = apiKey.getGenerativeModel({ model: "gemini-1.5-flash",generationConfig: { responseMimeType: "application/json" } });

export const suggestMissingItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId,
    });
    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId,
    });
    const projectName = project?.name || "";

    let prompt = `
    I'm a project manager and I need help identifying missing to-do items.
    I have a list of existing tasks: ${JSON.stringify(todos)}, containing objects with 'taskName' and 'description' properties.
    Can you help me identify 5 additional to-do items for the project that is not yet included in this list?
    I also have a good understanding of the project scope, which is ${projectName}.
    Please provide the missing item as a task name and description.
    Ensure there are no duplicates between the existing list and the new suggestion.
    Using this JSON schema (Note: Also dont include project name in description):
    { "taskName": "type": "string",
      "description": "type": "string"},
    }`;

    const result = await gemini.generateContent(prompt);
    const res = result.response.text();
    const cleanedResponse = res.replace(/^'/, '').replace(/['\n]/g, '');
    const tasks = JSON.parse(cleanedResponse);

    console.log(tasks)

    for (const task of tasks) {
      const { taskName, description } = task;

      if (taskName && description) {
        const AI_LABEL_ID = "k574vq4y8w9t2qv80kcfktv6w96z1dad";

        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID as Id<"labels">,
        });
      }
    }
    
    // const suggestedTodo = {
    //   taskName: res.split('**Task Name:**')[1].split('\n')[0].trim().replace(/\*/g, ''),
    //   description: res.split('**Description:**')[1].split('\n')[0].trim(),
    // };
    // console.log(suggestedTodo?.taskName);
    // console.log(suggestedTodo?.description);

    // const taskName = suggestedTodo?.taskName;
    // const description = suggestedTodo?.description;

    // if (taskName && description) {
    //   const AI_LABEL_ID = "k574vq4y8w9t2qv80kcfktv6w96z1dad";

      // await ctx.runMutation(api.todos.createATodo, {
      //   taskName,
      //   description,
      //   priority: 1,
      //   dueDate: new Date().getTime(),
      //   projectId,
      //   labelId: AI_LABEL_ID as Id<"labels">,
      // });
    // }
  },
});

// import OpenAI from "openai";

// const apiKey = process.env.OPEN_AI_KEY;
// const openai = new OpenAI({ apiKey });

// export const suggestMissingItemsWithAi = action({
//   args: {
//     projectId: v.id("projects"),
//   },
//   handler: async (ctx, { projectId }) => {
//     //retrieve todos for the user
//     const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
//       projectId,
//     });

//     const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
//       projectId,
//     });
//     const projectName = project?.name || "";

//     const response = await openai.chat.completions.create({
//   messages: [
//     {
//       role: "system",
//       content:
//         "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 1 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
//     },
//     {
//       role: "user",
//       content: JSON.stringify({
//         todos,
//         projectName,
//       }),
//     },
//   ],
//   response_format: {
//     type: "json_object",
//   },
//   model: "gpt-3.5-turbo",
//     });

// console.log(response.choices[0]);

// const messageContent = response.choices[0].message?.content;

// console.log({ messageContent });

//     // create the todos
//     if (messageContent){
//       const items = JSON.parse(messageContent)?.todos ?? [];
//       const AI_LABEL_ID = "k574vq4y8w9t2qv80kcfktv6w96z1dad";

//       for (let i = 0; i < items.length; i++) {
//         const { taskName, description } = items[i];
//         await ctx.runMutation(api.todos.createATodo, {
//           taskName,
//           description,
//           priority: 1,
//           dueDate: new Date().getTime(),
//           projectId,
//           labelId: AI_LABEL_ID as Id<"labels">,
//         });
//       }
//     }
//   },
// });

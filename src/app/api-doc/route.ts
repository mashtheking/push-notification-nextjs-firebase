import { ApiReference } from "@scalar/nextjs-api-reference";
import { createSwaggerSpec } from "next-swagger-doc";

export const GET = ApiReference({
  metaData: {
    title: "NgodingBang Push Notification API",
  },
  spec: {
    content: createSwaggerSpec({
      apiFolder: "src/app/api",
      definition: {
        openapi: "3.0.0",
        info: {
          title: "NgodingBang Push Notification API",
          version: "1.0.0",
          license: {
            name: "MIT",
            url: "https://github.com/ngodingbang/push-notification-nextjs-firebase/blob/main/LICENSE.md",
          },
        },
        tags: [
          {
            name: "Subscription",
            description: "Subscription CRUD API.",
          },
        ],
      },
    }),
  },
});

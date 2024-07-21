import { admin } from "@/lib/firebase/admin";
import { model } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/subscriptions/send-notifications:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: send notifications
 *     description: Sending notifications to all subscription list.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               notification:
 *                 title: Test Notification from API
 *                 body: This is the content of the notification.
 *                 tags: notification
 *                 image_url: https://gravatar.com/userimage/71119300/6b6cd6023f4acf6ced4f28778f516703?size=256
 *               webpush:
 *                 fcm_options:
 *                   link: https://localhost:3000
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Connection:
 *             schema:
 *               type: string
 *               example: keep-alive
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/json
 *           Date:
 *             schema:
 *               type: string
 *               example: Mon, 15 Jul 2024 06:39:30 GMT
 *           Keep-Alive:
 *             schema:
 *               type: string
 *               example: timeout=5
 *           Transfer-Encoding:
 *             schema:
 *               type: string
 *               example: chunked
 *           Vary:
 *             schema:
 *               type: string
 *               example: RSC, Next-Router-State-Tree, Next-Router-Prefetch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 data:
 *                 - id: "00b8e4b7-1fe3-4218-b317-0fd1b6561293"
 *                   token: "cYKdXoM8OceESqgX5SyKon:APA91bHxO6rkhkey5OE0slBVZVjwqmL86CILnXnhUIbn7MyNo8awx1-_h7mfT0bJoSSRYXWOUVY9xmLnznvHnd3krJ4ML-34tYUOA8Wzi5VeOp9hT2Glm3zDsie87NMrvht1hiGEFLp2"
 *                   created_at: "2024-07-19T08:54:05.677Z"
 *                   updated_at: "2024-07-19T08:54:05.677Z"
 *                 - id: "67b41d51-0652-498c-a210-664aac28d0a5"
 *                   token: "cYKdXoM8OceESqgX5SyKon:APA91bEU54k1WyUI-F0TFOkjptNIJk29Vy70MUY2IflTvD73-GlbujVg2kEBBqJaN8U7v4QQQuO4qSFaPWUqi4MeTi9Q29X1KJGeNxkUCXvyPEmKY8DB0Ulz_fi5juj1MXEbwETxOw2Z"
 *                   created_at: "2024-07-19T09:15:26.368Z"
 *                   updated_at: "2024-07-19T09:15:26.368Z"
 *                 batchResponses:
 *                   responses:
 *                   - success: "false"
 *                     error:
 *                       code: "messaging/registration-token-not-registered"
 *                       message: "Requested entity was not found."
 *                   - success: "true"
 *                     messageId: "projects/push-notification-20240707/messages/40a5ccc0-7de2-49a6-a5d6-a2f1317573ee"
 *                   successCount: "1"
 *                   failureCount: "1"
 *       422:
 *         description: Unprocessable Entity
 *         headers:
 *           Connection:
 *             schema:
 *               type: string
 *               example: keep-alive
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/json
 *           Date:
 *             schema:
 *               type: string
 *               example: Mon, 15 Jul 2024 06:39:30 GMT
 *           Keep-Alive:
 *             schema:
 *               type: string
 *               example: timeout=5
 *           Transfer-Encoding:
 *             schema:
 *               type: string
 *               example: chunked
 *           Vary:
 *             schema:
 *               type: string
 *               example: RSC, Next-Router-State-Tree, Next-Router-Prefetch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 errors:
 *                   - code: invalid_type
 *                     expected: string
 *                     received: undefined
 *                     path:
 *                       - data
 *                       - token
 *                     message: Required
 *       400:
 *         description: Bad Request
 *         headers:
 *           Connection:
 *             schema:
 *               type: string
 *               example: keep-alive
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/json
 *           Date:
 *             schema:
 *               type: string
 *               example: Mon, 15 Jul 2024 06:39:30 GMT
 *           Keep-Alive:
 *             schema:
 *               type: string
 *               example: timeout=5
 *           Transfer-Encoding:
 *             schema:
 *               type: string
 *               example: chunked
 *           Vary:
 *             schema:
 *               type: string
 *               example: RSC, Next-Router-State-Tree, Next-Router-Prefetch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Subscription list is empty.
 */
export async function POST(request: NextRequest) {
  const parsedRequest = z
    .object({
      notification: z.object({
        title: z.string().optional(),
        body: z.string().optional(),
        tags: z.string().optional(),
        image_url: z.string().optional(),
      }),
      webpush: z
        .object({
          fcm_options: z
            .object({
              link: z.string(),
            })
            .optional(),
        })
        .optional(),
    })
    .safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { errors: parsedRequest.error.errors },
      { status: 422 },
    );
  }

  const parsedRequestData = parsedRequest.data || {};

  const subscriptions = await model.subscription.findMany({
    orderBy: { created_at: "asc" },
  });

  if (subscriptions.length < 1) {
    return NextResponse.json(
      { message: "Subscription list is empty." },
      { status: 400 },
    );
  }

  const batchResponses = await admin.messaging().sendEach(
    subscriptions.map((subscription) => ({
      token: subscription.token,
      notification: {
        title: parsedRequestData.notification.title,
        body: parsedRequestData.notification.body,
        imageUrl: parsedRequestData.notification.image_url,
      },
      webpush: {
        notification: {
          tag: parsedRequestData.notification.tags,
        },
        fcmOptions: {
          link: parsedRequestData.webpush?.fcm_options?.link,
        },
      },
      android: {
        notification: {
          tag: parsedRequestData.notification.tags,
        },
      },
    })),
  );

  return NextResponse.json({
    data: subscriptions,
    batchResponses,
  });
}

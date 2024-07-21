import { admin } from "@/lib/firebase/admin";
import { model } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/subscriptions/{id}/send-notification:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: send notification
 *     description: Sending notifications to specified subscription list.
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         example: 5d4795e8-b2f4-4501-aae6-188744bef508
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
 *                 fcmMessageId: projects/push-notification-20240707/messages/56bbdbf2-57e5-4de4-ada9-5b82d07f37ae
 *                 data:
 *                   id: cbb561dd-557b-4555-83e0-c3185d9d369f
 *                   token: eGjAzQ4gYCnFFB6NgM4qDO:APA91bESLcpKW7rCtFnwQpXacju51dfygRJvZHXKPN5_K02E_5wNFGR_Sbp88jLQ3ld_lP4WLmv4hJt9rhY-K8duSCndPobvR5kfcOQnyYaNbf0s52AOpJQ1RB7VZ-z-igj68c3K_iXa
 *                   created_at: '2024-07-19T07:20:41.526Z'
 *                   updated_at: '2024-07-19T07:20:41.526Z'
 *       404:
 *         description: Not Found
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
 *                   message: Not found
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const data = await model.subscription.findFirst({
    where: { id },
  });

  if (data === null) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

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

  const fcmMessageId = await admin.messaging().send({
    token: data.token,
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
  });

  return NextResponse.json({ fcmMessageId, data });
}

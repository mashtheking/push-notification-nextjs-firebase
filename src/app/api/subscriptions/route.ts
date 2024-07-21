import { model } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: index
 *     description: Get list of subscriptions data.
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
 *                   - id: 5d4795e8-b2f4-4501-aae6-188744bef508
 *                     token: >-
 *                       eGjAzQ4gYCnFFB6NgM4qDO:APA91bHQrX6A_C5sBCCCV5tlpIbQrZJR_Gzsx5UTAerWzV5CZXvMb34sglsAH_olD5mW1E5X5nZfij3JigbR34CafNEd02UHK6c4SWYI6orPSOKDGcwfAj_YqqQZDNqvWxsI9G9FDs9m
 *                     created_at: '2024-07-15T07:27:42.587Z'
 *                     updated_at: '2024-07-15T07:27:42.587Z'
 */
export async function GET() {
  const data = await model.subscription.findMany({
    orderBy: { created_at: "asc" },
  });

  return NextResponse.json({ data });
}

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: store
 *     description: Create a new subscription data.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               data:
 *                 token: >-
 *                   eGjAzQ4gYCnFFB6NgM4qDO:APA91bHQrX6A_C5sBCCCV5tlpIbQrZJR_Gzsx5UTAerWzV5CZXvMb34sglsAH_olD5mW1E5X5nZfij3JigbR34CafNEd02UHK6c4SWYI6orPSOKDGcwfAj_YqqQZDNqvWxsI9G9FDs9m
 *     responses:
 *       201:
 *         description: Created
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
 *                   id: 5d4795e8-b2f4-4501-aae6-188744bef508
 *                   token: >-
 *                     eGjAzQ4gYCnFFB6NgM4qDO:APA91bHQrX6A_C5sBCCCV5tlpIbQrZJR_Gzsx5UTAerWzV5CZXvMb34sglsAH_olD5mW1E5X5nZfij3JigbR34CafNEd02UHK6c4SWYI6orPSOKDGcwfAj_YqqQZDNqvWxsI9G9FDs9m
 *                   created_at: '2024-07-15T07:13:22.767Z'
 *                   updated_at: '2024-07-15T07:13:22.767Z'
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
 */
export async function POST(request: NextRequest) {
  const parsedRequest = z
    .object({
      data: z.object({
        token: z.string(),
      }),
    })
    .safeParse(await request.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      { errors: parsedRequest.error.errors },
      { status: 422 },
    );
  }

  const {
    data: { token },
  } = parsedRequest.data || {};

  const data = await model.subscription.upsert({
    where: { token },
    create: { token },
    update: {},
  });

  return NextResponse.json({ data }, { status: 201 });
}

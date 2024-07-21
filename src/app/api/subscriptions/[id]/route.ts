import { model } from "@/models";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: show
 *     description: Get a specified subscription data based on the given id.
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         example: 5d4795e8-b2f4-4501-aae6-188744bef508
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
 *                   id: 5d4795e8-b2f4-4501-aae6-188744bef508
 *                   token: >-
 *                     eGjAzQ4gYCnFFB6NgM4qDO:APA91bHQrX6A_C5sBCCCV5tlpIbQrZJR_Gzsx5UTAerWzV5CZXvMb34sglsAH_olD5mW1E5X5nZfij3JigbR34CafNEd02UHK6c4SWYI6orPSOKDGcwfAj_YqqQZDNqvWxsI9G9FDs9m
 *                   created_at: '2024-07-15T07:13:22.767Z'
 *                   updated_at: '2024-07-15T07:13:22.767Z'
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
export async function GET(
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

  return NextResponse.json({ data });
}

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     tags:
 *       - Subscription
 *     summary: destroy
 *     description: Delete a specified subscription data based on the given id.
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         example: 5d4795e8-b2f4-4501-aae6-188744bef508
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
 *                 message: Subscription deleted successfully
 *                 data:
 *                   id: 5d4795e8-b2f4-4501-aae6-188744bef508
 *                   token: >-
 *                     eGjAzQ4gYCnFFB6NgM4qDO:APA91bHQrX6A_C5sBCCCV5tlpIbQrZJR_Gzsx5UTAerWzV5CZXvMb34sglsAH_olD5mW1E5X5nZfij3JigbR34CafNEd02UHK6c4SWYI6orPSOKDGcwfAj_YqqQZDNqvWxsI9G9FDs9m
 *                   created_at: '2024-07-15T07:13:22.767Z'
 *                   updated_at: '2024-07-15T07:13:22.767Z'
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  let data = await model.subscription.findFirst({
    where: { id },
  });

  if (data === null) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  data = await model.subscription.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Subscription deleted successfully",
    data,
  });
}

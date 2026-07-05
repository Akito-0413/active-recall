import { NextResponse } from "next/server";

import { createRecallLog } from "@/features/recall-logs/services/recall-log-service";
import { customGptRecallLogCreateSchema } from "@/features/recall-logs/validation";
import { getRecallApiKey, isMissingEnvironmentError } from "@/lib/env";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function extractBearerToken(header: string | null) {
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export async function POST(request: Request) {
  const bearerToken = extractBearerToken(request.headers.get("authorization"));

  try {
    if (!bearerToken || bearerToken !== getRecallApiKey()) {
      return errorResponse(401, "unauthorized", "Unauthorized");
    }

    const json = await request.json();
    const parsed = customGptRecallLogCreateSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse(400, "validation_error", "入力値が不正です。");
    }

    const recallLog = await createRecallLog(parsed.data);

    return NextResponse.json({
      data: recallLog,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(400, "invalid_json", "JSON形式が不正です。");
    }

    if (isMissingEnvironmentError(error)) {
      return errorResponse(
        500,
        "missing_configuration",
        "サーバー設定が不足しています。",
      );
    }

    return errorResponse(
      500,
      "internal_server_error",
      "学習ログを保存できませんでした。",
    );
  }
}

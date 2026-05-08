import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    /**
     * 仅保留最可靠的探测方式：
     * 1. 线上环境：从代理头（Vercel/Cloudflare）读取出口 IP。
     * 2. 本地环境：直接引导用户通过点击同步来捕获（100% 准确）。
     */
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");

    let detectedIp = "";
    if (forwarded) {
      detectedIp = forwarded.split(",")[0].trim();
    } else if (realIp) {
      detectedIp = realIp;
    } else {
      // 在一些环境中，可以通过这种方式获取
      detectedIp = (req as any).ip || "";
    }

    if (detectedIp.startsWith("::ffff:")) {
      detectedIp = detectedIp.substring(7);
    }

    if (!detectedIp || detectedIp === "127.0.0.1" || detectedIp === "localhost") {
      return NextResponse.json({ ip: "本地环境（请点击下方按钮探测）" });
    }

    return NextResponse.json({ ip: detectedIp });
  } catch (_err) {
    return NextResponse.json({ ip: "点击探测按钮获取真值" });
  }
}

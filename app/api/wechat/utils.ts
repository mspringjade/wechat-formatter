import axios from "axios";
import sharp from "sharp";
import { JSDOM } from "jsdom";

const WECHAT_API_BASE = "https://api.weixin.qq.com/cgi-bin";

/**
 * 获取微信 Access Token
 */
export async function getWeChatAccessToken(appId: string, appSecret: string): Promise<string> {
  const url = `${WECHAT_API_BASE}/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const res = await axios.get(url);
  
  if (res.data.errcode) {
    const errMsg = res.data.errmsg || "";
    // 微信 40164 报错格式：invalid ip 124.77.214.246 ipv6 ::ffff:124.77.214.246, not in whitelist
    if (res.data.errcode === 40164) {
      const ipMatch = errMsg.match(/invalid ip ([0-9.]+)/);
      const detectedIp = ipMatch ? ipMatch[1] : "";
      const error = new Error(detectedIp ? `IP白名单错误：请将 IP [${detectedIp}] 加入微信后台白名单` : errMsg);
      (error as any).errcode = 40164;
      (error as any).detectedIp = detectedIp;
      throw error;
    }
    throw new Error(`获取微信 AccessToken 失败: ${res.data.errmsg} (${res.data.errcode})`);
  }
  
  return res.data.access_token;
}

/**
 * 上传正文图片到微信服务器
 */
export async function uploadImageToWeChat(accessToken: string, imageBuffer: Buffer, filename: string): Promise<string> {
  // 微信要求图片 < 1MB 且仅支持 jpg/png
  let processedBuffer = imageBuffer;
  const metadata = await sharp(imageBuffer).metadata();
  
  if (imageBuffer.length > 1024 * 1024 || (metadata.format !== 'jpeg' && metadata.format !== 'png')) {
    processedBuffer = await sharp(imageBuffer)
      .resize(1080, undefined, { withoutEnlargement: true })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
  }

  const url = `${WECHAT_API_BASE}/media/uploadimg?access_token=${accessToken}`;
  
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(processedBuffer)], { type: 'image/jpeg' });
  formData.append('media', blob, filename.endsWith('.png') || filename.endsWith('.jpg') ? filename : `${filename}.jpg`);

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`图片转存微信失败: ${data.errmsg} (${data.errcode})`);
  }
  
  return data.url;
}

/**
 * 上传封面图（永久素材）
 */
export async function uploadCoverToWeChat(accessToken: string, imageBuffer: Buffer, filename: string): Promise<string> {
  let processedBuffer = imageBuffer;
  if (imageBuffer.length > 1024 * 1024) {
    processedBuffer = await sharp(imageBuffer)
      .resize(900, 383, { fit: 'cover' }) // 封面图推荐比例
      .toFormat('jpeg', { quality: 85 })
      .toBuffer();
  }

  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${accessToken}&type=image`;
  
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(processedBuffer)], { type: 'image/jpeg' });
  formData.append('media', blob, filename);

  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  
  const data = await res.json();
  if (data.errcode) {
    throw new Error(`封面图上传失败: ${data.errmsg} (${data.errcode})`);
  }
  
  return data.media_id;
}

/**
 * 处理正文内容：转存图片并替换 URL
 */
export async function processHtmlImages(accessToken: string, html: string): Promise<string> {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const imgs = Array.from(doc.querySelectorAll("img"));

  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (!src) continue;

    try {
      let imageBuffer: Buffer;
      let filename = "image.jpg";

      if (src.startsWith("data:image")) {
        // 处理 Base64
        const base64Data = src.split(",")[1];
        imageBuffer = Buffer.from(base64Data, "base64");
        const mime = src.match(/data:image\/([^;]+);/)?.[1] || "jpeg";
        filename = `image.${mime}`;
      } else if (src.startsWith("http")) {
        // 处理外部链接
        const res = await axios.get(src, { responseType: "arraybuffer" });
        imageBuffer = Buffer.from(res.data);
        filename = src.split("/").pop() || "image.jpg";
      } else {
        continue;
      }

      const wechatUrl = await uploadImageToWeChat(accessToken, imageBuffer, filename);
      img.setAttribute("src", wechatUrl);
      // 微信 <img> 标签推荐加上 data-src
      img.setAttribute("data-src", wechatUrl);
    } catch (err) {
      console.error(`处理图片失败 [${src}]:`, err);
      // 图片失败时保留原样或占位，不阻断全文同步
    }
  }

  return doc.body.innerHTML;
}

/**
 * 新建草稿
 */
export async function addWeChatDraft(
  accessToken: string,
  title: string,
  content: string,
  thumbMediaId: string,
  author: string = "",
  digest: string = ""
): Promise<string> {
  const url = `${WECHAT_API_BASE}/draft/add?access_token=${accessToken}`;
  
  const res = await axios.post(url, {
    articles: [{
      title,
      author,
      digest,
      content,
      thumb_media_id: thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0
    }]
  });
  
  if (res.data.errcode) {
    throw new Error(`新建草稿失败: ${res.data.errmsg} (${res.data.errcode})`);
  }
  
  return res.data.media_id;
}

import { track } from "@vercel/analytics";
import {
  ExternalLink,
  HelpCircle,
  ImageIcon,
  Key,
  Loader2,
  Send,
  ShieldCheck,
  Star,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  WeChatAccountConfig,
  WeChatSyncRequest,
  WeChatSyncResponse,
  WeChatSyncStatus,
} from "../_types/wechat";

type WeChatSyncModalProps = {
  open: boolean;
  onClose: () => void;
  html: string;
  markdown: string;
  title: string;
  config: WeChatAccountConfig;
  onSaveConfig: (config: WeChatAccountConfig) => void;
  showToast: (message: string, type: "success" | "error") => void;
  isLicenseActive: boolean;
  licenseKey: string;
  onShowLicense: () => void;
};

export function WeChatSyncModal({
  open,
  onClose,
  html,
  markdown,
  title,
  config,
  onSaveConfig,
  showToast,
  isLicenseActive,
  licenseKey,
  onShowLicense,
}: WeChatSyncModalProps) {
  const [activeTab, setActiveTab] = useState<"sync" | "config">("sync");
  const [draftConfig, setDraftConfig] = useState<WeChatAccountConfig>(config);
  const [editTitle, setEditTitle] = useState<string>(title);
  const [status, setStatus] = useState<WeChatSyncStatus>("idle");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [serverIp, setServerIp] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraftConfig(config);
      setEditTitle(title);
      setErrorDetails("");
      setStatus("idle");

      // 自动尝试从 HTML 提取第一张图作为默认封面预览
      const imgMatch = html.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        setCoverImage(imgMatch[1]);
      } else {
        setCoverImage("");
      }
    }
  }, [open, config, html, title]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSync = async () => {
    if (!isLicenseActive) {
      onShowLicense();
      return;
    }

    if (!draftConfig.appId || !draftConfig.appSecret) {
      setActiveTab("config");
      showToast("请先完成公众号配置", "error");
      return;
    }

    setStatus("authorizing");
    setErrorDetails("");
    track("wechat_sync_started");

    try {
      // 模拟步骤感，让用户觉得程序在努力工作
      const timer1 = setTimeout(() => setStatus("uploading_images"), 1500);
      const timer2 = setTimeout(() => setStatus("creating_draft"), 4000);

      const requestData: WeChatSyncRequest = {
        html,
        markdown,
        title: editTitle || "未命名文章",
        config: draftConfig,
        coverImage: coverImage,
      };

      const response = await fetch("/api/wechat/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TypeZen-License": licenseKey,
        },
        body: JSON.stringify(requestData),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      let data: WeChatSyncResponse;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(
          response.ok
            ? "服务器响应格式错误"
            : `服务器错误 (${response.status}): ${text.slice(0, 100)}`,
        );
      }

      if (data.success) {
        setStatus("success");
        showToast("同步成功！", "success");
        track("wechat_sync_succeeded");
      } else {
        setStatus("error");
        setErrorDetails(data.details || data.error || "未知错误");
        track("wechat_sync_failed", { error: data.error || "unknown" });
        // 如果后端返回了精准检测到的 IP，更新它
        if (data.detectedIp) {
          setServerIp(data.detectedIp);
        }
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorDetails(err instanceof Error ? err.message : "请求失败");
      track("wechat_sync_failed", { error: "network_error" });
    }
  };

  const handleSaveConfig = () => {
    onSaveConfig(draftConfig);
    showToast("配置已保存到本地", "success");
    // 保存配置后不直接切回同步，给用户一个确认感
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="neo-modal flex flex-col max-w-lg w-full mx-4 transform transition-all max-h-[90vh] shadow-[12px_12px_0_0_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 shrink-0 border-b-[3px] border-(--neo-ink) bg-(--neo-surface)">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--neo-green) border-2 border-(--neo-ink) shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-(--neo-ink) uppercase leading-none">
                微信同步
              </h3>
              <p className="text-[10px] neo-text-muted font-bold mt-1 uppercase tracking-wider">
                Push to Official Account Drafts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-(--neo-ink) hover:bg-(--neo-pink) transition-colors font-black"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-[3px] border-(--neo-ink) bg-white">
          <button
            onClick={() => setActiveTab("sync")}
            className={`flex-1 py-3 font-black text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === "sync"
                ? "bg-(--neo-green) text-white"
                : "hover:bg-(--neo-green)/10 text-(--neo-ink)"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            内容确认
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`flex-1 py-3 font-black text-xs uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === "config"
                ? "bg-(--neo-yellow) text-(--neo-ink)"
                : "hover:bg-(--neo-yellow)/10 text-(--neo-ink)"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            账号配置
          </button>
          <button
            onClick={onShowLicense}
            className={`px-4 py-3 font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 border-l-[3px] border-(--neo-ink) ${
              isLicenseActive
                ? "bg-(--neo-green)/10 text-(--neo-green)"
                : "bg-(--neo-pink)/10 text-(--neo-pink)"
            }`}
          >
            <Key className="w-3 h-3" />
            {isLicenseActive ? "Pro" : "激活"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto neo-scrollbar p-6 bg-(--neo-surface)/30">
          {activeTab === "sync" ? (
            <div className="space-y-6">
              {status === "success" ? (
                <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-(--neo-green) border-[3px] border-(--neo-ink) flex items-center justify-center shadow-[6px_6px_0_0_var(--neo-ink)]">
                      <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-(--neo-ink)">推送成功！</h4>
                    <p className="text-sm font-bold text-(--neo-muted)">
                      文章已安全到达公众号草稿箱
                    </p>
                  </div>

                  <div className="bg-(--neo-yellow) border-[3px] border-(--neo-ink) p-4 text-left shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <p className="text-xs font-black flex items-center gap-1 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-(--neo-ink)" />
                      接下来该做什么？
                    </p>
                    <p className="text-[11px] font-bold text-(--neo-ink) leading-relaxed">
                      受限于微信 API 规则，同步后的文章处于“草稿”状态。请登录{" "}
                      <span className="bg-black text-white px-1 mx-0.5">微信公众平台</span>
                      ，在【草稿箱】中进行最后的预览并手动点击“发布”。
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href="https://mp.weixin.qq.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="neo-button bg-(--neo-green) text-white w-full py-4 inline-flex items-center justify-center gap-2 font-black text-lg"
                    >
                      立即去发布 <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-xs font-black underline text-(--neo-muted) hover:text-(--neo-ink)"
                    >
                      返回修改再次同步
                    </button>
                  </div>
                </div>
              ) : status === "idle" ? (
                <div className="space-y-6">
                  {/* Article Card */}
                  <div className="border-[3px] border-(--neo-ink) p-4 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-(--neo-muted) flex items-center gap-1">
                        同步标题 <span className="text-(--neo-pink)">* Required</span>
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="neo-input w-full px-3 py-3 font-black text-lg border-b-[3px] focus:bg-(--neo-surface)"
                        placeholder="输入公众号显示的标题"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-(--neo-muted)">
                        文章封面预览
                      </label>
                      <div
                        className="relative border-[3px] border-dashed border-(--neo-ink) rounded-none overflow-hidden bg-(--neo-surface) aspect-[2.35/1] flex flex-col items-center justify-center group cursor-pointer hover:border-(--neo-pink) transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {coverImage ? (
                          <>
                            <img
                              src={coverImage}
                              alt="封面预览"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <div className="bg-white border-2 border-black px-4 py-2 font-black text-xs flex items-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                                <Upload className="w-3 h-3" /> 更换这张封面
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 mx-auto mb-2 text-(--neo-muted) opacity-50" />
                            <p className="text-xs font-black text-(--neo-ink)">点击上传封面</p>
                            <p className="text-[10px] text-(--neo-muted) mt-1 font-bold">
                              建议 900x383 像素
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Status Tip */}
                  <div className="bg-(--neo-cyan) border-[3px] border-(--neo-ink) p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 shrink-0 text-(--neo-ink)" />
                      <div className="space-y-1">
                        <p className="text-xs font-black">同步提示</p>
                        <p className="text-[10px] font-bold leading-relaxed text-(--neo-ink)/80">
                          同步过程将自动把正文中的外部图片、Base64
                          图片转存到微信服务器。如遇 IP 白名单错误，可在账号配置页探测当前服务端出口 IP
                          并加入微信后台白名单。
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isLicenseActive && (
                    <div className="bg-(--neo-yellow) border-[3px] border-(--neo-ink) p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-start gap-3">
                        <Key className="w-5 h-5 shrink-0 text-(--neo-ink)" />
                        <div className="space-y-1">
                          <p className="text-xs font-black">需要 Pro License</p>
                          <p className="text-[10px] font-bold leading-relaxed text-(--neo-ink)/80">
                            微信自动同步是专业版功能。点击下方按钮输入 License Key 激活。
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSync}
                    className={`neo-button w-full py-5 text-xl font-black flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] ${
                      isLicenseActive
                        ? "bg-(--neo-green) text-white"
                        : "bg-(--neo-yellow) text-(--neo-ink)"
                    }`}
                  >
                    {isLicenseActive ? (
                      <>
                        <Send className="w-6 h-6" />
                        开始同步至草稿箱
                      </>
                    ) : (
                      <>
                        <Key className="w-6 h-6" />
                        激活 License 后同步
                      </>
                    )}
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="space-y-6 animate-in shake duration-300">
                  <div className="border-[3px] border-(--neo-ink) p-5 bg-(--neo-pink)/20 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2 text-(--neo-pink) mb-3">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-black uppercase text-sm">Sync Failed</span>
                    </div>
                    <p className="text-sm font-bold text-red-900 break-all leading-relaxed bg-white/50 p-3 border-2 border-(--neo-ink)">
                      {errorDetails}
                    </p>
                  </div>

                  {errorDetails.includes("40164") || errorDetails.includes("白名单") ? (
                    <div className="border-[4px] border-(--neo-ink) p-5 bg-(--neo-yellow) shadow-[8px_8px_0_0_rgba(0,0,0,1)] space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-2 border-b-2 border-(--neo-ink) pb-2">
                        <Star className="w-5 h-5 fill-(--neo-ink)" />
                        <p className="text-sm font-black uppercase">🎯 已捕获当前出口 IP</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold leading-relaxed">
                          检测到您的公众号尚未将当前服务端出口 IP 加入白名单。请复制下方 IP
                          并前往微信后台完成配置：
                        </p>

                        <div className="flex items-center gap-2">
                          <code className="block bg-black text-white p-4 text-center text-lg rounded-none font-mono flex-1 border-2 border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                            {serverIp || "捕获中..."}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(serverIp);
                              showToast("IP 已复制", "success");
                            }}
                            className="neo-button bg-white text-black p-4 font-black text-sm shrink-0 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                          >
                            复制
                          </button>
                        </div>

                        <div className="bg-white/50 p-3 border-2 border-(--neo-ink) text-[10px] font-bold space-y-1">
                          <p>
                            • 路径：微信开发者平台 {">"} 选择公众号 {">"} 基础信息 {">"} IP白名单
                          </p>
                          <p>
                            • 提醒：保存后通常需要{" "}
                            <span className="text-(--neo-pink) font-black">1-3 分钟</span> 才会生效
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <button
                    onClick={handleSync}
                    className="neo-button bg-(--neo-green) text-white w-full py-4 text-lg font-black flex items-center justify-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  >
                    <Loader2 className="w-5 h-5" />
                    重新尝试同步
                  </button>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-(--neo-green) stroke-[3px]" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-(--neo-ink)">
                      {status === "authorizing" && "1/3"}
                      {status === "uploading_images" && "2/3"}
                      {status === "creating_draft" && "3/3"}
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-black text-(--neo-ink) animate-pulse">
                      {status === "authorizing" && "正在获取微信授权..."}
                      {status === "uploading_images" && "正在转存正文图片..."}
                      {status === "creating_draft" && "正在推送到草稿箱..."}
                    </p>
                    <p className="text-[10px] font-bold text-(--neo-muted) uppercase tracking-widest">
                      Please wait, processing your content
                    </p>
                  </div>

                  <div className="w-full max-w-[240px] h-3 bg-white border-2 border-(--neo-ink) overflow-hidden shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                    <div
                      className="h-full bg-(--neo-green) transition-all duration-1000 ease-out"
                      style={{
                        width:
                          status === "authorizing"
                            ? "33%"
                            : status === "uploading_images"
                              ? "66%"
                              : "95%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white border-[3px] border-(--neo-ink) p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-(--neo-muted) uppercase">
                      AppID
                    </label>
                    <input
                      type="text"
                      value={draftConfig.appId}
                      onChange={(e) => setDraftConfig({ ...draftConfig, appId: e.target.value })}
                      className="neo-input w-full px-3 py-2.5 font-bold border-b-2"
                      placeholder="微信公众号后台获取"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-(--neo-muted) uppercase">
                      AppSecret
                    </label>
                    <input
                      type="password"
                      value={draftConfig.appSecret}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, appSecret: e.target.value })
                      }
                      className="neo-input w-full px-3 py-2.5 font-bold border-b-2"
                      placeholder="请确保已重置并保存"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-(--neo-muted) uppercase">
                      文章作者 (可选)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.author}
                      onChange={(e) => setDraftConfig({ ...draftConfig, author: e.target.value })}
                      className="neo-input w-full px-3 py-2.5 font-bold border-b-2"
                      placeholder="文章显示的作者名称"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveConfig}
                  className="neo-button bg-(--neo-yellow) text-(--neo-ink) w-full py-3 font-black text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_rgba(0,0,0,1)] transition-all"
                >
                  保存配置并锁定凭证
                </button>
              </div>

              <div className="bg-(--neo-cyan) border-[3px] border-(--neo-ink) p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] space-y-4">
                <p className="text-xs font-black flex items-center gap-2 border-b-2 border-(--neo-ink) pb-2 uppercase tracking-tight">
                  <ShieldCheck className="w-4 h-4" />
                  IP 白名单配置指引
                </p>

                <div className="space-y-4">
                  {!serverIp ? (
                    <div className="bg-white/50 border-2 border-dashed border-(--neo-ink) p-4 text-center">
                      <p className="text-[11px] font-bold text-(--neo-ink) leading-relaxed">
                        尚未获取出口 IP。微信对 IP
                        校验极严，建议通过下方按钮触发一次授权校验来捕获当前值。
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black text-white p-4 rounded-none border-2 border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-(--neo-yellow) uppercase">
                          当前出口 IP 已捕获
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(serverIp);
                            showToast("IP 已复制", "success");
                          }}
                          className="bg-white text-black px-2 py-0.5 text-[10px] font-black hover:bg-(--neo-yellow) transition-colors"
                        >
                          COPY
                        </button>
                      </div>
                      <code className="text-xl font-mono block text-center py-1 tracking-wider">
                        {serverIp}
                      </code>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={handleSync}
                      disabled={
                        status === "authorizing" ||
                        status === "uploading_images" ||
                        status === "creating_draft"
                      }
                      className="w-full py-3 bg-white border-[3px] border-(--neo-ink) font-black text-xs hover:bg-(--neo-yellow) transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
                    >
                      {status === "authorizing" ||
                      status === "uploading_images" ||
                      status === "creating_draft" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                      {serverIp ? "重新探测 IP" : "点击探测当前出口 IP"}
                    </button>

                    <div className="bg-white/30 border-2 border-(--neo-ink) p-3 space-y-2">
                      <p className="text-[10px] font-black flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> 如何配置？
                      </p>
                      <p className="text-[10px] font-medium leading-relaxed">
                        1. 复制上方 IP <br />
                        2. 登录 <span className="font-bold underline">微信公众平台</span> <br />
                        3. 进入{" "}
                        <span className="font-bold underline">
                          设置与开发 - 基本配置 - IP白名单
                        </span>{" "}
                        <br />
                        4. 粘贴并保存。生效通常需要{" "}
                        <span className="text-(--neo-pink) font-bold">1-3 分钟</span>。
                      </p>
                      <p className="text-[9px] font-bold text-(--neo-ink)/70 leading-relaxed italic">
                        提示：如果同步再次失败，或部署平台更换了出口 IP，请点击探测按钮重新捕获当前值。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[9px] neo-text-muted font-bold text-center">
                * AppID / AppSecret 默认保存在浏览器本地；同步时会临时发送至服务端调用微信
                API，TypeZen 不会持久化保存您的凭证
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 shrink-0 bg-(--neo-surface)/50">
          <button
            onClick={onClose}
            className="neo-button neo-button-ghost w-full py-3 font-black text-sm border-[3px] hover:bg-(--neo-pink) hover:text-white transition-all"
          >
            关闭同步面板
          </button>
        </div>
      </div>
    </div>
  );
}

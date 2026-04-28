import { Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import type React from "react";

type ImageInsertModalProps = {
  open: boolean;
  imageDesc: string;
  setImageDesc: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onLocalImage: () => void;
  onOnlineImage: () => void;
};

export function ImageInsertModal({
  open,
  imageDesc,
  setImageDesc,
  imageUrl,
  setImageUrl,
  onClose,
  onLocalImage,
  onOnlineImage,
}: ImageInsertModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="neo-modal p-6 max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-black text-(--neo-ink) mb-2 uppercase">插入图片</h3>
          <p className="text-sm neo-text-muted font-bold">选择本地图片或输入在线图片地址</p>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-black text-(--neo-ink) mb-1">
              图片描述
            </label>
            <input
              type="text"
              value={imageDesc}
              onChange={(e) => setImageDesc(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder="输入图片描述（可选）"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-[3px] bg-(--neo-ink)" />
              <span className="text-xs font-black text-(--neo-ink)">或</span>
              <div className="flex-1 h-[3px] bg-(--neo-ink)" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-(--neo-ink) mb-1">
              在线图片地址
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder="https://example.com/image.png"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLocalImage}
            className="neo-button neo-button-cyan flex-1 py-2.5 flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            选择本地图片
          </button>
          <button
            onClick={onOnlineImage}
            disabled={!imageUrl.trim()}
            className="neo-button neo-button-primary flex-1 py-2.5 flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            插入在线图片
          </button>
        </div>

        <button
          onClick={onClose}
          className="neo-button neo-button-ghost w-full mt-3 py-2.5"
        >
          取消
        </button>
      </div>
    </div>
  );
}

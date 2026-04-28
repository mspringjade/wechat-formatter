import { Coffee } from "lucide-react";

type RewardModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RewardModal({ open, onClose }: RewardModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="neo-modal p-6 max-w-sm w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-black text-(--neo-ink) mb-2 flex items-center justify-center gap-2 uppercase">
            <Coffee className="w-5 h-5" />
            请作者喝杯咖啡
          </h3>
          <p className="text-sm neo-text-muted font-bold">如果这个工具对你有帮助，欢迎支持一下~</p>
        </div>
        <div className="bg-(--neo-yellow) border-[3px] border-(--neo-ink) shadow-[5px_5px_0_0_var(--neo-ink)] p-4 mb-4">
          <img
            src="/reward.png"
            alt="赞赏码"
            className="w-48 h-48 mx-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="w-48 h-48 mx-auto flex items-center justify-center text-gray-400 text-sm">请将赞赏码保存为<br/>public/reward.png</div>';
            }}
          />
        </div>
        <p className="text-xs neo-text-muted text-center mb-4 font-bold">微信扫码赞赏，支持开发者继续维护</p>
        <button
          onClick={onClose}
          className="neo-button neo-button-ghost w-full py-2.5"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

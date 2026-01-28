import { LucideIcon } from "lucide-react";

interface CardComponentProps {
  title: string;
  content: string;
  bgColor: string;
  color: string;
  color2: string;
  trendText: string;
  icon: LucideIcon;
  trendIcon: LucideIcon;
}

export const CardComponent = ({
  title,
  content,
  bgColor,
  color,
  color2,
  trendText,
  icon: Icon,
  trendIcon: TrendIcon,
}: CardComponentProps) => {
  return (
    <div className="border border-[#334155] rounded-xl p-6 bg-[#1E293B]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-[0.6px] text-[#94A3B8] font-bold uppercase">
            {title}
          </p>
          <h2 className="lg:text-3xl text-2xl font-black">{content}</h2>
        </div>

        <div
          className="size-9 py-1.5 px-2 rounded-lg"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="w-5 h-6" style={{ color: color }} />
        </div>
      </div>

      <div className="pt-4 flex items-center gap-2" style={{ color: color2 }}>
        <TrendIcon className="w-[14.02px] h-5" />
        <small className="text-xs font-bold">{trendText}</small>
      </div>
    </div>
  );
};

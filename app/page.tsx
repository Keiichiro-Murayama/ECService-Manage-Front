import Image from "next/image";

export default function MenuPage() {
  // 共通のスタイルを定義（ホバーで浮き上がり、クリックで沈む）
  const menuCardStyle = `
    flex flex-col items-center justify-center 
    w-50 h-50 bg-secondary gap-8  border border-transparent
    cursor-pointer transition-all duration-200 ease-out
    hover:bg-secondary/80 hover:scale-105 hover:shadow-lg hover:border-primary/20
    active:scale-95 active:shadow-sm
  `;

  return (
    <div>
      <span>テスト</span>
    </div>
  );
}

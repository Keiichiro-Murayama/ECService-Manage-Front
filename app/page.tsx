import Image from "next/image";

export default function MenuPage() {
  return (
    <div className="flex items-center justify-center gap-8 p-8">
      <span className="text-xl text-primary font-bold border-5 border-rounded border-primary">
        Primary
      </span>
      <span className="text-xl text-stone-800 font-bold border-5 border-rounded border-secondary bg-secondary">
        Secondary(背景色)
      </span>
      <span className="text-xl text-tertiary font-bold border-5 border-rounded border-tertiary">
        Tertiary
      </span>
      <span className="text-xl text-destructive font-bold border-5 border-rounded border-destructive">
        Destructive
      </span>
    </div>
  );
}

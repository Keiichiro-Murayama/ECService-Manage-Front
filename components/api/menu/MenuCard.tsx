import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  actions: { label: string; href: string }[];
  icon: LucideIcon;
};

export default function MenuCard({ title, actions, icon: Icon }: Props) {
  return (
    <Card className="flex flex-col items-center gap-4 p-8 w-full max-w-sm shadow-sm ">
      <CardHeader className="flex flex-col items-center gap-2 w-full pb-4 border-b">
        <Icon className="inline-block h-20 w-20 text-muted-foreground" />
        <CardTitle className="text-xl font-bold text-center pt-2">
          {title}
        </CardTitle>
      </CardHeader>
      {/* ボタンの幅が広すぎるのでカードの30％まで */}
      <CardContent
        className="flex flex-col gap-4 items-center w-full"
        style={{ maxWidth: "80%" }}
      >
        {actions.map((action) => (
          <a key={action.label} href={action.href} className="w-full">
            <Button className="w-full text-lg  hover:shadow-md hover:scale-101 transition-transform duration-100 hover:bg-primary">
              {action.label}
            </Button>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

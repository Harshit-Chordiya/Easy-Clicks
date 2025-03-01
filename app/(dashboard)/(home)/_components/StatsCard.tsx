import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";

type Props = {
    title: string;
    value: number;
    icon: LucideIcon;
};

export default function StatsCard(props: Props) {
    return (
        <Card className="relative h-full overflow-hidden">
            <CardHeader className="flex pb-2">
                <CardTitle>{props.title}</CardTitle>
                {
                    <props.icon
                        size={120}
                        className="absolute -bottom-4 -right-8 stroke-primary text-muted-foreground opacity-10"
                    />
                }
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-primary">
                    <ReactCountUpWrapper value={props.value} />
                </div>
            </CardContent>
        </Card>
    );
}

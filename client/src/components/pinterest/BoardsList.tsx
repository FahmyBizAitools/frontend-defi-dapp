import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface BoardsListProps {
  boards: any[];
}

export function BoardsList({ boards }: BoardsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{board.nama_board}</CardTitle>
            <CardDescription className="text-sm">
              {board.target_audience}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">{board.deskripsi}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Hook</h4>
              <p className="text-sm italic text-purple-600">"{board.hook_unik}"</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Suitable Content</h4>
              <div className="flex flex-wrap gap-2">
                {board.konten_cocok.map((content: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {content}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

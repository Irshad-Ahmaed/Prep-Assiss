import { Link } from "@tanstack/react-router";
import { Pencil, Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import type { Test } from "@/types";

interface TestTableProps {
  tests: Test[];
  onDelete?: (test: Test) => void;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function TestTable({ tests, onDelete }: TestTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="text-muted-foreground">{t.subject ?? "—"}</TableCell>
              <TableCell>
                <StatusBadge status={t.status ?? "draft"} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(t.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="View">
                    <Link to="/tests/$id/preview" params={{ id: t.id }}>
                      <Eye className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link to="/tests/$id/edit" params={{ id: t.id }}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => onDelete(t)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

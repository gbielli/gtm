import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TriggerTable = ({ events, triggers, onTriggerChange }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/3">Événement</TableHead>
        <TableHead>Trigger</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Object.entries(events)
        .filter(([_, isSelected]) => isSelected)
        .map(([eventType, _]) => (
          <TableRow key={eventType}>
            <TableCell className="font-medium">{eventType}</TableCell>
            <TableCell>
              <Input
                type="text"
                value={triggers[eventType] || ""}
                onChange={(e) => onTriggerChange(eventType, e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);

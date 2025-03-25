import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Trash } from "lucide-react-native";

export default function DeviceGroupingScreen() {
  const [groupName, setGroupName] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [devices] = useState([
    { id: "1", name: "iPhone 14", type: "phone" },
    { id: "2", name: "MacBook Pro", type: "laptop" },
    { id: "3", name: "iPad Air", type: "tablet" },
  ]);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filteredDevices = useMemo(
    () =>
      devices.filter((device) =>
        device.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, devices],
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Grouping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Group Name" value={groupName} />
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <Input placeholder="Search devices..." value={search} />
          </div>
          {/* <List items={filteredDevices} onReorder={handleReorder} /> */}
          <Button>Create Group</Button>
        </CardContent>
      </Card>
      <Button variant="destructive">Delete Group</Button>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

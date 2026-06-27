import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Trainees monitoring overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            128
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Passes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            34
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Late Returns</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">
            7
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Late Minutes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            124 min
          </CardContent>
        </Card>

      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Trainee Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trainee Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

            <div className="flex justify-between text-sm">
              <span>John Doe - Returned</span>
              <Badge>On Time</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span>Mark Lee - Returned</span>
              <Badge variant="destructive">5 min late</Badge>
            </div>

          </CardContent>
        </Card>

        {/* Pass Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Pass Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">

            <div className="flex justify-between text-sm">
              <span>Liberty</span>
              <Badge>18</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span>Leave</span>
              <Badge>9</Badge>
            </div>

            <div className="flex justify-between text-sm">
              <span>Official Business</span>
              <Badge>7</Badge>
            </div>

          </CardContent>
        </Card>
        {/* Active Passes + Alerts */}



      </div>
      <div className="grid gap-4 lg:grid-cols-3">

  {/* Active Passes Table */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Active Passes</CardTitle>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trainee</TableHead>
            <TableHead>Pass Type</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>Juan Cruz</TableCell>
            <TableCell>LIBERTY</TableCell>
            <TableCell>0800H</TableCell>
            <TableCell>1700H</TableCell>
            <TableCell>
              <Badge>ACTIVE</Badge>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Mark Reyes</TableCell>
            <TableCell>LEAVE</TableCell>
            <TableCell>0900H</TableCell>
            <TableCell>1800H</TableCell>
            <TableCell>
              <Badge>ACTIVE</Badge>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Pedro Santos</TableCell>
            <TableCell>LIBERTY</TableCell>
            <TableCell>0700H</TableCell>
            <TableCell>1500H</TableCell>
            <TableCell>
              <Badge variant="destructive">
                EXPIRED
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  {/* Alerts Panel */}
  <Card>
    <CardHeader>
      <CardTitle>Alerts</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">

      <div className="flex gap-3 rounded-lg border p-3">
        <Clock className="h-5 w-5 text-yellow-500" />

        <div>
          <p className="font-medium">
            Expiring Soon
          </p>

          <p className="text-sm text-muted-foreground">
            3 passes expire within 30 minutes.
          </p>
        </div>
      </div>

      <div className="flex gap-3 rounded-lg border p-3">
        <Siren className="h-5 w-5 text-red-500" />

        <div>
          <p className="font-medium">
            Overdue Return
          </p>

          <p className="text-sm text-muted-foreground">
            2 trainees have not returned aboard.
          </p>
        </div>
      </div>

      <div className="flex gap-3 rounded-lg border p-3">
        <ShieldAlert className="h-5 w-5 text-orange-500" />

        <div>
          <p className="font-medium">
            Late Returns
          </p>

          <p className="text-sm text-muted-foreground">
            5 trainees returned late today.
          </p>
        </div>
      </div>

    </CardContent>
  </Card>

</div>
    </div>
  );
}
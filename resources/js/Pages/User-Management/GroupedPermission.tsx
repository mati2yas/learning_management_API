import { Checkbox } from "@/Components/ui/checkbox"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

interface Permission {
  name: string
}

interface PermissionGroup {
  title: string
  permissions: Permission[]
}

interface GroupedPermissionsProps {
  permissionGroups: PermissionGroup[]
  selectedPermissions: string[]
  onPermissionChange: (permission: string) => void
}

export function GroupedPermissions({
  permissionGroups,
  selectedPermissions,
  onPermissionChange,
}: GroupedPermissionsProps) {
  return (
    <div className="space-y-4 grid grid-cols-3 gap-5">
      {permissionGroups.map((group, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{group.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {group.permissions.map((permission) => (
                <div key={permission.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.name}
                    checked={selectedPermissions.includes(permission.name)}
                    onCheckedChange={() => onPermissionChange(permission.name)}
                  />
                  <Label htmlFor={permission.name}>
                    {permission.name
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


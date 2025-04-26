import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { ChevronDown, ChevronRight, Layers, Search } from "lucide-react"
import type { Department, Category } from "@/types"
import DeleteDepartmentAlert from "./delete-department-alert"
import EditDepartmentAlert from "./edit-department-alert"


interface DepartmentTableProps {
  departments: Department[]
  categories: Category[]
}

export default function DepartmentTable({ departments, categories }: DepartmentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.batches.some((batch) => batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleRow = (departmentId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }))
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Manage your course departments and associated batches</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments or batches..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <React.Fragment key={department.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRow(department.id)}
                        >
                          {expandedRows[department.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium" onClick={() => toggleRow(department.id)}>
                        {department.department_name}
                      </TableCell>
                      <TableCell onClick={() => toggleRow(department.id)}>{department.category.name}</TableCell>
                      <TableCell onClick={() => toggleRow(department.id)}>
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{department.batches.length}</span>
                          {department.batches.length > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {department.batches[0].batch_name}
                              {department.batches.length > 1 && ` +${department.batches.length - 1}`}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell onClick={() => toggleRow(department.id)}>
                        {department.created_at ? new Date(department.created_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditDepartmentAlert department={department}  />
                          <DeleteDepartmentAlert id={department.id}  />
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows[department.id] && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={6} className="p-0">
                          <div className="p-4">
                            <h4 className="text-sm font-semibold mb-2">Batches in {department.department_name}</h4>
                            {department.batches.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {department.batches.map((batch, index) => (
                                  <div key={batch.id} className="flex items-center p-2 rounded-md border bg-card">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                                    </div>
                                    <span className="font-medium">{batch.batch_name}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No batches found for this department.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No departments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


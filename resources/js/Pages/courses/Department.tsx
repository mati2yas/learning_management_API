import NavLink from "@/Components/NavLink"
import MainLayout from "@/Layouts/MainLayout"
import CreateCourseAlert from "./CreateCourseAlert"
import PermissionAlert from "@/Components/PermissionAlert"
import type { Department, Category } from "@/types"
import DepartmentTable from "./department-table"
import CreateDepartmentAlert from "./CreateDepartmentAlert"


interface DepartmentProps {
  canAdd: boolean
  departments: Department[]
  categories: Category[]
  category_id: number
}

const Department = ({ canAdd, departments, categories, category_id }: DepartmentProps) => {
  const currentPath = window.location.pathname
  const isActive = currentPath.includes("/courses/departments")

  return (
    <MainLayout
      tabTitle="Courses"
      pageTitle="Courses"
      navLinks={
        <div className="flex gap-4">
          <NavLink prefetch href={route("courses.index")} active={route().current("courses.index")}>
            Courses
          </NavLink>
          <NavLink prefetch href={route("courses.departments")} active={isActive}>
            Departments
          </NavLink>
        </div>
      }
      headerAction={
        canAdd ? (
          <CreateDepartmentAlert categoryId={category_id} />
        ) : (
<CreateDepartmentAlert categoryId={category_id} />
        )
      }
    >
      <div className="py-4">
        <DepartmentTable
          departments={departments}
          categories={categories}      />
      </div>
    </MainLayout>
  )
}

export default Department


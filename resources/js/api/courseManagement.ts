import axios from "axios"
import type { Category, Grade, Department, Batch } from "@/types"

const api = axios.create({
  baseURL: "/api", // Adjust this if your API has a different base URL
})

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories")
  return response.data
}

export const fetchGrades = async (categoryId: string): Promise<Grade[]> => {
  const response = await api.get<Grade[]>(`/grades?category_id=${categoryId}`)
  return response.data
}

export const fetchDepartments = async (categoryId: string): Promise<Department[]> => {
  const response = await api.get<Department[]>(`/departments?category_id=${categoryId}`)
  return response.data
}

export const fetchBatches = async (departmentId: string): Promise<Batch[]> => {
  const response = await api.get<Batch[]>(`/batches?department_id=${departmentId}`)
  return response.data
}


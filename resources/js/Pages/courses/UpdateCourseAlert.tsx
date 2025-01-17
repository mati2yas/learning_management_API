import { FormEventHandler, useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Category, Grade, Department, Batch } from "@/types";
import { Course } from "@/types/course";
import { Pencil } from 'lucide-react';

interface UpdateCourseAlertProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
  course: Course;
  thumbnail: string;
}

export function UpdateCourseAlert({ 
  course,   
  categories,
  grades,
  departments,
  batches,
  thumbnail,
}: UpdateCourseAlertProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(thumbnail);

  const { data, setData, put, processing, errors, reset, progress } = useForm({
    course_name: course.course_name,
    category_id: course.category_id.toString(),
    grade_id: course.grade_id?.toString() || '',
    department_id: course.department_id?.toString() || '',
    batch_id: course.batch_id?.toString() || '',
    price_one_month: course.price_one_month?.toString(),
    price_three_month: course.price_three_month?.toString(),
    price_six_month: course.price_six_month?.toString(),
    price_one_year: course.price_one_year?.toString(),
    thumbnail: null as File | null,
  });

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview !== thumbnail) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview, thumbnail]);

  const handleCategoryChange = (value: string) => {
    setData('category_id', value);
    setData('grade_id', '');
    setData('department_id', '');
    setData('batch_id', '');
  };

  const handleGradeChange = (value: string) => {
    setData('grade_id', value);
    setData('department_id', '');
    setData('batch_id', '');
  };

  const handleDepartmentChange = (value: string) => {
    setData('department_id', value);
    setData('grade_id', '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('thumbnail', file);

      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    (Object.keys(data) as (keyof typeof data)[]).forEach(key => {
      if (data[key] !== null) {
        formData.append(key, data[key] as any);
      }
    });

    put(route('courses.update', course.id), {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsOpen(false);
      },
      onError: (errors: any) => {
        console.log('Validation errors:', errors);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsOpen(true)}>
          <Pencil className="w-5 h-5 mr-2" />
          Update Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Course</AlertDialogTitle>
          <AlertDialogDescription>
            Update the course details
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center">
          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="name" value="Course Name" />
              <TextInput
                id="name"
                name="course_name"
                value={data.course_name}
                onChange={(e) => setData('course_name', e.target.value)}
                required
              />
              <InputError message={errors.course_name} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="category" value="Category" />
              <Select
                value={data.category_id}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.category_id} className="mt-2" />
            </div>

            {data.category_id && (
              <div className="mb-4">
                <InputLabel htmlFor="grade" value="Grade" />
                <Select
                  value={data.grade_id}
                  onValueChange={handleGradeChange}
                  disabled={!!data.department_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades
                      .filter((grade) => grade.category_id.toString() === data.category_id)
                      .map((grade) => (
                        <SelectItem className="flex justify-between" key={grade.id} value={grade.id.toString()}>
                          {grade.grade_name} 
                          {(grade.grade_name === 'Grade 11' || grade.grade_name === 'Grade 12') && (
                          <span className="capitalize"> - {grade.stream}</span>
                        )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.grade_id} className="mt-2" />
              </div>
            )}

            {data.category_id && (
              <div className="mb-4">
                <InputLabel htmlFor="department" value="Department" />
                <Select
                  value={data.department_id}
                  onValueChange={handleDepartmentChange}
                  disabled={!!data.grade_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept.category_id.toString() === data.category_id)
                      .sort((a, b) => a.department_name.localeCompare(b.department_name))
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.department_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.department_id} className="mt-2" />
              </div>
            )}

            {data.department_id && (
              <div className="mb-4">
                <InputLabel htmlFor="batch" value="Batch" />
                <Select
                  value={data.batch_id}
                  onValueChange={(value) => setData('batch_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches
                      .filter((batch) => batch.department_id.toString() === data.department_id)
                      .map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.batch_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.batch_id} className="mt-2" />
              </div>
            )}

            <div className="mb-4">
              <InputLabel htmlFor="price_one_month" value="Price for 1 Month" />
              <TextInput
                id="price_one_month"
                name="price_one_month"
                type="number"
                value={data.price_one_month}
                onChange={(e) => setData('price_one_month', e.target.value)}
                required
              />
              <InputError message={errors.price_one_month} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="price_three_month" value="Price for Three Months" />
              <TextInput
                id="price_three_month"
                name="price_three_month"
                type="number"
                value={data.price_three_month}
                onChange={(e) => setData('price_three_month', e.target.value)}
                required
              />
              <InputError message={errors.price_three_month} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="price_six_month" value="Price for Six Months" />
              <TextInput
                id="price_six_month"
                name="price_six_month"
                type="number"
                value={data.price_six_month}
                onChange={(e) => setData('price_six_month', e.target.value)}
                required
              />
              <InputError message={errors.price_six_month} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="price_one_year" value="Price for One Year" />
              <TextInput
                id="price_one_year"
                name="price_one_year"
                type="number"
                value={data.price_one_year}
                onChange={(e) => setData('price_one_year', e.target.value)}
                required
              />
              <InputError message={errors.price_one_year} className="mt-2" />
            </div>




            <div className="mb-4">
              <InputLabel htmlFor="thumbnail" value="Course Thumbnail" />
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full"
              />
              {thumbnailPreview && (
                <div className="mt-2">
                  <img src={thumbnailPreview || "/placeholder.svg"} alt="Thumbnail Preview" className="w-32 h-32 object-cover" />
                </div>
              )}
              {progress && (
                <progress value={progress.percentage} max="100">
                  {progress.percentage}%
                </progress>
              )}
              <InputError message={errors.thumbnail} className="mt-2" />
            </div>

            <div className="mt-6 flex gap-x-2">
              <AlertDialogCancel onClick={() => {
                setIsOpen(false);
                reset();
              }}>
                Cancel
              </AlertDialogCancel>
              <PrimaryButton type="submit" disabled={processing}>
                Update Course
              </PrimaryButton>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}


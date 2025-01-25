import { FormEventHandler, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Category, Grade, Department, Batch } from "@/types";
import { ScrollArea } from "@/Components/ui/scroll-area";

interface CreateCourseAlertProps {
  categories: Category[];
  grades: Grade[];
  departments: Department[];
  batches: Batch[];
}

export function CreateCourseAlert({ categories, grades, departments, batches }: CreateCourseAlertProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);


  const { data, setData, post, processing, errors, reset, progress } = useForm({
    course_name: '',
    category_id: '',
    grade_id: '',
    department_id: '',
    batch_id: '',
    price_one_month: '',
    price_three_month: '',
    price_six_month: '',
    price_one_year: '',
    thumbnail: null as File | null,
  });


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
      setData('thumbnail', e.target.files[0]);

      const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string); // Set the preview URL
    };
    reader.readAsDataURL(e.target.files[0]); // Read the file as a Data URL for preview
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('courses.store'), {
      onSuccess: () => {
          // toast('A course has been created')
          setIsOpen(false); // Only close on successful submission
          reset();
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="p-2 text-xs" onClick={() => setIsOpen(true)}>
          Add Course
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Course</AlertDialogTitle>
          <AlertDialogDescription>
            Fill all the required data
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="h-[60vh] px-4">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <InputLabel htmlFor="name" value="Course Name" />
              <TextInput
                id="name"
                name="course_name"
                value={data.course_name}
                onChange={(e) => setData('course_name', e.target.value)}
                required
                className="w-full"
              />
              <InputError message={errors.course_name} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                        {category.name.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.category_id} className="mt-2" />
              </div>

              {data.category_id && (
                <div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.category_id && (
                <div>
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
                <div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <InputLabel htmlFor="price_one_month" value="Price for One Month" />
                <TextInput
                  id="price_one_month"
                  name="price_one_month"
                  type="number"
                  value={data.price_one_month}
                  onChange={(e) => setData('price_one_month', e.target.value)}
                  required
                  className="w-full"
                />
                <InputError message={errors.price_one_month} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="price_three_month" value="Price for Three Months" />
                <TextInput
                  id="price_three_month"
                  name="price_three_month"
                  type="number"
                  value={data.price_three_month}
                  onChange={(e) => setData('price_three_month', e.target.value)}
                  required
                  className="w-full"
                />
                <InputError message={errors.price_three_month} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="price_six_month" value="Price for Six Months" />
                <TextInput
                  id="price_six_month"
                  name="price_six_month"
                  type="number"
                  value={data.price_six_month}
                  onChange={(e) => setData('price_six_month', e.target.value)}
                  required
                  className="w-full"
                />
                <InputError message={errors.price_six_month} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="price_one_year" value="Price for One Year" />
                <TextInput
                  id="price_one_year"
                  name="price_one_year"
                  type="number"
                  value={data.price_one_year}
                  onChange={(e) => setData('price_one_year', e.target.value)}
                  required
                  className="w-full"
                />
                <InputError message={errors.price_one_year} className="mt-2" />
              </div>
            </div>

            <div>
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

            <div className="flex justify-end gap-x-2">
              <AlertDialogCancel onClick={() => {
                setIsOpen(false);
                reset();
              }}>
                Cancel
              </AlertDialogCancel>
              <PrimaryButton type="submit" disabled={processing}>
                Add Course
              </PrimaryButton>
            </div>
          </form>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}


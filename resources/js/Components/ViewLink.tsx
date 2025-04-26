import { Link } from "@inertiajs/react"
import { Eye } from "lucide-react"

interface ViewLinkProps {
  href: any
}

const ViewLink = ({href}: ViewLinkProps) => {
  return (
    <Link href={href} className="text-blue-500 flex border border-inputbg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs items-center">
      <Eye className="h-4 w-4 mr-1" /> View
  </Link>
  )
}

export default ViewLink

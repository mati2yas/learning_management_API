import { Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

interface BackLinkProps {
  href: any
  text: string
}

const BackLink = ({href, text}: BackLinkProps) => {
  return (
    <Link prefetch 
    className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs flex items-center"
    href={href} >
      <ArrowLeft className="mr-2 h-4 w-4" /> {text}
    </Link>
  )
}

export default BackLink
